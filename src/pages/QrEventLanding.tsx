import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useI18n, getAccessDemoUrl, getAdminLoginUrl } from "@/lib/i18n";
import corazon from "@/assets/corazon.svg";

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
    ctaPrimary: "Crear evento demo",
    ctaSecondary: "Gestionar mi evento",
    stepsTitle: "Cómo funciona un evento con QR",
    steps: [
      "Crea tu evento QR en menos de 1 minuto.",
      "Comparte el código QR con tus invitados.",
      "Tus invitados suben fotos durante el evento.",
      "Al día siguiente se revelan todas juntas.",
    ],
    benefitsTitle: "Por qué crear un evento QR con Revelao",
    benefits: [
      "Sin apps: solo QR y navegador.",
      "Fotos ilimitadas durante el evento.",
      "Galería privada con acceso controlado.",
      "Experiencia de revelado al día siguiente.",
    ],
    seoTitle: "Optimizado para bodas y eventos QR",
    seoText:
      "Si buscas una herramienta de evento QR para bodas, Revelao.cam te permite crear un evento con QR y reunir todas las fotos de forma simple y segura.",
    faqTitle: "Preguntas frecuentes sobre eventos con QR",
    faqs: [
      {
        q: "¿Cómo creo un evento con QR?",
        a: "Solo tienes que crear un evento demo, personalizarlo y compartir el QR con tus invitados.",
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
    ctaPrimary: "Create demo event",
    ctaSecondary: "Manage my event",
    stepsTitle: "How a QR event works",
    steps: [
      "Create your QR event in under 1 minute.",
      "Share the QR code with your guests.",
      "Guests upload photos during the event.",
      "All photos are revealed together the next day.",
    ],
    benefitsTitle: "Why create a QR event with Revelao",
    benefits: [
      "No apps: just QR and browser.",
      "Unlimited photos during the event.",
      "Private gallery with controlled access.",
      "Next-day reveal experience.",
    ],
    seoTitle: "Built for weddings and QR events",
    seoText:
      "If you’re looking for a QR event tool for weddings, Revelao.cam lets you create a QR event and gather all photos simply and securely.",
    faqTitle: "QR event FAQs",
    faqs: [
      {
        q: "How do I create a QR event?",
        a: "Create a demo event, customize it, and share the QR with your guests.",
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
    ctaPrimary: "Crea evento demo",
    ctaSecondary: "Gestisci il mio evento",
    stepsTitle: "Come funziona un evento QR",
    steps: [
      "Crea il tuo evento QR in meno di 1 minuto.",
      "Condividi il codice QR con gli invitati.",
      "Gli invitati caricano foto durante l’evento.",
      "Tutte le foto si rivelano il giorno dopo.",
    ],
    benefitsTitle: "Perché creare un evento QR con Revelao",
    benefits: [
      "Nessuna app: solo QR e browser.",
      "Foto illimitate durante l’evento.",
      "Galleria privata con accesso controllato.",
      "Esperienza di rivelazione il giorno dopo.",
    ],
    seoTitle: "Pensato per matrimoni ed eventi QR",
    seoText:
      "Se cerchi uno strumento per eventi QR per matrimoni, Revelao.cam ti permette di creare un evento QR e raccogliere tutte le foto in modo semplice e sicuro.",
    faqTitle: "FAQ sugli eventi QR",
    faqs: [
      {
        q: "Come creo un evento QR?",
        a: "Crea un evento demo, personalizzalo e condividi il QR con gli invitati.",
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

  useEffect(() => {
    if (lang !== pathLang) {
      setLang(pathLang);
    }
  }, [lang, pathLang, setLang]);

  const t = useMemo(() => copy[pathLang], [pathLang]);
  const accessDemoUrl = getAccessDemoUrl(pathLang);
  const adminLoginUrl = getAdminLoginUrl(pathLang);

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
  }, [t]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <section className="container px-4 mx-auto py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <img src={corazon} alt="Revelao" className="w-16 h-16" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground">
              {t.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t.subtitle}
            </p>
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
              {t.keywordLine}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <a href={accessDemoUrl} target="_blank" rel="noopener noreferrer">
                  {t.ctaPrimary}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={adminLoginUrl} target="_blank" rel="noopener noreferrer">
                  {t.ctaSecondary}
                </a>
              </Button>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t.intro}</p>
          </div>
        </section>

        <section className="container px-4 mx-auto py-10 md:py-16">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="revelao-card p-6">
              <h2 className="text-2xl font-semibold mb-4">{t.stepsTitle}</h2>
              <ol className="space-y-3 text-muted-foreground">
                {t.steps.map((step, idx) => (
                  <li key={step} className="flex gap-3">
                    <span className="font-semibold text-primary">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
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
          </div>
        </section>

        <section className="container px-4 mx-auto py-10 md:py-16">
          <div className="max-w-4xl mx-auto revelao-card p-6 md:p-10">
            <h2 className="text-2xl font-semibold mb-4">{t.seoTitle}</h2>
            <p className="text-muted-foreground">{t.seoText}</p>
          </div>
        </section>

        <section className="container px-4 mx-auto py-10 md:py-16">
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
            <h2 className="text-2xl md:text-3xl font-semibold">{t.ctaPrimary}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.subtitle}
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <a href={accessDemoUrl} target="_blank" rel="noopener noreferrer">
                {t.ctaPrimary}
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default QrEventLanding;
