import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from "npm:@google/genai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const jsonResp = (body: object, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const jsonError = (status: number, error: string) => jsonResp({ error }, status);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, messages, system_prompt, model, prompt, size, quality, ai_model, image_base64s } = await req.json();

    const isVertexModel = [
      "imagen-4", "imagen-4-ultra", "imagen-4-fast",
      "veo-2", "veo-3", "veo-3-fast"
    ].includes(ai_model || "");

    const isVeoModel = ["veo-2", "veo-3", "veo-3-fast"].includes(ai_model || "");
    const isImagenModel = ["imagen-4", "imagen-4-ultra", "imagen-4-fast"].includes(ai_model || "");

    // === DALL-E 3 image generation (OpenAI) ===
    if (action === "generate_image" && !isImagenModel) {
      const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
      if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

      const dalleRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt || "",
          n: 1,
          size: size || "1024x1024",
          quality: quality || "hd",
          response_format: "url",
        }),
      });

      if (!dalleRes.ok) {
        const errText = await dalleRes.text();
        console.error("DALL-E 3 error:", dalleRes.status, errText);
        return jsonError(dalleRes.status === 429 ? 429 : 500, dalleRes.status === 429 ? "Limite de requêtes OpenAI atteinte." : "Erreur DALL-E 3");
      }

      const dalleData = await dalleRes.json();
      return jsonResp({ image_url: dalleData?.data?.[0]?.url });
    }

    // === Imagen 4 image generation (Vertex AI / Gemini API) ===
    if (action === "generate_image" && isImagenModel) {
      const VERTEX_API_KEY = Deno.env.get("VERTEX_API_KEY");
      if (!VERTEX_API_KEY) throw new Error("VERTEX_API_KEY is not configured");

      const imagenModelMap: Record<string, string> = {
        "imagen-4": "imagen-4.0-generate-001",
        "imagen-4-ultra": "imagen-4.0-ultra-generate-001",
        "imagen-4-fast": "imagen-4.0-fast-generate-001",
      };

      const geminiModel = imagenModelMap[ai_model] || "imagen-4.0-generate-001";

      const aspectRatio = size === "1024x1792" || size === "9:16" ? "9:16" : size === "1792x1024" || size === "16:9" ? "16:9" : "1:1";

      const imagenRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:predict?key=${VERTEX_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: prompt || "" }],
          parameters: { sampleCount: 1, aspectRatio },
        }),
      });

      if (!imagenRes.ok) {
        const errText = await imagenRes.text();
        console.error("Imagen error:", imagenRes.status, errText);
        let msg = "Erreur Imagen";
        try {
          const parsed = JSON.parse(errText);
          msg = parsed?.error?.message || msg;
        } catch { msg = errText || msg; }
        if (imagenRes.status === 429 || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("resource_exhausted")) {
          msg = "Quota Vertex AI dépassé. Vérifiez la facturation et les limites de votre clé API.";
        }
        return jsonError(imagenRes.status === 429 ? 429 : 500, msg);
      }

      const imagenData = await imagenRes.json();
      const b64 = imagenData?.predictions?.[0]?.bytesBase64Encoded;
      if (b64) {
        return jsonResp({ image_url: `data:image/png;base64,${b64}` });
      }
      return jsonError(500, "Pas d'image générée par Imagen");
    }

    // === Sora 2 video generation (OpenAI) ===
    if (action === "generate_video" && !isVeoModel) {
      const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
      if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

      const soraRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sora-2",
          prompt: prompt || "",
          n: 1,
          size: size || "1920x1080",
        }),
      });

      if (!soraRes.ok) {
        const errText = await soraRes.text();
        console.error("Sora 2 error:", soraRes.status, errText);
        return jsonError(soraRes.status === 429 ? 429 : 500, soraRes.status === 429 ? "Limite de requêtes OpenAI atteinte." : "Erreur Sora 2");
      }

      const soraData = await soraRes.json();
      return jsonResp({ video_url: soraData?.data?.[0]?.url });
    }

    // === Veo video generation (Vertex AI via Service Account OAuth2) ===
    if (action === "generate_video" && isVeoModel) {
      const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
      if (!serviceAccountJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not configured");

      let sa: any;
      try {
        sa = JSON.parse(serviceAccountJson);
      } catch {
        throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON");
      }

      // Build JWT for OAuth2 token using Web Crypto
      const b64url = (data: Uint8Array | string) => {
        const str = typeof data === "string" ? data : String.fromCharCode(...data);
        return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      };

      const now = Math.floor(Date.now() / 1000);
      const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
      const payload = b64url(JSON.stringify({
        iss: sa.client_email,
        scope: "https://www.googleapis.com/auth/cloud-platform",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      }));

      const pemBody = sa.private_key
        .replace(/-----BEGIN PRIVATE KEY-----/, "")
        .replace(/-----END PRIVATE KEY-----/, "")
        .replace(/\n/g, "");
      const binaryKey = Uint8Array.from(atob(pemBody), (c: string) => c.charCodeAt(0));
      const cryptoKey = await crypto.subtle.importKey(
        "pkcs8",
        binaryKey,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const sigInput = new TextEncoder().encode(`${header}.${payload}`);
      const sigBytes = new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, sigInput));
      const signedJwt = `${header}.${payload}.${b64url(sigBytes)}`;

      // Exchange JWT for access token
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${signedJwt}`,
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        console.error("OAuth2 token error:", errText);
        throw new Error("Impossible d'obtenir un token OAuth2");
      }

      const { access_token } = await tokenRes.json();

      const veoModelMap: Record<string, string> = {
        "veo-2": "veo-2.0-generate-001",
        "veo-3": "veo-3.0-generate-001",
        "veo-3-fast": "veo-3.0-fast-generate-001",
      };

      const veoModel = veoModelMap[ai_model] || "veo-3.0-generate-001";
      const aspectRatio = size === "9:16" ? "9:16" : "16:9";
      const projectId = sa.project_id;

      // Start video generation via Vertex AI REST API
      const generateUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/${veoModel}:predictLongRunning`;

      const generateRes = await fetch(generateUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instances: [{ prompt: prompt || "" }],
          parameters: { aspectRatio, sampleCount: 1 },
        }),
      });

      if (!generateRes.ok) {
        const errText = await generateRes.text();
        console.error("Veo generate error:", generateRes.status, errText);
        let msg = "Erreur Veo";
        try {
          const parsed = JSON.parse(errText);
          msg = parsed?.error?.message || msg;
        } catch { msg = errText || msg; }
        return jsonError(generateRes.status === 429 ? 429 : 500, msg);
      }

      const generateData = await generateRes.json();
      
      // Check if result is immediate or requires polling
      let videoUrl = generateData?.predictions?.[0]?.video?.uri;
      
      if (!videoUrl && generateData?.name) {
        // Long-running operation - poll for completion
        const operationName = generateData.name;
        
        for (let attempt = 0; attempt < 60; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          
          const pollRes = await fetch(`https://us-central1-aiplatform.googleapis.com/v1/${operationName}`, {
            headers: { Authorization: `Bearer ${access_token}` },
          });
          
          if (!pollRes.ok) {
            const pollErr = await pollRes.text();
            console.error("Veo poll error:", pollRes.status, pollErr);
            continue;
          }
          
          const pollData = await pollRes.json();
          
          if (pollData.done) {
            videoUrl = pollData?.response?.predictions?.[0]?.video?.uri 
                    || pollData?.response?.generatedVideos?.[0]?.video?.uri;
            break;
          }
        }
      }

      if (!videoUrl) {
        console.error("Veo: no video URL in response:", JSON.stringify(generateData));
        return jsonError(500, "Aucune vidéo générée par Veo");
      }

      return jsonResp({ video_url: videoUrl });
    }

    // === OpenAI Chat Completions for prompts, ideas, captions ===
    if (!messages) {
      return jsonError(400, "Missing messages");
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    const selectedModel = model || "gpt-4o";

    const builtMessages: any[] = [];
    if (system_prompt) {
      builtMessages.push({ role: "system", content: system_prompt });
    }

    if (image_base64s && image_base64s.length > 0) {
      const userContent: any[] = [];
      for (const b64 of image_base64s) {
        userContent.push({
          type: "image_url",
          image_url: { url: b64, detail: "low" },
        });
      }
      const textContent = messages.map((m: any) => m.content).join('\n');
      userContent.push({ type: "text", text: textContent });
      builtMessages.push({ role: "user", content: userContent });
    } else {
      builtMessages.push(...messages);
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: builtMessages,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI error:", response.status, text);
      return jsonError(response.status === 429 ? 429 : 500, response.status === 429 ? "Limite de requêtes OpenAI atteinte." : "Erreur du service OpenAI");
    }

    const data = await response.json();
    return jsonResp(data);
  } catch (e) {
    console.error("kreator-ai error:", e);
    return jsonError(500, e instanceof Error ? e.message : "Erreur inconnue");
  }
});
