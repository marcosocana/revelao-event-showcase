import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Footer } from "@/components/Footer";
import { useI18n, getAccessDemoUrl } from "@/lib/i18n";
import corazon from "@/assets/corazon.svg";
import logo from "@/assets/ico.png";
import phoneMockup from "@/assets/phone-mockup.png";
import ruedaVideo from "@/assets/rueda.mp4";
import stepQr from "@/assets/step-1-qr.svg";
import stepCapture from "@/assets/step-2-capture.svg";
import stepAnticipation from "@/assets/step-3-anticipation.svg";
import stepReveal from "@/assets/step-4-reveal.svg";
import bodaQrImage from "@/assets/boda-qr.png";
import testimonial1 from "@/assets/testimonial-1.svg";
import testimonial2 from "@/assets/testimonial-2.svg";
import testimonial3 from "@/assets/testimonial-3.svg";
import testimonial4 from "@/assets/testimonial-4.svg";
import testimonial5 from "@/assets/testimonial-5.svg";
import testimonial6 from "@/assets/testimonial-6.svg";
import template1 from "@/assets/template-1.png";
import template2 from "@/assets/template-2.png";
import template3 from "@/assets/template-3.png";

const getLangFromPath = (pathname: string) => {
  if (pathname.startsWith("/en/") || pathname === "/en") return "en";
  if (pathname.startsWith("/it/") || pathname === "/it") return "it";
  return "es";
};

const copy = {
  es: {
    title: "Crear evento con QR para bodas y celebraciones",
    subtitle:
      "La herramienta más fácil para crear un evento QR y recoger todas las fotos de tus invitados en un solo lugar.",
    intro:
      "Revelao.cam es la plataforma para crear un evento QR en minutos. Ideal para bodas, cumpleaños y eventos corporativos.",
    keywordLine:
      "Boda QR · Evento QR · Herramienta evento QR · Galería de fotos QR",
    taglineTags: ["Revelao.cam", "Evento QR gratuito"],
    ctaPrimary: "Crear evento gratuito",
    stepLabel: "Paso",
    stepsTitle: "Cómo funciona un evento con QR",
    steps: [
      "Crea tu evento QR en menos de 1 minuto.",
      "Comparte el código QR con tus invitados.",
      "Tus invitados suben fotos durante el evento.",
      "Al día siguiente se revelan todas juntas.",
    ],
    stepsVisual: [
      { title: "Genera tu QR", text: "Crea el evento y descarga el QR en segundos." },
      { title: "Captura durante el evento", text: "Invitados subiendo fotos desde el móvil." },
      { title: "Expectación", text: "Las fotos permanecen ocultas hasta el revelado." },
      { title: "Revelado", text: "Todas las fotos aparecen juntas al día siguiente." },
    ],
    benefitsTitle: "Por qué crear un evento QR con Revelao",
    benefits: [
      "Sin apps: solo QR y navegador.",
      "Fotos ilimitadas durante el evento.",
      "Galería privada con acceso controlado.",
      "Experiencia de revelado al día siguiente.",
    ],
    showcaseTitle: "Así se vive un evento QR con Revelao",
    showcaseText:
      "Un flujo sencillo, visual y pensado para bodas y eventos. El QR se comparte, las fotos se acumulan y el revelado genera un momento inolvidable.",
    storyTitle: "El QR estará presente en tu boda",
    storyText:
      "Coloca el QR en tus mesas y rincones favoritos para que todos participen con sus fotos.",
    templatesTitle: "Plantillas QR listas para imprimir",
    templatesText:
      "Diseños elegantes para bodas y eventos. Descarga, imprime y coloca junto al QR.",
    seoTitle: "Optimizado para bodas y eventos QR",
    seoText:
      "Si buscas una herramienta de evento QR para bodas, Revelao.cam te permite crear un evento con QR y reunir todas las fotos de forma simple y segura.",
    ctaStripTitle: "Crea tu evento gratuito en 1 minuto",
    ctaStripText:
      "Si buscas una herramienta de evento QR para bodas o eventos, aquí tienes la solución lista para usar.",
    faqTitle: "Preguntas frecuentes sobre eventos con QR",
    faqs: [
      {
        q: "¿Cómo creo un evento con QR?",
        a: "Solo tienes que crear un evento gratuito, personalizarlo y compartir el QR con tus invitados.",
      },
      {
        q: "¿Se necesita instalar alguna app?",
        a: "No, los invitados acceden con el QR desde su navegador.",
      },
      {
        q: "¿Para qué tipo de eventos sirve?",
        a: "Funciona para bodas, fiestas, cumpleaños, eventos corporativos y cualquier celebración.",
      },
    ],
  },
  en: {
    title: "Create a QR event for weddings and celebrations",
    subtitle:
      "The easiest way to create a QR event and collect all your guests’ photos in one place.",
    intro:
      "Revelao.cam is the platform to create a QR event in minutes. Perfect for weddings, birthdays, and corporate events.",
    keywordLine:
      "Wedding QR · QR event · QR event tool · QR photo gallery",
    taglineTags: ["Revelao.cam", "Free QR event"],
    ctaPrimary: "Create a free event",
    stepLabel: "Step",
    stepsTitle: "How a QR event works",
    steps: [
      "Create your QR event in under 1 minute.",
      "Share the QR code with your guests.",
      "Guests upload photos during the event.",
      "All photos are revealed together the next day.",
    ],
    stepsVisual: [
      { title: "Generate your QR", text: "Create the event and download the QR in seconds." },
      { title: "Capture the moment", text: "Guests upload photos from their phones." },
      { title: "Anticipation", text: "Photos stay hidden until reveal time." },
      { title: "Reveal", text: "All photos appear together the next day." },
    ],
    benefitsTitle: "Why create a QR event with Revelao",
    benefits: [
      "No apps: just QR and browser.",
      "Unlimited photos during the event.",
      "Private gallery with controlled access.",
      "Next-day reveal experience.",
    ],
    showcaseTitle: "This is how a QR event feels",
    showcaseText:
      "A simple, visual flow built for weddings and celebrations. Share the QR, collect photos, reveal them together.",
    storyTitle: "The QR will be present at your wedding",
    storyText:
      "Place the QR on tables and key spots so everyone can join with their photos.",
    templatesTitle: "QR templates ready to print",
    templatesText:
      "Elegant designs for weddings and events. Download, print, and place next to the QR.",
    seoTitle: "Built for weddings and QR events",
    seoText:
      "If you’re looking for a QR event tool for weddings, Revelao.cam lets you create a QR event and gather all photos simply and securely.",
    ctaStripTitle: "Create your free event in 1 minute",
    ctaStripText:
      "If you need a QR event tool for weddings or events, this is ready to launch.",
    faqTitle: "QR event FAQs",
    faqs: [
      {
        q: "How do I create a QR event?",
        a: "Create a free event, customize it, and share the QR with your guests.",
      },
      {
        q: "Do guests need an app?",
        a: "No, they access the event with the QR in their browser.",
      },
      {
        q: "What events is it for?",
        a: "Works for weddings, parties, birthdays, and corporate events.",
      },
    ],
  },
  it: {
    title: "Crea un evento QR per matrimoni e celebrazioni",
    subtitle:
      "Il modo più semplice per creare un evento QR e raccogliere tutte le foto degli invitati in un unico posto.",
    intro:
      "Revelao.cam è la piattaforma per creare un evento QR in pochi minuti. Perfetto per matrimoni, compleanni ed eventi aziendali.",
    keywordLine:
      "Matrimonio QR · Evento QR · Strumento evento QR · Galleria foto QR",
    taglineTags: ["Revelao.cam", "Evento QR gratuito"],
    ctaPrimary: "Crea evento gratuito",
    stepLabel: "Passo",
    stepsTitle: "Come funziona un evento QR",
    steps: [
      "Crea il tuo evento QR in meno di 1 minuto.",
      "Condividi il codice QR con gli invitati.",
      "Gli invitati caricano foto durante l’evento.",
      "Tutte le foto si rivelano il giorno dopo.",
    ],
    stepsVisual: [
      { title: "Genera il QR", text: "Crea l’evento e scarica il QR in pochi secondi." },
      { title: "Scatta durante l’evento", text: "Gli invitati caricano foto dal telefono." },
      { title: "Attesa", text: "Le foto restano nascoste fino alla rivelazione." },
      { title: "Rivelazione", text: "Tutte le foto appaiono insieme il giorno dopo." },
    ],
    benefitsTitle: "Perché creare un evento QR con Revelao",
    benefits: [
      "Nessuna app: solo QR e browser.",
      "Foto illimitate durante l’evento.",
      "Galleria privata con accesso controllato.",
      "Esperienza di rivelazione il giorno dopo.",
    ],
    showcaseTitle: "Così funziona un evento QR",
    showcaseText:
      "Un flusso semplice e visivo per matrimoni e celebrazioni. Condividi il QR, raccogli foto, rivela tutto insieme.",
    storyTitle: "Il QR sarà presente al tuo matrimonio",
    storyText:
      "Posiziona il QR sui tavoli e nei punti chiave per coinvolgere tutti con le foto.",
    templatesTitle: "Modelli QR pronti da stampare",
    templatesText:
      "Design eleganti per matrimoni ed eventi. Scarica, stampa e posiziona accanto al QR.",
    seoTitle: "Pensato per matrimoni ed eventi QR",
    seoText:
      "Se cerchi uno strumento per eventi QR per matrimoni, Revelao.cam ti permette di creare un evento QR e raccogliere tutte le foto in modo semplice e sicuro.",
    ctaStripTitle: "Crea il tuo evento gratuito in 1 minuto",
    ctaStripText:
      "Se cerchi uno strumento QR per matrimoni o eventi, è pronto per partire.",
    faqTitle: "FAQ sugli eventi QR",
    faqs: [
      {
        q: "Come creo un evento QR?",
        a: "Crea un evento gratuito, personalizzalo e condividi il QR con gli invitati.",
      },
      {
        q: "Serve un’app?",
        a: "No, gli invitati accedono tramite QR dal browser.",
      },
      {
        q: "Per quali eventi è adatto?",
        a: "Funziona per matrimoni, feste, compleanni ed eventi aziendali.",
      },
    ],
  },
};

const QrEventLanding = () => {
  const location = useLocation();
  const { lang, setLang } = useI18n();
  const pathLang = getLangFromPath(location.pathname);
  const [showSticky, setShowSticky] = useState(false);

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

  const t = useMemo(() => copy[pathLang], [pathLang]);
  const accessDemoUrl = getAccessDemoUrl(pathLang);
  const stepsItems = [
    { img: stepQr, label: t.stepsVisual[0] },
    { img: stepCapture, label: t.stepsVisual[1] },
    { img: stepAnticipation, label: t.stepsVisual[2] },
    { img: stepReveal, label: t.stepsVisual[3] },
  ];
  const testimonialItems = [
    {
      name: "Laura G.",
      event: "Boda en Madrid",
      quote:
        "El QR hizo que todos participaran. Al día siguiente fue brutal ver todas las fotos juntas.",
      image: testimonial1,
    },
    {
      name: "Carlos M.",
      event: "Evento corporativo",
      quote:
        "Nos ahorró apps y grupos. La galería quedó impecable y súper fácil de usar.",
      image: testimonial2,
    },
    {
      name: "Marta P.",
      event: "Cumpleaños 30",
      quote:
        "Todos subieron fotos sin complicaciones. El QR fue la mejor idea del evento.",
      image: testimonial3,
    },
    {
      name: "David R.",
      event: "Boda en Valencia",
      quote:
        "El revelado al día siguiente nos emocionó. Las fotos quedaron ordenadas y claras.",
      image: testimonial4,
    },
    {
      name: "Lucía S.",
      event: "Fiesta en Barcelona",
      quote:
        "Súper simple para los invitados. Compartimos el QR y listo.",
      image: testimonial5,
    },
    {
      name: "Javier T.",
      event: "Evento de empresa",
      quote:
        "Galería impecable y sin depender de apps. Ideal para eventos grandes.",
      image: testimonial6,
    },
  ];

  useEffect(() => {
    const title = t.title;
    const description = t.subtitle;
    const keywords = t.keywordLine;

    document.title = `${title} | Revelao.cam`;
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
    setProperty("og:title", `${title} | Revelao.cam`);
    setProperty("og:description", description);
    setProperty("og:image", "https://www.revelao.cam/og-qr-event.png");
    setProperty("og:type", "website");
  }, [t]);

  return (
    <div className="min-h-screen bg-background no-card-hover">
      <div
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          showSticky ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-sm border-b border-border">
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
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm" />
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
                <div className="flex justify-center lg:justify-start">
                  <img src={corazon} alt="Revelao" className="w-14 h-14" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground text-center lg:text-left">
                  {t.title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground text-center lg:text-left">
                  {t.subtitle}
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {[...t.taglineTags, ...t.keywordLine.split("·").map((tag) => tag.trim())].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ),
                  )}
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
            <div className="overflow-hidden rounded-2xl border border-border bg-white">
              <img
                src={bodaQrImage}
                alt={t.storyTitle}
                className="w-full h-64 md:h-72 object-cover object-center"
              />
            </div>
          </div>
        </section>

        <section className="container px-4 mx-auto py-12 md:py-16">
          <div className="max-w-5xl mx-auto text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">{t.stepsTitle}</h2>
            <p className="text-muted-foreground mt-2">{t.showcaseText}</p>
          </div>
          <div className="hidden md:grid max-w-5xl mx-auto grid-cols-1 md:grid-cols-2 gap-6">
            {stepsItems.map((item, idx) => (
              <div key={item.label.title} className="revelao-card">
                <div className="relative bg-muted flex items-center justify-center p-4 w-full">
                  <img
                    src={item.img}
                    alt={item.label.title}
                    className="w-[204px] h-[204px] object-contain"
                    style={{ filter: "grayscale(1) brightness(0)" }}
                  />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-foreground">
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
                loop: true,
              }}
            >
              <CarouselContent className="ml-0 gap-3">
                {stepsItems.map((item, idx) => (
                  <CarouselItem key={item.label.title} className="basis-[82%] pl-0">
                    <div className="revelao-card h-full">
                      <div className="relative bg-muted flex items-center justify-center p-4 w-full">
                        <img
                          src={item.img}
                          alt={item.label.title}
                          className="w-[204px] h-[204px] object-contain"
                          style={{ filter: "grayscale(1) brightness(0)" }}
                        />
                        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-foreground">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[template1, template2, template3].map((img, idx) => (
                  <div
                    key={img}
                    className="overflow-hidden rounded-xl border border-border bg-white"
                  >
                    <img
                      src={img}
                      alt={`QR template ${idx + 1}`}
                      className="w-full h-28 object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container px-4 mx-auto py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="revelao-card p-6 md:p-10 mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t.seoTitle}</h2>
              <p className="text-muted-foreground">{t.seoText}</p>
            </div>
            <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {testimonialItems.map((item) => (
                <div key={item.name} className="revelao-card p-5 flex gap-4 items-start">
                  <img
                    src={item.image}
                    alt={item.event}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.event}</span>
                    </div>
                    <div className="text-sm text-amber-500">★★★★★</div>
                    <p className="text-sm text-muted-foreground mt-2">“{item.quote}”</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:hidden">
              <Carousel
                className="w-full"
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent className="ml-0 gap-3">
                  {testimonialItems.map((item) => (
                    <CarouselItem key={item.name} className="basis-[82%] pl-0">
                      <div className="revelao-card p-5 flex gap-4 items-start">
                        <img
                          src={item.image}
                          alt={item.event}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{item.name}</span>
                            <span className="text-xs text-muted-foreground">{item.event}</span>
                          </div>
                          <div className="text-sm text-amber-500">★★★★★</div>
                          <p className="text-sm text-muted-foreground mt-2">“{item.quote}”</p>
                        </div>
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
            <div className="flex flex-wrap gap-2 justify-center">
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
      </main>
      <Footer />
    </div>
  );
};

export default QrEventLanding;
