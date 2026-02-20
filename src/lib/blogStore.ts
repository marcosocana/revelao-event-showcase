import { blogPosts, type BlogPost } from "@/data/blogPosts";

const STORAGE_KEY = "revelao_blog_posts";

type StoredPost = Omit<BlogPost, "image"> & { image?: string };

const readStoredPosts = (): BlogPost[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(blogPosts));
      return [...blogPosts];
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

export const getBlogPosts = (): BlogPost[] => {
  return readStoredPosts();
};

const writePosts = (posts: BlogPost[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const saveBlogPost = (post: BlogPost) => {
  if (typeof window === "undefined") return;
  const stored = readStoredPosts();
  const next = [post, ...stored.filter((item) => item.slug !== post.slug)];
  writePosts(next);
};

export const updateBlogPost = (post: BlogPost) => {
  const stored = readStoredPosts();
  const next = stored.map((item) => (item.slug === post.slug ? post : item));
  writePosts(next);
};

export const deleteBlogPost = (slug: string) => {
  const stored = readStoredPosts();
  writePosts(stored.filter((item) => item.slug !== slug));
};
