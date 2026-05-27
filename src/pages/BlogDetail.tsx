import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { getBlogPosts } from "@/lib/blogStore";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import icon from "@/assets/ico.png";
import { Navbar } from "@/components/Navbar";
import type { BlogPost } from "@/data/blogPosts";

const BlogDetail = () => {
  const { slug } = useParams();
  const { lang } = useI18n();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const posts = await getBlogPosts(lang);
      const found = posts.find((item) => item.slug === slug) ?? null;
      if (mounted) {
        setPost(found);
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [slug, lang]);

  useEffect(() => {
    if (!post) return;
    const canonicalUrl = `https://www.revelao.cam/blog/${post.slug}`;
    const title = `${post.title} | Revelao.cam`;
    const description = post.excerpt;
    const image = post.image?.startsWith("http") ? post.image : `https://www.revelao.cam${post.image}`;
    document.title = title;

    const setMeta = (name: string, value: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };
    const setProperty = (property: string, value: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };

    setMeta("description", description);
    setMeta("keywords", post.tags?.join(", ") || "qr boda, fotos boda qr, galería privada boda");
    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:url", canonicalUrl);
    setProperty("og:image", image);
    setProperty("og:type", "article");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);

    let canonical = document.querySelector(`link[rel="canonical"]`);
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    let ld = document.getElementById("ld-blog-post");
    if (!ld) {
      ld = document.createElement("script");
      ld.setAttribute("type", "application/ld+json");
      ld.setAttribute("id", "ld-blog-post");
      document.head.appendChild(ld);
    }
    const publishedDate = post.publishedAt || post.updatedAt || post.date;
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description,
      image,
      mainEntityOfPage: canonicalUrl,
      author: { "@type": "Organization", name: "Revelao.cam", url: "https://www.revelao.cam" },
      publisher: {
        "@type": "Organization",
        name: "Revelao.cam",
        url: "https://www.revelao.cam",
        logo: "https://www.revelao.cam/favicon.ico",
      },
      datePublished: publishedDate,
      dateModified: post.updatedAt || publishedDate,
    });
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 container px-4 mx-auto">
          <p className="text-muted-foreground">Cargando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 container px-4 mx-auto">
          <p className="text-muted-foreground">No encontramos ese artículo.</p>
          <div className="mt-6">
            <Link to="/blog" className="text-primary hover:underline">
              Volver al blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between h-16">
            <Link to="/#inicio" className="flex items-center gap-3">
              <img src={icon} alt="Revelao" className="h-8 w-auto" />
              <span className="text-xl font-bold text-foreground">Revelao.cam</span>
            </Link>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
              asChild
            >
              <a href="https://acceso.revelao.cam/nuevoeventodemo" target="_blank" rel="noopener noreferrer">
                Prueba gratis
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-20 container px-4 mx-auto">
        <div className="max-w-3xl mx-auto">
          <Button asChild variant="secondary" size="sm">
            <a href="https://www.revelao.cam">Volver atrás</a>
          </Button>
          <h1 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {post.title}
          </h1>
          {post.image && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card max-w-2xl mx-auto">
              <img
                src={post.image}
                alt={post.title}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-full h-auto max-h-[360px] md:max-h-[420px] object-cover"
              />
            </div>
          )}
          <div
            className="mt-8 blog-content text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>
        <div className="h-16" />
      </main>
      <section className="py-10 md:py-14 bg-transparent no-card-hover">
        <div className="container px-4 mx-auto">
          <div className="revelao-card bg-neutral-100 p-6 md:p-8 text-center">
            <Button
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-lg"
              asChild
            >
              <a href="https://acceso.revelao.cam/nuevoeventodemo" target="_blank" rel="noopener noreferrer">
                Pruébalo gratis
              </a>
            </Button>
          </div>
        </div>
      </section>
      <WhatsAppFloating />
      <Footer />
    </div>
  );
};

export default BlogDetail;
