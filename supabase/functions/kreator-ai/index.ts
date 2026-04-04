import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    const { action, messages, system_prompt, model, prompt, size, quality } = await req.json();

    // === DALL-E 3 image generation ===
    if (action === "generate_image_dalle") {
      const dalleRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt || messages?.[0]?.content || "",
          n: 1,
          size: size || "1024x1024",
          quality: quality || "hd",
          response_format: "url",
        }),
      });

      if (!dalleRes.ok) {
        const errText = await dalleRes.text();
        console.error("DALL-E 3 error:", dalleRes.status, errText);
        if (dalleRes.status === 429) {
          return new Response(JSON.stringify({ error: "Limite de requêtes OpenAI atteinte." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ error: "Erreur DALL-E 3" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const dalleData = await dalleRes.json();
      return new Response(JSON.stringify(dalleData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === Sora 2 video generation ===
    if (action === "generate_video_sora") {
      const soraRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sora-2",
          prompt: prompt || messages?.[0]?.content || "",
          n: 1,
          size: size || "1920x1080",
        }),
      });

      if (!soraRes.ok) {
        const errText = await soraRes.text();
        console.error("Sora 2 error:", soraRes.status, errText);
        if (soraRes.status === 429) {
          return new Response(JSON.stringify({ error: "Limite de requêtes OpenAI atteinte." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ error: "Erreur Sora 2" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const soraData = await soraRes.json();
      return new Response(JSON.stringify(soraData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === OpenAI Chat Completions for prompts, ideas, captions ===
    if (!action || !messages) {
      return new Response(JSON.stringify({ error: "Missing action or messages" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const selectedModel = model || "gpt-4o";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          ...(system_prompt ? [{ role: "system", content: system_prompt }] : []),
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI error:", response.status, text);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requêtes OpenAI atteinte." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Erreur du service OpenAI" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
