import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronRight,
  Film,
  Lightbulb,
  QrCode,
  Trophy,
  Users,
} from "lucide-react";
import captainsSeoPages from "@/data/captainsSeoPages.json";
import WhatsAppFloating from "@/components/WhatsAppFloating";

type ContentItem = { title: string; text: string };
type ContentSection = { title: string; paragraphs: string[]; items?: ContentItem[] };
type CaptainsSeoPage = {
  path: string;
  title: string;
  description: string;
  keywords: string;
  eyebrow: string;
  h1: string;
  intro: string;
  highlights: string[];
  sections: ContentSection[];
  faqs: Array<{ question: string; answer: string }>;
  related: string[];
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
  template?: { eyebrow: string; title: string; text: string };
};

const pages = captainsSeoPages as CaptainsSeoPage[];
const siteUrl = "https://www.revelao.cam";
const contactUrl =
  "https://wa.me/34695834018?text=Hola%21%20Quiero%20saber%20m%C3%A1s%20sobre%20Capitanes%20para%20bodas.";
const sectionIcons = [Users, Camera, Film, Trophy, QrCode, Lightbulb];

const setMetaName = (name: string, content: string) => {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
};

const setMetaProperty = (property: string, content: string) => {
  let tag = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.content = content;
};

const CaptainsSeoHead = ({ page }: { page: CaptainsSeoPage }) => {
  useEffect(() => {
    const canonicalUrl = `${siteUrl}${page.path}`;
    const image = `${siteUrl}/capitanes-hero.png`;
    document.title = page.title;
    setMetaName("description", page.description);
    setMetaName("keywords", page.keywords);
    setMetaName("robots", "index, follow");
    setMetaName("twitter:card", "summary_large_image");
    setMetaName("twitter:title", page.title);
    setMetaName("twitter:description", page.description);
    setMetaName("twitter:image", image);
    setMetaProperty("og:title", page.title);
    setMetaProperty("og:description", page.description);
    setMetaProperty("og:url", canonicalUrl);
    setMetaProperty("og:type", "website");
    setMetaProperty("og:image", image);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    document.getElementById("captains-cluster-schema")?.remove();
    const schema = document.createElement("script");
    schema.id = "captains-cluster-schema";
    schema.type = "application/ld+json";
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          name: page.h1,
          url: canonicalUrl,
          description: page.description,
          isPartOf: { "@type": "WebSite", name: "Revelao.cam", url: siteUrl },
          about: { "@type": "Product", name: "Capitanes by Revelao", url: `${siteUrl}/capitanes` },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: `${siteUrl}/` },
            { "@type": "ListItem", position: 2, name: "Capitanes", item: `${siteUrl}/capitanes` },
            { "@type": "ListItem", position: 3, name: page.h1, item: canonicalUrl },
          ],
        },
        {
          "@type": "FAQPage",
          mainEntity: page.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        },
      ],
    });
    document.head.appendChild(schema);

    return () => schema.remove();
  }, [page]);

  return null;
};

const CaptainsClusterHeader = () => (
  <header className="fixed inset-x-0 top-0 z-50 border-b-4 border-[#151515] bg-white px-4 py-3 sm:px-6 lg:px-10">
    <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3" aria-label="Navegación de Capitanes">
      <a href="/capitanes" className="captains-logo-link" aria-label="Ir a Capitanes">
        <picture>
          <source media="(max-width: 639px)" srcSet="/capitanes-logo-mini.svg" />
          <img src="/capitanes-logo.svg" alt="Capitanes por Revelao.cam" className="h-12 w-auto sm:h-14" />
        </picture>
      </a>
      <a className="captains-top-link captains-top-link-primary" href="/capitanes#precios">
        Crear mi juego
      </a>
    </nav>
  </header>
);

const Breadcrumbs = ({ page }: { page: CaptainsSeoPage }) => (
  <nav aria-label="Migas de pan" className="mb-6 flex flex-wrap items-center gap-2 text-sm font-black uppercase tracking-[0.06em] text-[#151515]/65">
    <a className="underline underline-offset-4 hover:text-[#151515]" href="/">Inicio</a>
    <ChevronRight className="h-4 w-4" aria-hidden="true" />
    <a className="underline underline-offset-4 hover:text-[#151515]" href="/capitanes">Capitanes</a>
    <ChevronRight className="h-4 w-4" aria-hidden="true" />
    <span aria-current="page">{page.eyebrow}</span>
  </nav>
);

const EditableTemplate = ({ template }: { template: NonNullable<CaptainsSeoPage["template"]> }) => {
  const [text, setText] = useState(template.text);

  return (
    <section className="bg-[#f7f3ec] px-4 py-14 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="template-preview-title">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
        <div>
          <p className="captains-section-label">Ejemplo editable</p>
          <h2 id="template-preview-title" className="captains-heading mt-4">Prueba el texto antes de diseñar</h2>
          <p className="mt-5 max-w-xl text-lg font-bold leading-7 text-[#151515]/70">
            Edita el mensaje directamente para comprobar cuánto ocupa. El QR es una muestra visual; el definitivo debe enlazar al acceso de la mesa.
          </p>
        </div>
        <div className="mx-auto w-full max-w-xl border-4 border-[#151515] bg-[#f4d36f] p-5 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.1em]">{template.eyebrow}</p>
          <h3 className="mt-3 text-3xl font-black sm:text-4xl">{template.title}</h3>
          <textarea
            aria-label="Texto editable de la tarjeta del capitán"
            className="mt-5 min-h-40 w-full resize-y border-4 border-[#151515] bg-white p-4 text-base font-bold leading-6 outline-none focus:ring-4 focus:ring-[#ff6565]/35"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <div className="mt-5 flex items-center justify-between gap-4 border-4 border-[#151515] bg-white p-4">
            <div>
              <strong className="block text-lg font-black">Escanea para empezar</strong>
              <span className="text-sm font-bold text-[#151515]/65">Acceso único del capitán</span>
            </div>
            <QrCode className="h-20 w-20 shrink-0" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};

const RelatedPages = ({ page }: { page: CaptainsSeoPage }) => {
  const relatedPages = page.related
    .map((path) => pages.find((candidate) => candidate.path === path))
    .filter((candidate): candidate is CaptainsSeoPage => Boolean(candidate));

  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="related-pages-title">
      <div className="mx-auto max-w-7xl">
        <p className="captains-section-label">Sigue preparando la dinámica</p>
        <h2 id="related-pages-title" className="captains-heading mt-4">Ideas y recursos relacionados</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {relatedPages.map((related, index) => {
            const Icon = sectionIcons[index % sectionIcons.length];
            return (
              <article key={related.path} className="captains-panel flex h-full flex-col bg-[#f7f3ec] p-5 sm:p-6">
                <Icon className="h-9 w-9" aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-black leading-7">{related.h1}</h3>
                <p className="mt-3 flex-1 font-bold leading-6 text-[#151515]/68">{related.intro}</p>
                <a className="mt-6 inline-flex items-center gap-2 font-black underline decoration-2 underline-offset-4" href={related.path}>
                  Ver la guía <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CaptainsClusterFooter = () => (
  <footer className="border-t-4 border-[#151515] bg-white px-4 py-8 text-[#151515] sm:px-6 lg:px-10">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
      <p className="text-lg font-black">Capitanes es un producto de Revelao.cam hecho con amor.</p>
      <div className="flex flex-wrap justify-center gap-4 text-sm font-black uppercase">
        <a className="underline underline-offset-4" href="/capitanes">Capitanes</a>
        <a className="underline underline-offset-4" href="/privacy">Privacidad</a>
        <a className="underline underline-offset-4" href="/terms">Condiciones</a>
      </div>
    </div>
  </footer>
);

const CaptainsSeoLanding = () => {
  const location = useLocation();
  const page = useMemo(
    () => pages.find((candidate) => candidate.path === location.pathname.replace(/\/$/, "")),
    [location.pathname],
  );

  if (!page) return null;

  return (
    <main className="captains-page min-h-screen overflow-hidden bg-white text-[#151515]">
      <CaptainsSeoHead page={page} />
      <CaptainsClusterHeader />

      <section className="bg-white px-4 pb-14 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs page={page} />
          <div className="grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-center">
            <div>
              <p className="captains-kicker">{page.eyebrow}</p>
              <h1 className="captains-title mt-5 text-[clamp(2.7rem,7vw,5.8rem)] leading-[0.94]">{page.h1}</h1>
              <p className="mt-6 max-w-3xl text-xl font-bold leading-8 text-[#151515]/72">{page.intro}</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {page.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-start gap-2 border-4 border-[#151515] bg-[#f7f3ec] p-3 font-black leading-5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#ff6565]" aria-hidden="true" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a className="captains-button captains-button-primary" href="/capitanes#precios">
                  {page.ctaLabel} <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </a>
                <a className="captains-button captains-button-secondary" href="/capitanes">Ver el juego</a>
              </div>
            </div>
            <div className="border-4 border-[#151515] bg-[#f4d36f] p-3 sm:p-5" aria-hidden="true">
              <img src="/capitanes-hero.png" alt="" className="w-full bg-white object-contain" loading="eager" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {page.sections.map((section, sectionIndex) => {
        const Icon = sectionIcons[sectionIndex % sectionIcons.length];
        const isDark = sectionIndex % 4 === 3;
        return (
          <section
            key={section.title}
            className={isDark ? "bg-[#151515] px-4 py-14 text-white sm:px-6 lg:px-10 lg:py-20" : sectionIndex % 2 === 0 ? "bg-[#f7f3ec] px-4 py-14 sm:px-6 lg:px-10 lg:py-20" : "bg-white px-4 py-14 sm:px-6 lg:px-10 lg:py-20"}
          >
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
              <div className="lg:sticky lg:top-28">
                <div className={isDark ? "inline-flex border-4 border-white bg-[#ff6565] p-3 text-[#151515]" : "inline-flex border-4 border-[#151515] bg-[#f4d36f] p-3"}>
                  <Icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <h2 className="captains-heading mt-5">{section.title}</h2>
              </div>
              <div>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className={isDark ? "text-lg font-bold leading-8 text-white/78" : "text-lg font-bold leading-8 text-[#151515]/72"}>{paragraph}</p>
                  ))}
                </div>
                {section.items?.length ? (
                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    {section.items.map((item) => (
                      <article key={item.title} className={isDark ? "border-4 border-white bg-white p-5 text-[#151515]" : "border-4 border-[#151515] bg-white p-5"}>
                        <h3 className="text-xl font-black">{item.title}</h3>
                        <p className="mt-2 font-bold leading-6 text-[#151515]/68">{item.text}</p>
                      </article>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        );
      })}

      {page.template ? <EditableTemplate template={page.template} /> : null}

      <section className="bg-[#f7f3ec] px-4 py-14 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="captains-faq-title">
        <div className="mx-auto max-w-4xl">
          <p className="captains-section-label">Dudas habituales</p>
          <h2 id="captains-faq-title" className="captains-heading mt-4">Preguntas frecuentes</h2>
          <div className="mt-8 space-y-4">
            {page.faqs.map((faq) => (
              <details key={faq.question} className="group border-4 border-[#151515] bg-white p-5">
                <summary className="cursor-pointer list-none pr-8 text-xl font-black marker:hidden">{faq.question}</summary>
                <p className="mt-4 border-t-2 border-[#151515]/15 pt-4 font-bold leading-7 text-[#151515]/70">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <RelatedPages page={page} />

      <section className="bg-[#151515] px-4 py-14 text-white sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="captains-section-label captains-section-label-dark">Capitanes by Revelao</p>
            <h2 className="captains-heading mt-4">{page.ctaTitle}</h2>
            <p className="mt-5 max-w-2xl text-lg font-bold leading-7 text-white/72">{page.ctaText}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a className="captains-button captains-button-light" href="/capitanes#precios">{page.ctaLabel}</a>
            <a className="captains-button captains-button-dark-outline" href={contactUrl} target="_blank" rel="noopener noreferrer">Hablar por WhatsApp</a>
          </div>
        </div>
      </section>

      <CaptainsClusterFooter />
      <WhatsAppFloating message="Hola! Quiero saber más sobre Capitanes para mi boda." />
    </main>
  );
};

export default CaptainsSeoLanding;
