import { blogPostsByLang, type BlogLanguage, type BlogPost } from "@/data/blogPosts";
import { supabase } from "@/integrations/supabase/client";

type BlogRow = {
  id: string;
  lang: BlogLanguage;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  image_url: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};

const toBlogPost = (row: BlogRow): BlogPost => {
  const date = row.created_at
    ? new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long", year: "numeric" }).format(
        new Date(row.created_at),
      )
    : "";
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    contentHtml: row.content_html,
    image: row.image_url,
    tags: row.tags ?? [],
    date,
  };
};

export const getBlogPosts = async (
  lang: BlogLanguage = "es",
  useFallback = true,
): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("lang", lang)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading blog posts:", error);
    return useFallback ? blogPostsByLang[lang] ?? blogPostsByLang.es : [];
  }

  if (!data || data.length === 0) {
    return useFallback ? blogPostsByLang[lang] ?? blogPostsByLang.es : [];
  }

  return (data as BlogRow[]).map(toBlogPost);
};

export const upsertBlogPost = async (lang: BlogLanguage, post: BlogPost) => {
  const { error } = await supabase.functions.invoke("blog-upsert", {
    body: {
      lang,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content_html: post.contentHtml,
      image_url: post.image,
      tags: post.tags ?? [],
    },
  });
  if (error) throw error;
};

export const saveBlogPost = async (lang: BlogLanguage, post: BlogPost) => {
  await upsertBlogPost(lang, post);
};

export const updateBlogPost = async (lang: BlogLanguage, post: BlogPost) => {
  await upsertBlogPost(lang, post);
};

export const deleteBlogPost = async (lang: BlogLanguage, slug: string) => {
  const { error } = await supabase.functions.invoke("blog-delete", {
    body: { lang, slug },
  });
  if (error) throw error;
};

export const uploadBlogImage = async (file: File, lang: BlogLanguage) => {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const { data, error } = await supabase.functions.invoke("blog-upload-image", {
    body: { lang, dataUrl, filename: file.name },
  });
  if (error) throw error;
  return (data as { publicUrl: string }).publicUrl;
};
