import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Footer } from "@/components/Footer";
import { useI18n, getAccessDemoUrl, translations } from "@/lib/i18n";
import corazon from "@/assets/corazon.svg";
import logo from "@/assets/ico.png";
import phoneMockup from "@/assets/phone-mockup.png";
import ruedaVideo from "@/assets/RevelaoComprimido.mp4";
import stepQr from "@/assets/11.png";
import stepCapture from "@/assets/22.png";
import stepAnticipation from "@/assets/33.png";
import stepReveal from "@/assets/44.png";
import bodaQrImage from "@/assets/boda-qr.png";
import testimonial1 from "@/assets/testimonio4-1.png";
import testimonial2 from "@/assets/testimonio2-2.png";
import testimonial3 from "@/assets/testimonio3-2.png";
import testimonial4 from "@/assets/testimonio-6.png";
import template1 from "@/assets/Plantilla1.png";
import template2 from "@/assets/Plantilla2.png";
import template3 from "@/assets/Plantilla3.png";
import template4 from "@/assets/template-4.png";
import WhatsAppFloating from "@/components/WhatsAppFloating";

const getLangFromPath = (pathname: string) => {
  if (pathname.startsWith("/en/") || pathname === "/en") return "en";
  if (pathname.startsWith("/it/") || pathname === "/it") return "it";
  return "es";
};


const QrEventLanding = () => {
  const location = useLocation();
  const { lang, setLang } = useI18n();
  const pathLang = getLangFromPath(location.pathname);
  const [showSticky, setShowSticky] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (lang !== pathLang) {
      setLang(pathLang);
    }
  }, [lang, pathLang, setLang]);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 240);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const t = useMemo(() => {
    const landing = translations[pathLang];
    const heroTitle = [landing.hero.title, landing.hero.titleHighlight].filter(Boolean).join(" ");
    const keywordLine = landing.seoHomeMeta.keywords.replace(/,/g, " · ");
    return {
      h1: heroTitle,
      subtitle: landing.hero.subtitle,
      intro: landing.seoHome.intro,
      ctaPrimary: landing.hero.ctaFree,
      stepLabel: pathLang === "en" ? "Step" : pathLang === "it" ? "Passo" : "Paso",
      stepsTitle: landing.features.title,
      stepsSubtitle: landing.features.subtitle,
      stepsVisual: landing.features.steps.map((step) => ({
        title: step.title,
        text: step.description,
      })),
      benefitsTitle: landing.seoHome.title,
      benefits: landing.pricing.features,
      showcaseTitle: landing.features.title,
      showcaseText: landing.features.subtitle,
      storyTitle: landing.templates.title,
      storyText: landing.templates.subtitle,
      templatesTitle: landing.templates.title,
      templatesText: landing.templates.subtitle,
      seoTitle: landing.seoHome.title,
      seoText: landing.seoHome.intro,
      seoMeta: landing.seoHomeMeta,
      footerText: landing.seoHome.intro,
      footerKeywordsTitle:
        pathLang === "en"
          ? "Popular searches"
          : pathLang === "it"
            ? "Ricerche frequenti"
            : "Búsquedas frecuentes",
      footerKeywords: landing.seoHomeMeta.keywords.split(",").map((keyword) => keyword.trim()),
      seoSections: landing.seoHome.sections,
      ctaStripTitle: landing.trialReminder.title,
      ctaStripText: landing.trialReminder.subtitle,
      ctaTrialTitle: landing.freeTrial.title,
      ctaTrialText: landing.freeTrial.subtitle,
      faqTitle: landing.faqs.title,
      faqs: landing.faqs.items,
      taglineTags: [landing.hero.bulletAnon, landing.hero.bulletNoApps].filter(Boolean),
      keywordLine,
    };
  }, [pathLang]);
  const accessDemoUrl = getAccessDemoUrl(pathLang);
  const stepsItems = [
    { img: stepQr, label: t.stepsVisual[0] },
    { img: stepCapture, label: t.stepsVisual[1] },
    { img: stepAnticipation, label: t.stepsVisual[2] },
    { img: stepReveal, label: t.stepsVisual[3] },
  ];
  const allTags = [
    ...t.taglineTags,
    ...t.keywordLine.split("·").map((tag) => tag.trim()),
  ];
  const testimonialImages = [testimonial4, testimonial2, testimonial1, testimonial3, testimonial4, testimonial2];
  const testimonialItems = [
    ...translations[pathLang].stories.items,
    ...translations[pathLang].stories.itemsMobileExtra,
  ].filter(Boolean).map((item, index) => ({
    name: item.author,
    event: item.event,
    quote: item.quote,
    image: testimonialImages[index % testimonialImages.length],
  }));

  useEffect(() => {
    const title = t.seoMeta.title;
    const description = t.seoMeta.description;
    const keywords = t.seoMeta.keywords;
    const canonicalUrl = `https://revelao.cam${location.pathname}`;

    document.title = title;
    const setMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("keywords", keywords);
    const setProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };
    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:image", "https://www.revelao.cam/og-qr-event.png");
    setProperty("og:type", "website");
    setProperty("og:url", canonicalUrl);

    let canonical = document.querySelector(`link[rel="canonical"]`);
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Evento con Código QR",
      description,
      provider: {
        "@type": "Organization",
        name: "Revelao.cam",
        url: "https://revelao.cam/",
      },
      areaServed: "ES",
      url: canonicalUrl,
    };
    let ld = document.getElementById("ld-service");
    if (!ld) {
      ld = document.createElement("script");
      ld.setAttribute("type", "application/ld+json");
      ld.setAttribute("id", "ld-service");
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify(serviceSchema);
  }, [t, location.pathname]);

  return (
    <div className="min-h-screen bg-background no-card-hover">
      <div
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          showSticky ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-white backdrop-blur-sm border-b border-border">
          <div className="container px-4 mx-auto py-3 flex items-center justify-between">
            <img src={logo} alt="Revelao" className="h-7 w-auto" />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <a href={accessDemoUrl} target="_blank" rel="noopener noreferrer">
                {t.ctaPrimary}
              </a>
            </Button>
          </div>
        </div>
      </div>
      <main className="pt-0">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            >
              <source src={ruedaVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-white backdrop-blur-sm" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(240,106,95,0.2),_transparent_60%)]" />
          </div>
          <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="container px-4 mx-auto pt-8 pb-12 md:py-20 relative z-10">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <img src={logo} alt="Revelao" className="h-6 w-auto" />
                  <span className="text-lg font-bold text-foreground">Revelao.cam</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground text-center lg:text-left">
                  {t.h1}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground text-center lg:text-left">
                  {t.subtitle}
                </p>
                <div className="hidden md:flex flex-wrap gap-2 justify-center lg:justify-start">
                  {allTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                    <a href={accessDemoUrl} target="_blank" rel="noopener noreferrer">
                      {t.ctaPrimary}
                    </a>
                  </Button>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
                  {t.intro}
                </p>
              </div>
              <div className="relative flex justify-center">
                <div className="absolute -inset-4 rounded-[32px] bg-primary/10 blur-2xl" />
                <img
                  src={phoneMockup}
                  alt="Revelao QR event"
                  className="relative z-10 w-[280px] md:w-[320px] lg:w-[360px] drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container px-4 mx-auto py-12 md:py-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="revelao-card p-6">
              <h2 className="text-2xl font-semibold mb-4">{t.benefitsTitle}</h2>
              <ul className="space-y-3 text-muted-foreground">
                {t.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3">
                    <span className="text-primary">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="revelao-card p-6">
              <h3 className="text-xl font-semibold mb-2">{t.showcaseTitle}</h3>
              <p className="text-muted-foreground">{t.showcaseText}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {t.keywordLine.split("·").map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container px-4 mx-auto py-12 md:py-16">
          <div className="max-w-5xl mx-auto revelao-card p-6 md:p-8 grid md:grid-cols-[1.1fr,0.9fr] gap-6 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-3">{t.storyTitle}</h2>
              <p className="text-muted-foreground">{t.storyText}</p>
            </div>
            <button
              type="button"
              className="overflow-hidden rounded-2xl border border-border bg-white"
              onClick={() => setSelectedImage(bodaQrImage)}
              aria-label={t.storyTitle}
            >
              <img
                src={bodaQrImage}
                alt={t.storyTitle}
                className="w-full h-64 md:h-72 object-cover object-center"
              />
            </button>
          </div>
        </section>

        <section className="container px-4 mx-auto py-12 md:py-16">
          <div className="max-w-5xl mx-auto text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-semibold">{t.stepsTitle}</h2>
            <p className="text-muted-foreground mt-1">{t.stepsSubtitle}</p>
          </div>
          <div className="hidden md:grid max-w-5xl mx-auto grid-cols-1 md:grid-cols-2 gap-6">
            {stepsItems.map((item, idx) => (
              <div key={item.label.title} className="revelao-card">
                <div className="relative bg-neutral-100 flex items-center justify-center p-4 w-full">
                  <img
                    src={item.img}
                    alt={item.label.title}
                    className="w-[510px] h-[510px] object-contain"
                  />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold">
                      {idx + 1}
                    </span>
                    {t.stepLabel}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2">
                    {idx + 1}. {item.label.title}
                  </h3>
                  <p className="text-muted-foreground">{item.label.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="md:hidden">
            <Carousel
              className="w-full"
              opts={{
                align: "start",
                loop: false,
              }}
            >
              <CarouselContent className="ml-0 gap-3">
                {stepsItems.map((item, idx) => (
                  <CarouselItem key={item.label.title} className="basis-[82%] pl-0">
                    <div className="revelao-card h-full">
                      <div className="relative bg-neutral-100 flex items-center justify-center p-4 w-full">
                        <img
                          src={item.img}
                          alt={item.label.title}
                          className="w-[510px] h-[510px] object-contain"
                        />
                        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-foreground">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold">
                            {idx + 1}
                          </span>
                          {t.stepLabel}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-lg mb-2">
                          {idx + 1}. {item.label.title}
                        </h3>
                        <p className="text-muted-foreground">{item.label.text}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        <section className="container px-4 mx-auto py-12 md:py-16">
          <div className="max-w-5xl mx-auto revelao-card p-6 md:p-10">
            <div className="grid md:grid-cols-[1.1fr,0.9fr] gap-6 items-center">
              <div>
                <h2 className="text-2xl font-semibold mb-3">{t.templatesTitle}</h2>
                <p className="text-muted-foreground">{t.templatesText}</p>
                <div className="mt-5">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                    <a href={accessDemoUrl} target="_blank" rel="noopener noreferrer">
                      {t.ctaPrimary}
                    </a>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[template1, template2, template3, template4].map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    className="overflow-hidden rounded-xl border border-border bg-white"
                    onClick={() => setSelectedImage(img)}
                    aria-label={`QR template ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`QR template ${idx + 1}`}
                      className="w-full h-28 object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container px-4 mx-auto py-12 md:py-16">
          <div className="max-w-5xl mx-auto space-y-6">
            <div
              className={`space-y-8 ${
                isExpanded ? "" : "max-md:max-h-[520px] max-md:overflow-hidden max-md:relative"
              }`}
            >
              {t.seoSections.map((section) => (
                <div
                  key={section.title}
                  className="revelao-card border-0 bg-white p-6 md:p-8"
                >
                  <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                  <div className="space-y-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              {!isExpanded && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent md:hidden" />
              )}
            </div>
            <div className="md:hidden flex justify-center">
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-wide text-muted-foreground"
              >
                {isExpanded ? "Ver menos" : "Leer más"}
              </button>
            </div>
          </div>
        </section>

        <section className="container px-4 mx-auto py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="revelao-card border-0 bg-white p-6 md:p-10 mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t.seoTitle}</h2>
              <p className="text-muted-foreground">{t.seoText}</p>
            </div>
            <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {testimonialItems.map((item) => (
                <div
                  key={item.name}
                  className="revelao-card p-5 flex flex-col items-center text-center h-[240px] justify-center"
                >
                  <img
                    src={item.image}
                    alt={item.event}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div className="mt-3 font-semibold">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.event}</div>
                  <div className="text-sm text-amber-500">★★★★★</div>
                  <p className="text-sm text-muted-foreground mt-2">“{item.quote}”</p>
                </div>
              ))}
            </div>
            <div className="md:hidden">
              <Carousel
                className="w-full"
                opts={{
                  align: "start",
                  loop: false,
                }}
              >
                <CarouselContent className="ml-0 gap-3">
                  {testimonialItems.map((item) => (
                    <CarouselItem key={item.name} className="basis-[82%] pl-0">
                      <div className="revelao-card p-5 flex flex-col items-center text-center h-[240px] justify-center">
                        <img
                          src={item.image}
                          alt={item.event}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                        <div className="mt-3 font-semibold">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.event}</div>
                        <div className="text-sm text-amber-500">★★★★★</div>
                        <p className="text-sm text-muted-foreground mt-2">“{item.quote}”</p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>

        <section className="container px-4 mx-auto py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">{t.faqTitle}</h2>
            <div className="grid gap-4">
              {t.faqs.map((faq) => (
                <div key={faq.q} className="revelao-card p-5">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-primary/5">
          <div className="container px-4 mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold">
              {t.ctaStripTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.ctaStripText}
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <a href={accessDemoUrl} target="_blank" rel="noopener noreferrer">
                {t.ctaPrimary}
              </a>
            </Button>
            <div className="flex flex-wrap gap-2 justify-center md:hidden">
              {allTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="hidden md:flex flex-wrap gap-2 justify-center">
              {t.taglineTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container px-4 mx-auto">
            <div className="revelao-card p-6 md:p-10 text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold">
                {t.ctaTrialTitle}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t.ctaTrialText}
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <a href={accessDemoUrl} target="_blank" rel="noopener noreferrer">
                  {t.ctaPrimary}
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container px-4 mx-auto flex justify-center">
            <div className="w-full max-w-5xl">
              <img src={bodaQrImage} alt="Evento QR" className="w-full h-auto rounded-xl object-cover" />
            </div>
          </div>
        </section>
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-hidden p-4">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Revelao preview"
                className="w-full h-full max-h-[80vh] object-contain"
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer
        text={t.footerText}
        keywordsTitle={t.footerKeywordsTitle}
        keywords={t.footerKeywords}
      />
      <WhatsAppFloating />
    </div>
  );
};

export default QrEventLanding;
