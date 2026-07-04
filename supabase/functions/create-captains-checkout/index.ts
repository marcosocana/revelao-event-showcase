import Stripe from "https://esm.sh/stripe@18.5.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const gamePriceId = Deno.env.get("STRIPE_CAPTAINS_GAME_PRICE_ID");
    const boxPriceId = Deno.env.get("STRIPE_CAPTAINS_BOX_PRICE_ID");
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://revelao.cam";

    if (!stripeKey || !gamePriceId || !boxPriceId) {
      return new Response(JSON.stringify({ error: "Missing Stripe configuration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const rawTables = Number(body?.tableCount);
    const includeBox = Boolean(body?.includeCaptainBox);

    if (!Number.isFinite(rawTables) || rawTables < 1) {
      return new Response(JSON.stringify({ error: "Invalid tableCount" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const tableCount = Math.min(Math.floor(rawTables), 500);

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      { price: gamePriceId, quantity: tableCount },
    ];
    if (includeBox) {
      lineItems.push({ price: boxPriceId, quantity: tableCount });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${siteUrl}/capitanes?checkout=success`,
      cancel_url: `${siteUrl}/capitanes?checkout=cancel`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
