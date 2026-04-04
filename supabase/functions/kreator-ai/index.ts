import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const jsonError = (status: number, error: string) =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const getProviderErrorMessage = (status: number, rawText: string, fallback: string) => {
  let message = fallback;

  try {
    const parsed = JSON.parse(rawText);
    message = parsed?.error?.message || fallback;
  } catch {
    message = rawText || fallback;
  }

  if (message.includes("not available in your country")) {
    return "La génération d’images Gemini n’est pas disponible dans votre pays avec cette clé API.";
  }

  if (status === 429 || message.toLowerCase().includes("quota") || message.toLowerCase().includes("resource_exhausted")) {
    return "Quota Gemini dépassé. Vérifiez la facturation et les limites de votre clé API Gemini.";
  }

  return message;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, messages, system_prompt, model, prompt, size, quality, ai_model, image_base64s } = await req.json();

    // Determine which API key to use based on model
    const isGeminiModel = ["nano-banana-2", "nano-banana-pro", "imagen"].includes(ai_model || model || "");
    const isVeo = ["veo-3", "veo-3-fast"].includes(ai_model || "");

    // === DALL-E 3 image generation (OpenAI) ===
    if (action === "generate_image" && !isGeminiModel) {
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
        return new Response(JSON.stringify({ error: dalleRes.status === 429 ? "Limite de requêtes OpenAI atteinte." : "Erreur DALL-E 3" }), {
          status: dalleRes.status === 429 ? 429 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const dalleData = await dalleRes.json();
      return new Response(JSON.stringify({ image_url: dalleData?.data?.[0]?.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === Gemini image generation (Nano Banana 2, Nano Banana Pro, Imagen) ===
    if (action === "generate_image" && isGeminiModel) {
      const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
      if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

      // Map model names to valid Gemini image-capable model IDs
      const geminiModelMap: Record<string, string> = {
        "nano-banana-2": "gemini-3.1-flash-image-preview",
        "nano-banana-pro": "gemini-3-pro-image-preview",
        "imagen": "imagen-4.0-generate-001",
      };

      const selectedModel = ai_model || model || "nano-banana-2";
      const geminiModel = geminiModelMap[selectedModel] || "gemini-3.1-flash-image-preview";

      // For Imagen, use the Imagen predict API
      if (selectedModel === "imagen") {
        const imagenRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:predict?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instances: [{ prompt: prompt || "" }],
            parameters: { sampleCount: 1, aspectRatio: size === "1024x1792" ? "9:16" : size === "1792x1024" ? "16:9" : "1:1" },
          }),
        });

        if (!imagenRes.ok) {
          const errText = await imagenRes.text();
          console.error("Imagen error:", imagenRes.status, errText);
          return jsonError(imagenRes.status === 429 ? 429 : 500, getProviderErrorMessage(imagenRes.status, errText, "Erreur Imagen"));
        }

        const imagenData = await imagenRes.json();
        const b64 = imagenData?.predictions?.[0]?.bytesBase64Encoded;
        if (b64) {
          return new Response(JSON.stringify({ image_url: `data:image/png;base64,${b64}` }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ error: "Pas d'image générée" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // For Nano Banana models, use Gemini generateContent with image output
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt || "" }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
      });

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        console.error("Gemini image error:", geminiRes.status, errText);
        return jsonError(geminiRes.status === 429 ? 429 : 500, getProviderErrorMessage(geminiRes.status, errText, "Erreur Gemini"));
      }

      const geminiData = await geminiRes.json();
      const parts = geminiData?.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p: any) => p.inlineData);
      if (imagePart?.inlineData) {
        const mimeType = imagePart.inlineData.mimeType || "image/png";
        return new Response(JSON.stringify({ image_url: `data:${mimeType};base64,${imagePart.inlineData.data}` }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Pas d'image générée par Gemini" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === Sora 2 video generation (OpenAI) ===
    if (action === "generate_video" && !isVeo) {
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
        return new Response(JSON.stringify({ error: soraRes.status === 429 ? "Limite de requêtes OpenAI atteinte." : "Erreur Sora 2" }), {
          status: soraRes.status === 429 ? 429 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const soraData = await soraRes.json();
      return new Response(JSON.stringify({ video_url: soraData?.data?.[0]?.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === Veo 3 video generation (Google) ===
    if (action === "generate_video" && isVeo) {
      const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
      if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

      const veoModel = ai_model === "veo-3-fast" ? "veo-3.0-generate-preview" : "veo-3.0-generate-preview";
      
      const veoRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${veoModel}:predictLongRunning?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: prompt || "" }],
          parameters: { aspectRatio: size === "9:16" ? "9:16" : "16:9", durationSeconds: 8 },
        }),
      });

      if (!veoRes.ok) {
        const errText = await veoRes.text();
        console.error("Veo 3 error:", veoRes.status, errText);
        return new Response(JSON.stringify({ error: "Erreur Veo 3" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const veoData = await veoRes.json();
      return new Response(JSON.stringify(veoData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === OpenAI Chat Completions for prompts, ideas, captions ===
    if (!messages) {
      return new Response(JSON.stringify({ error: "Missing messages" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    const selectedModel = model || "gpt-4o";
    
    // Build messages - if image_base64s provided, use vision format
    const builtMessages: any[] = [];
    if (system_prompt) {
      builtMessages.push({ role: "system", content: system_prompt });
    }
    
    if (image_base64s && image_base64s.length > 0) {
      // Build multimodal message with images + text
      const userContent: any[] = [];
      for (const b64 of image_base64s) {
        // b64 is "data:image/...;base64,..." format
        userContent.push({
          type: "image_url",
          image_url: { url: b64, detail: "low" },
        });
      }
      // Add text content from messages
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
      return new Response(JSON.stringify({ error: response.status === 429 ? "Limite de requêtes OpenAI atteinte." : "Erreur du service OpenAI" }), {
        status: response.status === 429 ? 429 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("kreator-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
