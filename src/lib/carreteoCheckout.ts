// El pago de Carreteo lo crea el backend de acceso.revelao.cam (tomorrow-snap-reveal,
// función stripe-create-checkout-session). Su webhook de Stripe envía al comprador
// el email con el enlace y el código para registrar su evento.
const appSupabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL as string | undefined;
const appSupabaseKey = import.meta.env.VITE_APP_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export type CarreteoPlanId = "carreteo_50" | "carreteo_150" | "carreteo_250";

export const startCarreteoCheckout = async (planId: CarreteoPlanId) => {
  if (!appSupabaseUrl || !appSupabaseKey) throw new Error("MISSING_APP_SUPABASE_CONFIG");
  const landingUrl = `${window.location.origin}/carreteo`;
  const response = await fetch(`${appSupabaseUrl}/functions/v1/stripe-create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: appSupabaseKey,
      Authorization: `Bearer ${appSupabaseKey}`,
    },
    body: JSON.stringify({
      planId,
      // Vuelta a esta landing tras pagar o cancelar (el backend solo acepta dominios de Revelao).
      successUrl: `${landingUrl}?checkout=success`,
      cancelUrl: `${landingUrl}?checkout=cancel#planes`,
    }),
  });
  const payload = await response.json().catch(() => ({})) as { url?: string; error?: string };
  if (!response.ok || !payload.url) throw new Error(payload.error || `HTTP_${response.status}`);
  window.location.assign(payload.url);
};
