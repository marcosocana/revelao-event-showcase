import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Mic, QrCode, Sparkles, Upload, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { Button } from "@/components/ui/button";
import { getBlogPosts } from "@/lib/blogStore";
import { useI18n } from "@/lib/i18n";
import type { BlogPost } from "@/data/blogPosts";

const categories = [
  {
    title: "QR en bodas",
    description: "Ideas para usar códigos QR en carteles, mesas, invitaciones y photocall.",
    href: "/bodas/codigo-qr-boda",
    icon: QrCode,
  },
  {
    title: "Fotos de invitados",
    description: "Cómo recopilar fotos y vídeos espontáneos sin perseguir a nadie.",
    href: "/bodas/qr-fotos-boda",
    icon: Camera,
  },
  {
    title: "Sin apps ni grupos",
    description: "Alternativas a WhatsApp para centralizar recuerdos en una galería privada.",
    href: "/bodas/whatsapp-fotos-boda",
    icon: Upload,
  },
  {
    title: "Mensajes de audio",
    description: "Formas de guardar felicitaciones, voces y anécdotas de la boda.",
    href: "/bodas/mensajes-audio-boda",
    icon: Mic,
  },
];

const internalLinks = [
  ["/bodas/cartel-qr-boda", "Cartel QR para boda"],
  ["/bodas/subir-fotos-boda-sin-app", "Subir fotos de boda sin app"],
  ["/bodas/galeria-privada-boda", "Galería privada para boda"],
  ["/bodas/checklist-fotos-invitados-boda", "Checklist para no perder fotos"],
  ["/bodas/revelado-fotos-boda", "El momento del revelado"],
  ["/bodas/wedding-planner-qr-boda", "QR para wedding planners"],
];

const truncateText = (text: string, maxChars: number) => {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, Math.max(0, maxChars - 3)).trimEnd()}...`;
};

const BlogHub = () => {
  const { lang } = useI18n();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const data = await getBlogPosts(lang);
      if (mounted) setPosts(data);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [lang]);

  useEffect(() => {
    const canonicalUrl = "https://revelao.cam/blog";
    const title = "Blog de bodas con QR, fotos de invitados y recuerdos | Revelao.cam";
    const description =
      "Guías prácticas sobre QR para bodas, fotos de invitados, galerías privadas, mensajes de audio y el momento del revelado.";
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    const setProperty = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("keywords", "blog bodas qr, fotos boda qr, qr boda, recopilar fotos invitados boda");
    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:url", canonicalUrl);
    setProperty("og:type", "website");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);

    let canonical = document.querySelector(`link[rel="canonical"]`);
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
  }, []);

  const latestPosts = useMemo(() => posts.slice(0, 9), [posts]);
  const featuredPost = latestPosts[0];
  const secondaryPosts = latestPosts.slice(1);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24">
        <section className="border-b bg-neutral-50">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-4xl">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-primary">
                Blog de Revelao
              </p>
              <h1 className="revelao-h1 mb-5 max-w-3xl">
                Ideas para recopilar fotos, vídeos y recuerdos de boda con QR
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                Guías prácticas para parejas, wedding planners y espacios de celebración que quieren
                recoger las fotos de los invitados, evitar que se pierdan en WhatsApp y preparar una
                galería privada con momento de revelado.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <a href="https://acceso.revelao.cam/nuevoeventodemo">Crear mi evento con QR</a>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/bodas/codigo-qr-boda">Ver guía de QR para bodas</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <h2 className="revelao-h2 mb-2">Categorías principales</h2>
                <p className="max-w-2xl text-muted-foreground">
                  Contenido organizado por intención de búsqueda: QR en bodas, fotos de invitados,
                  mensajes de audio, cartelería y alternativas a los grupos de WhatsApp.
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.href}
                    to={category.href}
                    className="group rounded-[8px] border bg-white p-5 transition-colors hover:border-primary"
                  >
                    <Icon className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
                    <h3 className="revelao-h4 mb-2">{category.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{category.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-neutral-50 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <h2 className="revelao-h2 mb-2">Últimos artículos</h2>
                <p className="max-w-2xl text-muted-foreground">
                  Ideas accionables para conseguir más participación de los invitados y guardar
                  recuerdos reales de la boda.
                </p>
              </div>
            </div>

            {featuredPost && (
              <Link
                to={`/blog/${featuredPost.slug}`}
                className="mb-6 grid overflow-hidden rounded-[8px] border bg-white transition-opacity hover:opacity-95 md:grid-cols-[1.1fr_0.9fr]"
              >
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  loading="eager"
                  decoding="async"
                  className="h-full min-h-[260px] w-full object-cover"
                />
                <div className="flex flex-col justify-center p-6 md:p-8">
                  <p className="mb-3 text-sm font-medium text-primary">Artículo destacado</p>
                  <h3 className="revelao-h3 mb-3">{featuredPost.title}</h3>
                  <p className="mb-6 leading-7 text-muted-foreground">
                    {truncateText(featuredPost.excerpt, 230)}
                  </p>
                  <span className="font-medium text-primary">Leer artículo</span>
                </div>
              </Link>
            )}

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {secondaryPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[8px] border bg-white transition-opacity hover:opacity-95"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="revelao-h4 mb-3">{post.title}</h3>
                    <p className="mb-5 text-sm leading-6 text-muted-foreground">
                      {truncateText(post.excerpt, 150)}
                    </p>
                    <span className="mt-auto text-sm font-medium text-primary">Leer más</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="revelao-h2 mb-4">Guías clave sobre bodas, QR y recuerdos</h2>
              <p className="mb-5 leading-7 text-muted-foreground">
                El objetivo del blog es resolver dudas concretas: dónde colocar un cartel QR, cómo
                conseguir que los invitados suban fotos, qué hacer con los vídeos de la fiesta o por
                qué una galería privada funciona mejor que pedir archivos días después.
              </p>
              <p className="leading-7 text-muted-foreground">
                Cada artículo enlaza con landings específicas para que puedas profundizar según lo
                que estás preparando: carteles, tarjetas, subida sin app, mensajes de audio,
                revelado o planificación con wedding planners.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {internalLinks.map(([href, label]) => (
                <Link
                  key={href}
                  to={href}
                  className="flex items-center gap-3 rounded-[8px] border bg-white p-4 transition-colors hover:border-primary"
                >
                  <Sparkles className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-neutral-950 py-12 text-white md:py-16">
          <div className="container mx-auto flex flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center">
            <div>
              <h2 className="revelao-h2 mb-3 text-white">Convierte los móviles de tus invitados en recuerdos</h2>
              <p className="max-w-2xl text-neutral-300">
                Crea un QR para tu boda y recopila fotos, vídeos y mensajes de audio en una galería
                privada lista para el revelado.
              </p>
            </div>
            <Button asChild variant="secondary">
              <a href="https://acceso.revelao.cam/nuevoeventodemo">
                <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                Probar Revelao
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloating />
    </div>
  );
};

export default BlogHub;
