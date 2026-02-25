import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    const {
      lang,
      slug,
      title,
      excerpt,
      content_html,
      image_url,
      tags = [],
    } = payload ?? {};

    if (!lang || !slug || !title || !excerpt || !content_html || !image_url) {
      return new Response("Missing required fields", { status: 400, headers: corsHeaders });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { error } = await supabaseAdmin
      .from("blog_posts")
      .upsert(
        { lang, slug, title, excerpt, content_html, image_url, tags },
        { onConflict: "lang,slug" },
      );

    if (error) {
      return new Response(error.message, { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(String(error), { status: 500, headers: corsHeaders });
  }
});
