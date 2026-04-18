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
    const { action, messages, system_prompt, model, prompt, size, dalle_size, quality, ai_model, image_base64s, operation_name, task_id, input_image_url } = await req.json();

    const isNanoBananaModel = ["nano-banana-2", "nano-banana-pro"].includes(ai_model || "");

    const isVertexModel = [
      "imagen-4", "imagen-4-ultra", "imagen-4-fast",
      "veo-2", "veo-3", "veo-3-fast"
    ].includes(ai_model || "");

    const isVeoModel = ["veo-2", "veo-3", "veo-3-fast"].includes(ai_model || "");
    const isImagenModel = ["imagen-4", "imagen-4-ultra", "imagen-4-fast"].includes(ai_model || "");

    // === Nano Banana 2 / Pro image generation (Vertex AI / Gemini API) ===
    if (action === "generate_image" && isNanoBananaModel) {
      const VERTEX_API_KEY = Deno.env.get("VERTEX_API_KEY");
      if (!VERTEX_API_KEY) throw new Error("VERTEX_API_KEY is not configured");

      const nanoBananaModelMap: Record<string, string> = {
        "nano-banana-2": "gemini-3.1-flash-image-preview",
        "nano-banana-pro": "gemini-3-pro-image-preview",
      };

      const geminiModel = nanoBananaModelMap[ai_model] || "gemini-3.1-flash-image-preview";
      
      const aspectLabel = size === "9:16" ? "vertical 9:16 portrait" : size === "16:9" ? "horizontal 16:9 landscape" : "square 1:1";
      const enhancedPrompt = `Generate an image with aspect ratio ${aspectLabel}. ${prompt || ""}`;

      const nbRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${VERTEX_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: enhancedPrompt }] }],
          generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
        }),
      });

      if (!nbRes.ok) {
        const errText = await nbRes.text();
        console.error("Nano Banana error:", nbRes.status, errText);
        if (nbRes.status === 429) return jsonError(429, "Quota Vertex AI dépassé. Réessayez plus tard.");
        return jsonError(500, "Erreur lors de la génération d'image");
      }

      const nbData = await nbRes.json();
      
      // Search for inline image data in the response
      const parts = nbData?.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.mimeType?.startsWith("image/")) {
          return jsonResp({ image_url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` });
        }
      }

      console.error("Nano Banana: no image in response", JSON.stringify(nbData).substring(0, 500));
      return jsonError(500, "Pas d'image générée");
    }

    // === DALL-E 3 image generation (OpenAI) ===
    if (action === "generate_image" && !isImagenModel && !isNanoBananaModel) {
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
          size: dalle_size || size || "1024x1024",
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

    // === Veo: Helper to get OAuth2 access token from service account ===
    const getVeoAccessToken = async () => {
      const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
      if (!serviceAccountJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not configured");

      let sa: any;
      try {
        sa = JSON.parse(serviceAccountJson);
      } catch {
        throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON");
      }

      const b64url = (data: Uint8Array | string) => {
        const str = typeof data === "string" ? data : String.fromCharCode(...data);
        return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      };

      const now = Math.floor(Date.now() / 1000);
      const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
      const jwtPayload = b64url(JSON.stringify({
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

      const sigInput = new TextEncoder().encode(`${header}.${jwtPayload}`);
      const sigBytes = new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, sigInput));
      const signedJwt = `${header}.${jwtPayload}.${b64url(sigBytes)}`;

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
      return { access_token, project_id: sa.project_id };
    };

    // === Veo: START video generation (returns operation name immediately) ===
    if (action === "start_video" && isVeoModel) {
      const { access_token, project_id } = await getVeoAccessToken();

      const veoModelMap: Record<string, string> = {
        "veo-2": "veo-2.0-generate-001",
        "veo-3": "veo-3.0-generate-001",
        "veo-3-fast": "veo-3.0-fast-generate-001",
      };

      const veoModel = veoModelMap[ai_model] || "veo-3.0-generate-001";
      const aspectRatio = size === "9:16" ? "9:16" : "16:9";

      const generateUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${project_id}/locations/us-central1/publishers/google/models/${veoModel}:predictLongRunning`;

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
        console.error("Veo start error:", generateRes.status, errText);
        let msg = "Erreur Veo";
        try {
          const parsed = JSON.parse(errText);
          msg = parsed?.error?.message || msg;
        } catch { msg = errText || msg; }
        return jsonError(generateRes.status === 429 ? 429 : 500, msg);
      }

      const generateData = await generateRes.json();

      // Check immediate result
      const immediateUrl = generateData?.predictions?.[0]?.video?.uri;
      if (immediateUrl) {
        return jsonResp({ video_url: immediateUrl, done: true });
      }

      // Return operation name + model endpoint for client-side polling
      if (generateData?.name) {
        const modelEndpoint = `projects/${project_id}/locations/us-central1/publishers/google/models/${veoModel}`;
        return jsonResp({ operation_name: generateData.name, model_endpoint: modelEndpoint, done: false });
      }

      return jsonError(500, "Aucune opération retournée par Veo");
    }

    // === Veo: POLL video generation status ===
    if (action === "poll_video") {
      if (!operation_name) return jsonError(400, "Missing operation_name");
      const { access_token } = await getVeoAccessToken();

      // Extract model endpoint from the operation name
      // Format: projects/{p}/locations/{l}/publishers/google/models/{m}/operations/{id}
      const modelMatch = operation_name.match(/^(projects\/[^/]+\/locations\/[^/]+\/publishers\/google\/models\/[^/]+)\/operations\/(.+)$/);
      
      let pollUrl: string;
      if (modelMatch) {
        // Use fetchPredictOperation for publisher model operations
        pollUrl = `https://us-central1-aiplatform.googleapis.com/v1/${modelMatch[1]}:fetchPredictOperation`;
      } else {
        // Fallback to standard operations endpoint
        pollUrl = `https://us-central1-aiplatform.googleapis.com/v1/${operation_name}`;
      }

      const pollRes = await fetch(pollUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ operationName: operation_name }),
      });

      if (!pollRes.ok) {
        const pollErr = await pollRes.text();
        console.error("Veo poll error:", pollRes.status, pollErr);
        return jsonError(pollRes.status, "Erreur lors du polling Veo");
      }

      const pollData = await pollRes.json();
      console.log("Veo poll response:", JSON.stringify(pollData).substring(0, 2000));

      if (pollData.done) {
        // Check for error in the operation result
        if (pollData.error) {
          console.error("Veo operation error:", JSON.stringify(pollData.error));
          return jsonError(500, pollData.error.message || "Erreur Veo lors de la génération");
        }

        // 1. Check for video URL (uri-based responses)
        const videoUrl = pollData?.response?.predictions?.[0]?.video?.uri
                      || pollData?.response?.generatedVideos?.[0]?.video?.uri
                      || pollData?.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri
                      || pollData?.response?.videos?.[0]?.uri
                      || pollData?.response?.generatedSamples?.[0]?.video?.uri;
        
        if (videoUrl) {
          return jsonResp({ video_url: videoUrl, done: true });
        }

        // 2. Check for base64-encoded video (Veo returns bytesBase64Encoded)
        const b64Video = pollData?.response?.videos?.[0]?.bytesBase64Encoded
                      || pollData?.response?.generatedVideos?.[0]?.bytesBase64Encoded
                      || pollData?.response?.predictions?.[0]?.bytesBase64Encoded
                      || pollData?.response?.generatedSamples?.[0]?.video?.bytesBase64Encoded;

        if (b64Video) {
          return jsonResp({ video_url: `data:video/mp4;base64,${b64Video}`, done: true });
        }

        // 3. Deep search for any uri or base64
        const findMedia = (obj: any): { type: string; value: string } | null => {
          if (!obj || typeof obj !== 'object') return null;
          if (typeof obj.uri === 'string' && obj.uri.startsWith('http')) return { type: 'uri', value: obj.uri };
          if (typeof obj.gcsUri === 'string') return { type: 'uri', value: obj.gcsUri };
          if (typeof obj.bytesBase64Encoded === 'string' && obj.bytesBase64Encoded.length > 100) {
            return { type: 'b64', value: obj.bytesBase64Encoded };
          }
          for (const key of Object.keys(obj)) {
            const found = findMedia(obj[key]);
            if (found) return found;
          }
          return null;
        };

        const media = findMedia(pollData);
        if (media) {
          const url = media.type === 'uri' ? media.value : `data:video/mp4;base64,${media.value}`;
          return jsonResp({ video_url: url, done: true });
        }

        console.error("Veo done but no video found. Keys:", JSON.stringify(Object.keys(pollData?.response || {})));
        return jsonError(500, "Opération terminée mais aucune vidéo générée");
      }

    }

    // === kie.ai: START video generation ===
    if (action === "kie_start_video") {
      const KIE_AI_API_KEY = Deno.env.get("KIE_AI_API_KEY");
      if (!KIE_AI_API_KEY) return jsonError(500, "KIE_AI_API_KEY non configurée");

      // Map our internal ai_model -> kie.ai model identifier
      const kieModelMap: Record<string, string> = {
        "veo-3": "veo3",
        "veo-3.1": "veo3.1",
        "kling-2.1": "kling/2.1",
        "kling-2.5": "kling/2.5",
        "kling-2.6": "kling/2.6",
        "kling-3.0": "kling/3.0",
        "grok-imagine": "grok/imagine",
        "bytedance/seedance-2-fast": "bytedance/seedance-2-fast",
        "bytedance/seedance-2": "bytedance/seedance-2",
        "hailuo/2-3-image-to-video-standard": "hailuo/2-3-image-to-video-standard",
        "hailuo/2-3-image-to-video-standard-pro": "hailuo/2-3-image-to-video-standard-pro",
      };

      const kieModel = kieModelMap[ai_model || ""] || ai_model;
      const aspectRatio = size === "9:16" ? "9:16" : size === "1:1" ? "1:1" : "16:9";

      const startRes = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${KIE_AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: kieModel,
          input: {
            prompt: prompt || "",
            aspect_ratio: aspectRatio,
          },
        }),
      });

      const startText = await startRes.text();
      if (!startRes.ok) {
        console.error("kie.ai start error:", startRes.status, startText);
        return jsonError(startRes.status === 429 ? 429 : 500, `Erreur kie.ai: ${startText.slice(0, 300)}`);
      }

      let startJson: any;
      try { startJson = JSON.parse(startText); } catch { return jsonError(500, "Réponse kie.ai invalide"); }

      const taskId = startJson?.data?.taskId || startJson?.taskId || startJson?.data?.id || startJson?.id;
      if (!taskId) {
        console.error("kie.ai no taskId:", startText);
        return jsonError(500, "kie.ai n'a pas retourné de taskId");
      }

      return jsonResp({ task_id: taskId, done: false });
    }

    // === kie.ai: POLL video generation ===
    if (action === "kie_poll_video") {
      const KIE_AI_API_KEY = Deno.env.get("KIE_AI_API_KEY");
      if (!KIE_AI_API_KEY) return jsonError(500, "KIE_AI_API_KEY non configurée");
      if (!task_id) return jsonError(400, "Missing task_id");

      const pollRes = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(task_id)}`, {
        headers: { Authorization: `Bearer ${KIE_AI_API_KEY}` },
      });

      const pollText = await pollRes.text();
      if (!pollRes.ok) {
        console.error("kie.ai poll error:", pollRes.status, pollText);
        return jsonError(500, `Erreur polling kie.ai: ${pollText.slice(0, 200)}`);
      }

      let pollJson: any;
      try { pollJson = JSON.parse(pollText); } catch { return jsonError(500, "Réponse polling kie.ai invalide"); }

      const data = pollJson?.data || pollJson;
      const state = (data?.state || data?.status || "").toString().toLowerCase();

      // Failure states
      if (["fail", "failed", "error"].includes(state)) {
        const msg = data?.failMsg || data?.message || "Échec de la génération kie.ai";
        return jsonError(500, msg);
      }

      // Success states
      if (["success", "succeed", "succeeded", "completed", "complete"].includes(state)) {
        // Search common fields then deep-search
        const direct = data?.resultJson?.videoUrl
                    || data?.resultJson?.video_url
                    || data?.resultUrl
                    || data?.videoUrl
                    || data?.video_url
                    || data?.output?.video_url
                    || data?.output?.[0]?.url;

        const findUrl = (obj: any): string | null => {
          if (!obj || typeof obj !== "object") return null;
          for (const k of Object.keys(obj)) {
            const v = (obj as any)[k];
            if (typeof v === "string" && /^https?:\/\/.+\.(mp4|mov|webm)/i.test(v)) return v;
            if (typeof v === "string" && /^https?:\/\//i.test(v) && /video|mp4/i.test(k)) return v;
            const nested = findUrl(v);
            if (nested) return nested;
          }
          return null;
        };

        const videoUrl = direct || findUrl(data);
        if (videoUrl) return jsonResp({ video_url: videoUrl, done: true });

        console.error("kie.ai done but no video found:", pollText.slice(0, 500));
        return jsonError(500, "Génération terminée mais URL vidéo introuvable");
      }

      return jsonResp({ done: false });
    }

    // === kie.ai: START image generation (qwen/image-edit, ideogram/*) ===
    if (action === "kie_start_image") {
      const KIE_AI_API_KEY = Deno.env.get("KIE_AI_API_KEY");
      if (!KIE_AI_API_KEY) return jsonError(500, "KIE_AI_API_KEY non configurée");

      const kieImageModelMap: Record<string, string> = {
        "qwen/image-edit": "qwen/image-edit",
        "ideogram/character": "ideogram/character",
        "ideogram/image": "ideogram/image",
      };

      const kieModel = kieImageModelMap[ai_model || ""] || ai_model;
      const aspectRatio = size === "9:16" ? "9:16" : size === "1:1" ? "1:1" : "16:9";

      // Build input — qwen/image-edit and ideogram/character require an input image
      const input: Record<string, any> = {
        prompt: prompt || "",
        aspect_ratio: aspectRatio,
      };
      const needsImage = ai_model === "qwen/image-edit" || ai_model === "ideogram/character";
      if (input_image_url) {
        input.image_url = input_image_url;
        input.image = input_image_url;
      } else if (needsImage) {
        return jsonError(400, `Le modèle ${ai_model} nécessite une image de référence en entrée.`);
      }

      const startRes = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${KIE_AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: kieModel, input }),
      });

      const startText = await startRes.text();
      if (!startRes.ok) {
        console.error("kie.ai image start error:", startRes.status, startText);
        return jsonError(startRes.status === 429 ? 429 : 500, `Erreur kie.ai: ${startText.slice(0, 300)}`);
      }

      let startJson: any;
      try { startJson = JSON.parse(startText); } catch { return jsonError(500, "Réponse kie.ai invalide"); }

      const taskId = startJson?.data?.taskId || startJson?.taskId || startJson?.data?.id || startJson?.id;
      if (!taskId) {
        console.error("kie.ai image no taskId:", startText);
        return jsonError(500, "kie.ai n'a pas retourné de taskId");
      }

      return jsonResp({ task_id: taskId, done: false });
    }

    // === kie.ai: POLL image generation ===
    if (action === "kie_poll_image") {
      const KIE_AI_API_KEY = Deno.env.get("KIE_AI_API_KEY");
      if (!KIE_AI_API_KEY) return jsonError(500, "KIE_AI_API_KEY non configurée");
      if (!task_id) return jsonError(400, "Missing task_id");

      const pollRes = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(task_id)}`, {
        headers: { Authorization: `Bearer ${KIE_AI_API_KEY}` },
      });

      const pollText = await pollRes.text();
      if (!pollRes.ok) {
        console.error("kie.ai image poll error:", pollRes.status, pollText);
        return jsonError(500, `Erreur polling kie.ai: ${pollText.slice(0, 200)}`);
      }

      let pollJson: any;
      try { pollJson = JSON.parse(pollText); } catch { return jsonError(500, "Réponse polling kie.ai invalide"); }

      const data = pollJson?.data || pollJson;
      const state = (data?.state || data?.status || "").toString().toLowerCase();

      if (["fail", "failed", "error"].includes(state)) {
        const msg = data?.failMsg || data?.message || "Échec de la génération kie.ai";
        return jsonError(500, msg);
      }

      if (["success", "succeed", "succeeded", "completed", "complete"].includes(state)) {
        const findImageUrl = (obj: any): string | null => {
          if (!obj || typeof obj !== "object") return null;
          for (const k of Object.keys(obj)) {
            const v = (obj as any)[k];
            if (typeof v === "string" && /^https?:\/\/.+\.(png|jpe?g|webp)/i.test(v)) return v;
            if (typeof v === "string" && /^https?:\/\//i.test(v) && /image|img|url/i.test(k) && !/video/i.test(v)) return v;
            const nested = findImageUrl(v);
            if (nested) return nested;
          }
          return null;
        };

        const direct = data?.resultJson?.imageUrl
                    || data?.resultJson?.image_url
                    || data?.resultUrl
                    || data?.imageUrl
                    || data?.image_url
                    || data?.output?.image_url
                    || (Array.isArray(data?.output) ? data.output[0]?.url : null);

        const imageUrl = direct || findImageUrl(data);
        if (imageUrl) return jsonResp({ image_url: imageUrl, done: true });

        console.error("kie.ai image done but no url:", pollText.slice(0, 500));
        return jsonError(500, "Génération terminée mais URL image introuvable");
      }

      return jsonResp({ done: false });
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
