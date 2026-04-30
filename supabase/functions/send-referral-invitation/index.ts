import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://creafacile.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Not authenticated");
    const user = userData.user;

    const body = await req.json().catch(() => ({}));
    const emailsRaw: string[] = Array.isArray(body?.emails) ? body.emails : [];
    const emails = Array.from(new Set(
      emailsRaw.map((e) => String(e).trim().toLowerCase()).filter((e) => EMAIL_RE.test(e))
    )).slice(0, 10);

    if (emails.length === 0) {
      return new Response(JSON.stringify({ error: "No valid emails" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("referral_code, display_name")
      .eq("user_id", user.id)
      .single();

    if (!profile?.referral_code) throw new Error("Missing referral code");

    const inviterName = profile.display_name || (user.email?.split("@")[0] ?? "Un ami");
    const signupUrl = `${SITE_URL}/auth?ref=${profile.referral_code}`;

    const results: Array<{ email: string; ok: boolean; reason?: string }> = [];

    for (const email of emails) {
      // Skip si l'email est déjà inscrit
      if (user.email && email === user.email.toLowerCase()) {
        results.push({ email, ok: false, reason: "self" });
        continue;
      }

      // Enregistre l'invitation (idempotent via UNIQUE)
      const { error: insertErr } = await supabase.from("referral_invitations").insert({
        inviter_id: user.id,
        invited_email: email,
        referral_code: profile.referral_code,
      });

      // Envoie l'email (queue)
      const { error: sendErr } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "referral-invitation",
          recipientEmail: email,
          idempotencyKey: `referral-${user.id}-${email}`,
          templateData: {
            inviterName,
            referralCode: profile.referral_code,
            signupUrl,
          },
        },
      });

      results.push({
        email,
        ok: !sendErr,
        reason: sendErr ? "send_failed" : (insertErr ? "already_invited" : undefined),
      });
    }

    return new Response(JSON.stringify({ sent: results.filter(r => r.ok).length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});