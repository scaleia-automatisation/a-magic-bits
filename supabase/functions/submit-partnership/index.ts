import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const INTERNAL_NOTIFY_EMAIL = "bonjour@creafacile.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.json().catch(() => ({}));
    const fullName = String(body?.fullName ?? "").trim().slice(0, 120);
    const email = String(body?.email ?? "").trim().toLowerCase().slice(0, 255);
    const partnerType = String(body?.partnerType ?? "").trim().slice(0, 60);
    const audienceSize = String(body?.audienceSize ?? "").trim().slice(0, 60);
    const socialHandle = String(body?.socialHandle ?? "").trim().slice(0, 200);
    const message = String(body?.message ?? "").trim().slice(0, 2000);

    if (!fullName || !EMAIL_RE.test(email) || !partnerType || message.length < 10) {
      return new Response(JSON.stringify({ error: "Champs invalides" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: row, error: insertErr } = await supabase
      .from("partnership_requests")
      .insert({
        full_name: fullName,
        email,
        partner_type: partnerType,
        audience_size: audienceSize || null,
        social_handle: socialHandle || null,
        message,
      })
      .select("id")
      .single();

    if (insertErr) throw insertErr;

    // Email interne de notification → équipe Créafacile
    await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "partnership-request",
        recipientEmail: INTERNAL_NOTIFY_EMAIL,
        idempotencyKey: `partnership-${row?.id}`,
        templateData: {
          fromName: fullName,
          fromEmail: email,
          partnerType: socialHandle ? `${partnerType} (${socialHandle})` : partnerType,
          audienceSize,
          message,
        },
      },
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});