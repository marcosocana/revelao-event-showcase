import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import template4 from "@/assets/template-4.png";

const getLangFromPath = (pathname: string) => {
  if (pathname.startsWith("/en/") || pathname === "/en") return "en";
  if (pathname.startsWith("/it/") || pathname === "/it") return "it";
  return "es";
};

const copy = {
  es: {
    title: "Evento con Código QR para Compartir Fotos",
    subtitle:
      "Galería de fotos para evento con código QR: comparte fotos con QR en bodas y celebraciones sin app y con acceso inmediato.",
    intro:
      "Revelao.cam es la plataforma para crear un evento QR en minutos. Ideal para bodas, cumpleaños y eventos corporativos.",
    h1: "Galería de Fotos para Evento con Código QR",
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
    seoMeta: {
      title: "Revelao.cam | Galería QR para bodas y eventos",
      description:
        "Crea un evento con código QR para compartir fotos en bodas, fiestas y eventos corporativos. Sin app, acceso inmediato, galería privada y revelado.",
      keywords:
        "evento con código QR, fotos con QR para boda, galería QR para eventos, compartir fotos con QR",
    },
    footer: {
      text:
        "Revelao.cam te permite crear una galería de fotos con código QR para bodas, fiestas y eventos corporativos. Sin app, acceso inmediato y revelado para compartir recuerdos.",
      keywordsTitle: "Búsquedas frecuentes",
      keywords: [
        "Galería QR para eventos",
        "Fotos con QR para boda",
        "Evento con código QR",
        "Compartir fotos sin app",
        "QR para celebraciones",
      ],
    },
    seoSections: [
      {
        title: "¿Cómo funciona el QR en tu evento?",
        body: [
          "Crear un evento con código QR en Revelao es rápido: defines el evento, generas el QR y lo compartes con tus invitados. Al escanear, entran directamente a la galería y pueden subir fotos desde el navegador, sin descargar apps ni registrarse. Así consigues una participación mucho mayor y todas las imágenes quedan en un solo lugar, ordenadas y listas para compartir.",
          "El QR puede colocarse en mesas, carteles o tarjetas y también en la entrada del evento. Cada invitado accede en segundos, sube sus fotos y aporta su visión del evento. Al final, la galería se convierte en un álbum colaborativo con recuerdos auténticos y completos, sin perder ninguna perspectiva.",
          "Si quieres, puedes acompañar el QR con instrucciones sencillas para que todo el mundo lo entienda al instante. Eso hace que incluso los invitados menos tecnológicos participen sin problemas.",
        ],
      },
      {
        title: "Ventajas frente a grupos de WhatsApp o Drive",
        body: [
          "Los grupos de WhatsApp se llenan de mensajes y se pierde calidad. Drive o carpetas compartidas generan fricción: hay que pedir permisos, subir archivos manualmente y luego ordenar. Con una galería QR para eventos todo se centraliza automáticamente y la experiencia es mucho más limpia.",
          "Además, la galería QR ofrece control: decides la duración de la subida y cuándo mostrar el resultado. Eso evita caos y hace que los invitados se enfoquen en vivir el evento mientras las fotos se recopilan sin esfuerzo. También reduces el trabajo posterior, porque la galería ya queda lista para compartir.",
          "El acceso con QR también evita enlaces largos o contraseñas confusas. En un solo gesto, todos están dentro de la misma galería.",
        ],
      },
      {
        title: "Ideal para bodas, fiestas y eventos corporativos",
        body: [
          "En una boda, las fotos con QR para boda permiten captar momentos desde todos los ángulos, incluyendo detalles íntimos que el fotógrafo oficial no siempre ve. En fiestas, el QR convierte a los invitados en fotógrafos y crea una galería divertida y espontánea. En eventos corporativos, facilita la documentación y el acceso posterior al material.",
          "En cualquier caso, el objetivo es el mismo: compartir fotos con QR de forma rápida, segura y sin app. Eso mejora la participación y garantiza una colección completa, lista para revivir el evento en grupo.",
          "También es perfecto para aniversarios, graduaciones y cualquier celebración donde quieras recuerdos reales y compartidos.",
        ],
      },
      {
        title: "Crea tu evento con QR en minutos",
        body: [
          "Solo necesitas elegir un nombre para el evento, generar el QR y compartirlo. En minutos tendrás una galería QR para eventos activa y lista para recibir fotos. Es la forma más simple de reunir recuerdos, sin complicaciones técnicas, sin instalaciones y con resultados profesionales.",
          "Cuando el evento termina, la galería queda como archivo visual para volver a verla o compartirla con invitados y familia.",
        ],
      },
    ],
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
    title: "QR Event to Share Photos",
    subtitle:
      "Photo gallery for QR events: share photos with QR at weddings and celebrations with no app.",
    intro:
      "Revelao.cam is the platform to create a QR event in minutes. Perfect for weddings, birthdays, and corporate events.",
    h1: "Photo Gallery for Events with QR Code",
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
    seoMeta: {
      title: "Revelao.cam | QR photo gallery for weddings & events",
      description:
        "Create a QR event to share photos at weddings, parties, and corporate events. No app, instant access, private gallery, and a reveal moment.",
      keywords:
        "qr code event, wedding photos with qr, qr gallery for events, share photos with qr",
    },
    footer: {
      text:
        "Revelao.cam helps you create a QR photo gallery for weddings, parties, and corporate events. No app, instant access, and a shared reveal moment.",
      keywordsTitle: "Popular searches",
      keywords: [
        "QR photo gallery",
        "Wedding QR photos",
        "QR code event",
        "Share photos without app",
        "QR for celebrations",
      ],
    },
    seoSections: [
      {
        title: "How does the QR work at your event?",
        body: [
          "With Revelao you create a QR event, print the code and share it with guests. They scan it and upload photos from the browser without installing anything. That makes participation effortless and keeps every image in one organized gallery.",
          "The QR can be placed on tables, signs or cards so guests always have access. The result is a collaborative album that captures the full story of the event.",
          "Add a short instruction next to the QR and even less tech‑savvy guests will participate.",
        ],
      },
      {
        title: "Advantages over WhatsApp or Drive",
        body: [
          "WhatsApp threads get messy and image quality is reduced. Drive folders require permissions and manual uploads. A QR gallery for events removes friction and centralizes everything automatically.",
          "You control the upload window and when to reveal the gallery, which makes the experience cleaner and more engaging for everyone.",
          "One scan is all it takes, no passwords or long links required.",
        ],
      },
      {
        title: "Perfect for weddings, parties, and corporate events",
        body: [
          "For weddings, QR photos capture every angle. For parties, the QR turns guests into contributors. For corporate events, it centralizes content and makes sharing easier afterwards.",
          "In every case, sharing photos with QR is fast, secure, and app-free.",
          "It also works great for anniversaries, graduations, and community events.",
        ],
      },
      {
        title: "Create your QR event in minutes",
        body: [
          "Choose a name, generate the QR, and share it. In minutes your QR gallery for events is live and ready for uploads.",
          "When the event ends, the gallery stays as a visual archive to revisit and share.",
        ],
      },
    ],
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
    title: "Evento QR per condividere foto",
    subtitle:
      "Galleria foto per eventi con QR: condividi foto con QR per matrimoni e feste senza app.",
    intro:
      "Revelao.cam è la piattaforma per creare un evento QR in pochi minuti. Perfetto per matrimoni, compleanni ed eventi aziendali.",
    h1: "Galleria di Foto per Evento con Codice QR",
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
    seoMeta: {
      title: "Revelao.cam | Galleria foto QR per matrimoni ed eventi",
      description:
        "Crea un evento con codice QR per condividere foto a matrimoni, feste ed eventi aziendali. Nessuna app, accesso immediato, galleria privata e rivelazione.",
      keywords:
        "evento con codice QR, foto con QR per matrimonio, galleria QR per eventi, condividere foto con QR",
    },
    footer: {
      text:
        "Revelao.cam ti permette di creare una galleria foto con codice QR per matrimoni, feste ed eventi aziendali. Nessuna app, accesso immediato e rivelazione.",
      keywordsTitle: "Ricerche frequenti",
      keywords: [
        "Galleria QR per eventi",
        "Foto QR per matrimonio",
        "Evento con codice QR",
        "Condividere foto senza app",
        "QR per feste",
      ],
    },
    seoSections: [
      {
        title: "Come funziona il QR nel tuo evento?",
        body: [
          "Con Revelao crei un evento QR, stampi il codice e lo condividi con gli invitati. Scansionano e caricano foto dal browser senza installare nulla. Così la partecipazione è più alta e tutte le immagini restano in un’unica galleria ordinata.",
          "Puoi mettere il QR su tavoli, cartelli o inviti, così è sempre disponibile durante l’evento.",
          "Con una breve istruzione accanto al QR, tutti capiscono subito come partecipare.",
        ],
      },
      {
        title: "Vantaggi rispetto a WhatsApp o Drive",
        body: [
          "Nei gruppi WhatsApp le foto si perdono e la qualità cala. Su Drive bisogna chiedere permessi e caricare manualmente. Una galleria QR per eventi elimina attriti e centralizza tutto.",
          "Decidi la durata del caricamento e quando rivelare la galleria, rendendo l’esperienza più pulita e coinvolgente.",
          "Basta una scansione: niente link lunghi o password difficili.",
        ],
      },
      {
        title: "Ideale per matrimoni, feste ed eventi aziendali",
        body: [
          "Per un matrimonio, le foto con QR raccolgono ogni momento. Per le feste, il QR rende tutti partecipi. Per gli eventi aziendali, centralizza i contenuti e facilita la condivisione.",
          "In ogni caso, condividere foto con QR è rapido, sicuro e senza app.",
          "È perfetto anche per anniversari, lauree e altri eventi speciali.",
        ],
      },
      {
        title: "Crea il tuo evento QR in pochi minuti",
        body: [
          "Scegli un nome, genera il QR e condividilo. In pochi minuti la tua galleria QR è pronta per ricevere foto.",
          "A fine evento, la galleria resta come archivio visivo da rivedere e condividere.",
        ],
      },
    ],
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

  const t = useMemo(() => copy[pathLang], [pathLang]);
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
                loop: false,
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
                <div key={section.title} className="revelao-card p-6 md:p-8">
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
            <div className="revelao-card p-6 md:p-10 mb-8">
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
        text={t.footer?.text}
        keywordsTitle={t.footer?.keywordsTitle}
        keywords={t.footer?.keywords}
      />
    </div>
  );
};

export default QrEventLanding;
