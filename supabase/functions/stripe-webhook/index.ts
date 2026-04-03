import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  console.log(`[STRIPE-WEBHOOK] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
};

const PLAN_MAP: Record<string, { plan: string; credits: number }> = {
  "prod_UGoxPc1EAXScVJ": { plan: "pro", credits: 30 },
  "prod_UGoxTqXcvOco9s": { plan: "premium", credits: 50 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    logStep("ERROR", { message: "STRIPE_SECRET_KEY not set" });
    return new Response("Server error", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    // If webhook secret is configured, verify signature
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    let event: Stripe.Event;

    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Signature verified");
    } else {
      event = JSON.parse(body) as Stripe.Event;
      logStep("No webhook secret, parsing event directly");
    }

    logStep("Event received", { type: event.type, id: event.id });

    switch (event.type) {
      // New subscription or renewal
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.subscription) break;

        const customerEmail = invoice.customer_email;
        if (!customerEmail) {
          logStep("No customer email on invoice");
          break;
        }

        // Get subscription to find the product
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        const productId = subscription.items.data[0]?.price?.product as string;
        const planInfo = PLAN_MAP[productId];

        if (!planInfo) {
          logStep("Unknown product", { productId });
          break;
        }

        logStep("Processing credit renewal", { email: customerEmail, plan: planInfo.plan, credits: planInfo.credits });

        // Find user by email
        const { data: users } = await supabase.auth.admin.listUsers();
        const matchedUser = users?.users?.find(u => u.email === customerEmail);

        if (!matchedUser) {
          logStep("User not found for email", { email: customerEmail });
          break;
        }

        // Update plan and add credits
        await supabase
          .from("profiles")
          .update({ plan: planInfo.plan })
          .eq("user_id", matchedUser.id);

        await supabase.rpc("add_credits", {
          p_user_id: matchedUser.id,
          p_amount: planInfo.credits,
          p_action: `renewal_${planInfo.plan}`,
        });

        logStep("Credits renewed successfully", { userId: matchedUser.id, credits: planInfo.credits });
        break;
      }

      // Subscription cancelled or expired
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;

        if (!customer.email) break;

        const { data: users } = await supabase.auth.admin.listUsers();
        const matchedUser = users?.users?.find(u => u.email === customer.email);

        if (matchedUser) {
          await supabase
            .from("profiles")
            .update({ plan: "free" })
            .eq("user_id", matchedUser.id);

          logStep("Subscription cancelled, reverted to free", { userId: matchedUser.id });
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
