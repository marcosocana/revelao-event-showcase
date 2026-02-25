import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const decodeDataUrl = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!match) return null;
  return { contentType: match[1], base64: match[2] };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response("Missing Supabase env vars", { status: 500, headers: corsHeaders });
    }

    const payload = await req.json();
    const { lang, dataUrl, filename } = payload ?? {};

    if (!lang || !dataUrl) {
      return new Response("Missing required fields", { status: 400, headers: corsHeaders });
    }

    const decoded = decodeDataUrl(String(dataUrl));
    if (!decoded) {
      return new Response("Invalid dataUrl", { status: 400, headers: corsHeaders });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    const extFromName = typeof filename === "string" ? filename.split(".").pop() : "png";
    const extFromMime = decoded.contentType.split("/").pop() || "png";
    const fileExt = extFromName || extFromMime || "png";
    const filePath = `${lang}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const fileBytes = Uint8Array.from(atob(decoded.base64), (c) => c.charCodeAt(0));

    const { error } = await supabaseAdmin.storage.from("blog-images").upload(filePath, fileBytes, {
      contentType: decoded.contentType,
      upsert: true,
    });

    if (error) {
      return new Response(error.message, { status: 500, headers: corsHeaders });
    }

    const { data } = supabaseAdmin.storage.from("blog-images").getPublicUrl(filePath);

    return new Response(JSON.stringify({ publicUrl: data.publicUrl }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(String(error), { status: 500, headers: corsHeaders });
  }
});
