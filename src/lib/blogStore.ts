import { blogPostsByLang, type BlogLanguage, type BlogPost } from "@/data/blogPosts";

const STORAGE_KEY = "revelao_blog_posts";

type StoredPost = Omit<BlogPost, "image"> & { image?: string };

const readStoredPosts = (lang: BlogLanguage): BlogPost[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(`${STORAGE_KEY}_${lang}`);
    if (!raw) {
      const seed = blogPostsByLang[lang] ?? blogPostsByLang.es;
      window.localStorage.setItem(`${STORAGE_KEY}_${lang}`, JSON.stringify(seed));
      return [...seed];
    }
    const parsed = JSON.parse(raw) as StoredPost[];
    return parsed
      .filter((post: any) => post.slug && post.title && post.excerpt && (post.contentHtml || post.content?.length))
      .map((post: any) => {
        if (!post.contentHtml && Array.isArray(post.content)) {
          const contentHtml = post.content.map((line: string) => `<p>${line}</p>`).join("");
          return { ...post, contentHtml, image: post.image || "" };
        }
        return { ...post, contentHtml: post.contentHtml || "", image: post.image || "" };
      });
  } catch {
    return [];
  }
};

export const getBlogPosts = (lang: BlogLanguage = "es"): BlogPost[] => {
  return readStoredPosts(lang);
};

const writePosts = (lang: BlogLanguage, posts: BlogPost[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${STORAGE_KEY}_${lang}`, JSON.stringify(posts));
};

export const saveBlogPost = (lang: BlogLanguage, post: BlogPost) => {
  if (typeof window === "undefined") return;
  const stored = readStoredPosts(lang);
  const next = [post, ...stored.filter((item) => item.slug !== post.slug)];
  writePosts(lang, next);
};

export const updateBlogPost = (lang: BlogLanguage, post: BlogPost) => {
  const stored = readStoredPosts(lang);
  const next = stored.map((item) => (item.slug === post.slug ? post : item));
  writePosts(lang, next);
};

export const deleteBlogPost = (lang: BlogLanguage, slug: string) => {
  const stored = readStoredPosts(lang);
  writePosts(lang, stored.filter((item) => item.slug !== slug));
};
