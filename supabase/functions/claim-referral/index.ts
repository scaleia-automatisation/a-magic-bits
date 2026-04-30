import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    const code = String(body?.referralCode ?? "").trim().toUpperCase();
    if (!code || code.length < 3 || code.length > 12) {
      return new Response(JSON.stringify({ error: "Invalid code" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Profil courant
    const { data: me } = await supabase
      .from("profiles")
      .select("user_id, referred_by, referral_code, created_at")
      .eq("user_id", user.id)
      .single();

    if (!me) throw new Error("Profile not found");
    if (me.referred_by) {
      return new Response(JSON.stringify({ status: "already_claimed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (me.referral_code === code) {
      return new Response(JSON.stringify({ error: "Cannot self-refer" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sécurité : doit être un compte récent (< 24h) pour éviter abus
    const ageHours = (Date.now() - new Date(me.created_at).getTime()) / 36e5;
    if (ageHours > 24) {
      return new Response(JSON.stringify({ status: "too_late" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Trouve le parrain
    const { data: inviter } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("referral_code", code)
      .single();

    if (!inviter) {
      return new Response(JSON.stringify({ error: "Invalid code" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Lie le filleul au parrain
    await supabase.from("profiles").update({ referred_by: inviter.user_id }).eq("user_id", user.id);

    // +5 crédits au parrain
    await supabase.rpc("add_credits", {
      p_user_id: inviter.user_id,
      p_amount: 5,
      p_action: "referral_signup",
    });

    // +5 crédits au filleul (bonus de bienvenue parrainage)
    await supabase.rpc("add_credits", {
      p_user_id: user.id,
      p_amount: 5,
      p_action: "referral_welcome",
    });

    // Marque l'invitation si elle existe
    if (user.email) {
      await supabase.from("referral_invitations")
        .update({ status: "converted", converted_user_id: user.id, converted_at: new Date().toISOString() })
        .eq("inviter_id", inviter.user_id)
        .ilike("invited_email", user.email);
    }

    return new Response(JSON.stringify({ status: "claimed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});