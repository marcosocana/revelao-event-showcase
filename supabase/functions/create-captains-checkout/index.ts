const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type CaptainsCheckoutPayload = {
  tableCount?: number;
  includeCaptainBox?: boolean;
};

const parseTableCount = (value: unknown) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 1;
  }

  return Math.min(200, Math.max(1, Math.floor(numericValue)));
};

const appendLineItem = (params: URLSearchParams, index: number, priceId: string, quantity: number) => {
  params.append(`line_items[${index}][price]`, priceId);
  params.append(`line_items[${index}][quantity]`, String(quantity));
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const gamePriceId = Deno.env.get("STRIPE_CAPTAINS_GAME_PRICE_ID");
    const captainBoxPriceId = Deno.env.get("STRIPE_CAPTAINS_BOX_PRICE_ID");

    if (!stripeSecretKey || !gamePriceId || !captainBoxPriceId) {
      return new Response("Missing Stripe environment variables", { status: 500, headers: corsHeaders });
    }

    const payload = (await req.json()) as CaptainsCheckoutPayload;
    const tableCount = parseTableCount(payload?.tableCount);
    const includeCaptainBox = Boolean(payload?.includeCaptainBox);
    const origin = req.headers.get("origin") ?? Deno.env.get("SITE_URL") ?? "https://revelao.cam";

    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("success_url", `${origin}/capitanes?checkout=success`);
    params.append("cancel_url", `${origin}/capitanes?checkout=cancelled`);
    params.append("client_reference_id", `capitanes-${tableCount}-mesas-${includeCaptainBox ? "con-pack" : "sin-pack"}`);
    params.append("metadata[product]", "capitanes");
    params.append("metadata[table_count]", String(tableCount));
    params.append("metadata[include_captain_box]", String(includeCaptainBox));
    appendLineItem(params, 0, gamePriceId, tableCount);

    if (includeCaptainBox) {
      appendLineItem(params, 1, captainBoxPriceId, tableCount);
    }

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const stripePayload = await stripeResponse.json();

    if (!stripeResponse.ok) {
      const message = stripePayload?.error?.message ?? "Stripe checkout creation failed";
      return new Response(message, { status: 502, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ url: stripePayload.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(String(error), { status: 500, headers: corsHeaders });
  }
});
