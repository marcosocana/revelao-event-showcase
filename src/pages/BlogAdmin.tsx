import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { deleteBlogPost, getBlogPosts, saveBlogPost, updateBlogPost } from "@/lib/blogStore";
import { type BlogPost } from "@/data/blogPosts";
import { BlogEditor } from "@/components/BlogEditor";
import { useI18n } from "@/lib/i18n";

const ADMIN_PASSWORD = "5362MArc_";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const isHtmlEmpty = (html: string) => {
  if (!html) return true;
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length === 0;
};

const BlogAdmin = () => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [image, setImage] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [editorMode, setEditorMode] = useState<"visual" | "html">("visual");
  const { lang } = useI18n();
  const [posts, setPosts] = useState(() => getBlogPosts(lang));
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const slug = useMemo(() => toSlug(title), [title]);

  useEffect(() => {
    const password = window.prompt("Contraseña de administrador");
    if (password === ADMIN_PASSWORD) {
      setAuthorized(true);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    setPosts(getBlogPosts(lang));
  }, [lang]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await toDataUrl(file);
    setImage(dataUrl);
  };

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContentHtml("");
    setImage("");
    setEditingSlug(null);
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard?.read) {
        window.alert("Tu navegador no permite leer HTML del portapapeles. Pega el contenido en el cuadro.");
        return;
      }
      const items = await navigator.clipboard.read();
      for (const item of items) {
        if (item.types.includes("text/html")) {
          const blob = await item.getType("text/html");
          const html = await blob.text();
          setContentHtml(html);
          return;
        }
      }
      const text = await navigator.clipboard.readText();
      setContentHtml(`<p>${text}</p>`);
    } catch (error) {
      window.alert("No se pudo leer el portapapeles. Pega el contenido manualmente.");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const missing: string[] = [];
    if (!title.trim()) missing.push("Título");
    if (!excerpt.trim()) missing.push("Descripción");
    if (isHtmlEmpty(contentHtml)) missing.push("Contenido");
    if (!image) missing.push("Imagen");
    if (missing.length > 0) {
      window.alert(`Faltan campos: ${missing.join(", ")}`);
      return;
    }
    setSaving(true);

    const post: BlogPost = {
      slug: editingSlug || slug || `post-${Date.now()}`,
      title,
      excerpt,
      date: "",
      contentHtml,
      image,
      tags: [],
    };

    if (editingSlug) {
      updateBlogPost(lang, post);
    } else {
      saveBlogPost(lang, post);
    }
    setPosts(getBlogPosts(lang));
    setSaving(false);
    navigate(`/blog/${post.slug}`);
  };

  if (!authorized) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 container px-4 mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Gestionar contenidos</h1>
          <p className="mt-2 text-muted-foreground">
            Crea, edita o elimina posts del blog.
          </p>

          <div className="mt-10 space-y-4">
            {posts.map((post) => (
              <div key={post.slug} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-border rounded-lg p-4 bg-card">
                <div>
                  <div className="font-semibold text-foreground">{post.title}</div>
                  <div className="text-sm text-muted-foreground">{post.excerpt}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingSlug(post.slug);
                      setTitle(post.title);
                      setExcerpt(post.excerpt);
                      setContentHtml(post.contentHtml || "");
                      setImage(post.image);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      deleteBlogPost(lang, post.slug);
                      setPosts(getBlogPosts(lang));
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {editingSlug ? "Editar post" : "Nuevo post"}
              </h2>
              {editingSlug && (
                <Button variant="ghost" size="sm" type="button" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Título</label>
              <input
                type="text"
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
              <div className="mt-2 text-xs text-muted-foreground">Slug: {slug || "auto"}</div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Descripción</label>
              <textarea
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                rows={3}
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Contenido</label>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={editorMode === "visual" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setEditorMode("visual")}
                >
                  Editor visual
                </Button>
                <Button
                  type="button"
                  variant={editorMode === "html" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setEditorMode("html")}
                >
                  Pegado exacto (HTML)
                </Button>
              </div>
              {editorMode === "visual" ? (
                <div className="mt-4">
                  <BlogEditor value={contentHtml} onChange={setContentHtml} />
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={handlePasteFromClipboard}>
                      Pegar desde portapapeles
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Para fidelidad total, pega HTML (o usa el botón).
                    </span>
                  </div>
                  <textarea
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground min-h-[220px]"
                    value={contentHtml}
                    onChange={(event) => setContentHtml(event.target.value)}
                    placeholder="Pega aquí tu HTML..."
                  />
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="text-xs text-muted-foreground mb-2">Vista previa</div>
                    <div
                      className="blog-content text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Imagen</label>
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-sm text-muted-foreground"
                onChange={handleImageChange}
              />
              {image && (
                <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
                  <img src={image} alt="Vista previa" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Publicar"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogAdmin;
