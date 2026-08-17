import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  ArrowRight,
  CalendarClock,
  Camera,
  Check,
  Clock3,
  Heart,
  LockKeyhole,
  MessageCircleHeart,
  Play,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Footer } from "@/components/Footer";
import { getAdminLoginUrl } from "@/lib/i18n";
import icon from "@/assets/ico.png";

const timeCapsuleDemoUrl = "https://acceso.revelao.cam/capsula/33485fa7-57c4-49e2-86ee-347e43f6cdd5";

const navItems = [
  { label: "Qué es", href: "#que-es" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Ejemplos", href: "#ejemplos" },
  { label: "Plantillas", href: "#plantillas" },
  { label: "Precio", href: "#precio" },
];

const steps = [
  {
    number: "01",
    title: "Crea vuestra cápsula",
    description: "Personalízala con vuestros nombres y elegid en qué aniversario queréis abrirla.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Comparte el QR",
    description: "Colócalo en la boda para que todos los invitados puedan participar desde su móvil.",
    icon: Users,
  },
  {
    number: "03",
    title: "Recibid sus mensajes",
    description: "Cada invitado graba un vídeo con deseos, anécdotas o palabras para vuestro futuro.",
    icon: MessageCircleHeart,
  },
  {
    number: "04",
    title: "Abridla juntos",
    description: "Cuando llegue vuestro aniversario, descubrid por primera vez todos los mensajes.",
    icon: CalendarClock,
  },
];

const examples = [
  {
    eyebrow: "Primer aniversario",
    title: "Volved a escuchar a todos un año después",
    description: "Familiares y amigos graban sus deseos durante la boda para que los descubráis al celebrar vuestro primer año juntos.",
    icon: Heart,
    tint: "bg-red-50",
  },
  {
    eyebrow: "Sorpresa para los novios",
    title: "Un regalo secreto creado por los invitados",
    description: "La familia o los amigos preparan la cápsula y reúnen mensajes emotivos sin que la pareja sepa qué encontrará dentro.",
    icon: Sparkles,
    tint: "bg-amber-50",
  },
  {
    eyebrow: "Una boda irrepetible",
    title: "Las historias que solo pueden contarse en vídeo",
    description: "Guardad consejos, historias y declaraciones espontáneas de quienes compartieron con vosotros ese día.",
    icon: Clock3,
    tint: "bg-blue-50",
  },
];

const templates = [
  {
    name: "Romántica",
    caption: "Rosas, velas y tonos empolvados",
    image: "/capsule-card-romantic.jpg",
    contentClass: "left-[28%] right-[26%] top-[20%] bottom-[24%] text-[#5b3933]",
  },
  {
    name: "Clásica",
    caption: "Papel artesanal y flores blancas",
    image: "/capsule-card-classic.jpg",
    contentClass: "left-[25%] right-[20%] top-[24%] bottom-[18%] text-[#3d342d]",
  },
  {
    name: "Mediterránea",
    caption: "Luminosa, natural y sencilla",
    image: "/capsule-card-mediterranean.jpg",
    contentClass: "left-[24%] right-[24%] top-[25%] bottom-[20%] text-[#3f5540]",
  },
  {
    name: "Noche",
    caption: "Negra, minimalista y elegante",
    image: "/capsule-card-modern.jpg",
    contentClass: "left-[29%] right-[25%] top-[31%] bottom-[14%] text-white",
  },
];

const plans = [
  {
    name: "Boda íntima",
    messages: "Hasta 50 vídeos",
    price: "17€",
    description: "Para bodas íntimas y celebraciones con las personas más cercanas.",
    features: ["Hasta 50 mensajes en vídeo", "Aniversario de apertura personalizado", "Enlace y QR para los invitados"],
    href: import.meta.env.VITE_STRIPE_TIME_CAPSULE_50_URL ?? "https://buy.stripe.com/bJebIUgGZ6zsgIv8TR3ks07",
  },
  {
    name: "Boda completa",
    messages: "Hasta 200 vídeos",
    price: "67€",
    description: "La opción ideal para que participe toda vuestra boda.",
    features: ["Todo lo incluido en Boda íntima", "Hasta 200 mensajes de invitados", "Descarga de todos los vídeos"],
    href: import.meta.env.VITE_STRIPE_TIME_CAPSULE_200_URL ?? "https://buy.stripe.com/cNibIU8at2jc4ZNeeb3ks09",
    featured: true,
    badge: "Más elegido",
  },
  {
    name: "Boda sin límites",
    messages: "Vídeos ilimitados",
    price: "130€",
    description: "Para bodas grandes en las que nadie se queda sin dejar su mensaje.",
    features: ["Todo lo incluido en Boda completa", "Mensajes de boda ilimitados", "Ideal para grandes celebraciones"],
    href: import.meta.env.VITE_STRIPE_TIME_CAPSULE_UNLIMITED_URL ?? "https://buy.stripe.com/aFabIU9ex1f83VJ3zx3ks08",
  },
];

const TimeCapsuleLanding = () => {
  const accessUrl = getAdminLoginUrl("es");
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoQr, setDemoQr] = useState("");

  useEffect(() => {
    const title = "Cápsula del tiempo para bodas | Mensajes en vídeo | Revelao";
    const description =
      "Guarda los mensajes en vídeo de los invitados de vuestra boda y descubridlos juntos en un aniversario futuro. Sin apps, mediante un código QR.";
    const canonicalUrl = "https://www.revelao.cam/capsuladeltiempo";

    document.title = title;

    const setMeta = (selector: string, attribute: string, value: string, content: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, value);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[property="og:image"]', "property", "og:image", "https://www.revelao.cam/og-image.jpg");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Cápsula del tiempo para bodas by Revelao",
      description,
      brand: { "@type": "Brand", name: "Revelao" },
      offers: plans.map((plan) => ({
        "@type": "Offer",
        priceCurrency: "EUR",
        price: plan.price.replace("€", ""),
        availability: "https://schema.org/InStock",
        url: `${canonicalUrl}#precio`,
      })),
    };

    let schemaTag = document.getElementById("ld-time-capsule");
    if (!schemaTag) {
      schemaTag = document.createElement("script");
      schemaTag.id = "ld-time-capsule";
      schemaTag.setAttribute("type", "application/ld+json");
      document.head.appendChild(schemaTag);
    }
    schemaTag.textContent = JSON.stringify(schema);
  }, []);

  useEffect(() => {
    QRCode.toDataURL(timeCapsuleDemoUrl, {
      width: 320,
      margin: 2,
      color: { dark: "#111111", light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then(setDemoQr)
      .catch(() => setDemoQr(""));
  }, []);

  return (
    <div className="min-h-screen bg-white text-foreground">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-white/95 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center px-4">
          <a href="#inicio" className="flex shrink-0 items-center gap-2.5">
            <img src={icon} alt="Revelao" className="h-7 w-auto" />
            <span className="hidden text-sm font-semibold text-foreground min-[1300px]:inline">Cápsula del tiempo</span>
          </a>

          <div className="mx-auto hidden items-center gap-7 min-[1300px]:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {item.label}
              </a>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3 min-[1300px]:gap-6">
            <a
              href={accessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Acceder
            </a>
            <Button size="sm" className="rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90" asChild>
              <button type="button" onClick={() => setIsDemoOpen(true)}>
                Ver demo
              </button>
            </Button>
          </div>
        </div>
      </nav>

      <main>
        <section id="inicio" className="relative scroll-mt-16 overflow-hidden pt-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(239,68,68,0.12),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.08),transparent_30%)]" />
          <div className="container relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
            <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
              <h1 className="text-5xl font-bold leading-[0.98] tracking-[-0.045em] text-[#111] sm:text-6xl lg:text-7xl">
                Los vídeos de vuestra boda que descubriréis años después.
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0">
                Durante vuestro día especial, los invitados graban mensajes en vídeo desde su móvil, sin descargar ninguna app. Quedan sellados hasta la fecha que vosotros elijáis: dentro de uno, cinco o los años que queráis.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Button size="lg" className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90" asChild>
                  <a href="#precio">Crear nuestra cápsula <ArrowRight className="ml-2 h-4 w-4" /></a>
                </Button>
                <Button size="lg" variant="outline" className="h-12 rounded-full bg-white px-7" asChild>
                  <a href="#como-funciona">Cómo funciona en una boda</a>
                </Button>
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-[570px] items-center justify-center py-8 lg:py-0">
              <div className="absolute h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
              <button
                type="button"
                onClick={() => setIsDemoOpen(true)}
                className="group relative w-full max-w-[430px] rounded-[32px] border border-white/80 bg-white/75 p-4 text-left shadow-[0_30px_80px_-35px_rgba(0,0,0,0.28)] backdrop-blur transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 sm:p-6"
                aria-label="Abrir la demo de la cápsula del tiempo"
              >
                <div className="relative mx-auto aspect-[9/16] max-h-[640px] overflow-hidden rounded-[24px] bg-black shadow-2xl">
                  <img
                    src="/time-capsule-cover.jpg"
                    alt="Pantallazo del flujo de la cápsula del tiempo de María y Marcos"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />
                  <div className="absolute inset-x-0 top-0 px-6 pt-8 text-center text-white sm:px-8 sm:pt-10">
                    <p className="font-serif text-4xl font-semibold leading-none drop-shadow-md sm:text-5xl">María &amp; Marcos</p>
                    <span className="mx-auto mt-4 block h-1 w-12 rounded-full bg-[#f06a5f]" />
                  </div>
                  <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-red-500" /> Demo real
                  </span>
                  <span className="absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#111] shadow-xl transition-transform group-hover:scale-105">
                    <Play className="ml-1 h-6 w-6 fill-current" />
                  </span>
                  <div className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-7 sm:pb-8">
                    <span className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f06a5f] px-6 font-semibold text-white shadow-lg">
                      <Video className="h-4 w-4" /> Empezar
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-center text-sm font-medium text-muted-foreground">Prueba cómo dejarán su mensaje los invitados</p>
              </button>
            </div>
          </div>
        </section>

        <section id="que-es" className="scroll-mt-16 bg-[#f5f5f5] py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">Qué es</p>
                <h2 className="revelao-h2">Una sorpresa de boda creada entre todos. Para vosotros dos.</h2>
              </div>
              <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
                <p>La cápsula del tiempo de vuestra boda es un espacio privado donde cada invitado puede grabar unas palabras para vuestro futuro desde su propio móvil.</p>
                <p>Durante la celebración nadie ve los vídeos de los demás. Todos quedan guardados hasta el aniversario que elijáis, cuando podréis abrirlos y descubrirlos juntos por primera vez.</p>
              </div>
            </div>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: MessageCircleHeart, label: "Deseos", text: "Palabras para vuestra vida juntos" },
                { icon: Heart, label: "Consejos", text: "Lo que los vuestros quieren contaros" },
                { icon: Video, label: "Vídeos", text: "Mensajes grabados desde cada móvil" },
                { icon: CalendarClock, label: "El reencuentro", text: "Los vídeos se abren en la fecha elegida" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white p-6">
                  <item.icon className="mb-7 h-6 w-6 text-primary" />
                  <h3 className="font-semibold">{item.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-16 bg-white py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">Cómo funciona</p>
              <h2 className="revelao-h2">Preparadla antes de la boda. Dejad que ellos hagan el resto.</h2>
              <p className="revelao-h3 mt-4">Los invitados escanean, graban y envían su mensaje sin instalar ninguna aplicación.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <article key={step.number} className="group rounded-2xl bg-[#f5f5f5] p-6 transition-transform duration-300 hover:-translate-y-1">
                  <div className="mb-10 flex items-center justify-between">
                    <span className="text-sm font-semibold text-muted-foreground">{step.number}</span>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white"><step.icon className="h-5 w-5 text-primary" /></span>
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="ejemplos" className="scroll-mt-16 bg-[#f5f5f5] py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-12 max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">Ejemplos</p>
              <h2 className="revelao-h2">Muchas formas de convertirla en el regalo de vuestra boda.</h2>
              <p className="revelao-h3 mt-4">La preparéis vosotros o sea una sorpresa, cada invitado deja una parte de vuestra historia.</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {examples.map((example) => (
                <article key={example.title} className="overflow-hidden rounded-2xl bg-white">
                  <div className={`flex h-48 items-center justify-center ${example.tint}`}>
                    <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/80 shadow-sm"><example.icon className="h-9 w-9 text-primary" strokeWidth={1.6} /></span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{example.eyebrow}</p>
                    <h3 className="mt-3 text-xl font-semibold leading-snug">{example.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{example.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="plantillas" className="scroll-mt-16 bg-white py-20 md:py-28">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">Plantillas</p>
              <h2 className="revelao-h2">Un diseño que también hable de vuestra boda.</h2>
              <p className="revelao-h3 mt-4">Elegid el estilo de la cápsula y personalizad vuestros nombres, el mensaje para los invitados y la fecha de apertura.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 md:gap-7">
              {templates.map((template) => (
                <article key={template.name}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#eee] shadow-sm">
                    <img
                      src={template.image}
                      alt={`Tarjeta QR ${template.name.toLowerCase()} colocada en una mesa de boda`}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className={`absolute flex flex-col items-center justify-center text-center ${template.contentClass}`}>
                      <p className="font-serif text-[clamp(1rem,3vw,2rem)] font-semibold leading-none">María &amp; Marcos</p>
                      <p className="mt-2 max-w-[240px] text-[clamp(0.48rem,1.2vw,0.76rem)] font-medium leading-snug">
                        Escanea el QR con tu móvil y déjanos un mensaje.
                      </p>
                      {demoQr ? (
                        <span className="my-2 inline-flex rounded-md bg-white p-1.5 shadow-sm">
                          <img src={demoQr} alt="QR de ejemplo para dejar un mensaje en vídeo" className="h-14 w-14 sm:h-20 sm:w-20" />
                        </span>
                      ) : (
                        <span className="my-2 block h-14 w-14 animate-pulse rounded-md bg-white/80 sm:h-20 sm:w-20" />
                      )}
                      <p className="max-w-[250px] text-[clamp(0.43rem,1vw,0.68rem)] leading-snug">
                        Lo abriremos dentro de 5 años, el 15 de agosto de 2031. Nos hará muchísima ilusión.
                      </p>
                    </div>
                  </div>
                  <h3 className="mt-4 text-sm font-semibold sm:text-base">{template.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{template.caption}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="precio" className="scroll-mt-16 bg-[#f5f5f5] py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">Precio · Comprar</p>
              <h2 className="revelao-h2">Elegid cuántos invitados podrán dejaros un mensaje.</h2>
              <p className="revelao-h3 mt-4">Un único pago y sin suscripciones. Todos los packs incluyen personalización, QR y fecha de apertura.</p>
            </div>
            <div className="grid items-stretch gap-5 md:grid-cols-3">
              {plans.map((plan) => (
                <article key={plan.name} className={`relative flex flex-col rounded-2xl border p-6 md:p-7 ${plan.featured ? "border-red-300 bg-red-50 shadow-[0_18px_45px_-30px_rgba(239,68,68,0.65)]" : "border-border bg-white"}`}>
                  {plan.badge ? <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">{plan.badge}</span> : null}
                  <p className="text-sm font-semibold text-muted-foreground">{plan.name}</p>
                  <h3 className="mt-4 text-2xl font-bold">{plan.messages}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
                  <div className="mt-6 flex items-end gap-2"><strong className="text-5xl font-bold tracking-tight">{plan.price}</strong><span className="pb-1.5 text-sm text-muted-foreground">pago único</span></div>
                  <div className="my-6 h-px bg-border" />
                  <ul className="mb-7 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{feature}</span></li>
                    ))}
                  </ul>
                  <Button className="mt-auto w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                    <a href={plan.href} target="_blank" rel="noopener noreferrer">Comprar<ArrowRight className="ml-2 h-4 w-4" /></a>
                  </Button>
                </article>
              ))}
            </div>
            <p className="mt-7 text-center text-sm text-muted-foreground"><LockKeyhole className="mr-1.5 inline h-4 w-4" />Pago seguro gestionado por Stripe.</p>
          </div>
        </section>

        <section className="bg-white py-20 md:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="relative overflow-hidden rounded-[28px] bg-[#171717] px-6 py-14 text-center text-white md:px-14 md:py-20">
              <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
              <Camera className="relative mx-auto mb-6 h-8 w-8 text-primary" />
              <h2 className="relative mx-auto max-w-3xl text-3xl font-bold leading-tight md:text-5xl">La boda dura un día. Sus palabras pueden acompañaros toda la vida.</h2>
              <Button size="lg" className="relative mt-8 h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90" asChild>
                <a href="#precio">Crear nuestra cápsula <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer text="Cread una cápsula del tiempo para vuestra boda, reunid los mensajes en vídeo de todos los invitados y descubridlos juntos cuando llegue vuestro aniversario." />

      <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
        <DialogContent className="max-h-[92dvh] max-w-[94vw] overflow-y-auto border-0 bg-white p-0 shadow-2xl sm:rounded-3xl md:max-w-4xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Demo de mensajes para la boda</DialogTitle>
            <DialogDescription>
              Prueba cómo los invitados dejarán sus mensajes en la cápsula de la boda.
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:min-h-[620px] md:grid-cols-[0.92fr_1.08fr]">
            <div className="flex items-center justify-center bg-[#f5f5f5] px-5 py-7 sm:px-6 sm:py-10 md:px-10">
              <div className="relative w-full max-w-[230px] rounded-[42px] bg-gradient-to-br from-[#555d65] via-[#121619] to-[#343a40] p-[8px] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.65)] sm:max-w-[270px] sm:rounded-[48px] sm:p-[9px]">
                <span className="absolute -left-[3px] top-28 h-16 w-1 rounded-full bg-[#343a40]" aria-hidden="true" />
                <span className="absolute -left-[3px] top-48 h-11 w-1 rounded-full bg-[#343a40]" aria-hidden="true" />
                <span className="absolute -right-[3px] top-36 h-24 w-1 rounded-full bg-[#343a40]" aria-hidden="true" />
                <div className="relative aspect-[9/19.35] overflow-hidden rounded-[40px] bg-white ring-1 ring-black/80">
                  <iframe
                    title="Demo de la cápsula del tiempo"
                    src={timeCapsuleDemoUrl}
                    className="h-[155%] w-[155%] origin-top-left scale-[0.6452] border-0 bg-white"
                    allow="camera; microphone; fullscreen; clipboard-write"
                  />
                  <div className="absolute bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-black/80" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="hidden flex-col items-center justify-center px-6 py-9 text-center sm:px-12 md:flex md:px-14 md:py-12">
              <img src={icon} alt="Revelao" className="mb-5 h-7 w-auto md:mb-7" />
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Así participarán los invitados</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111] sm:text-4xl">Escanea y deja un mensaje para los novios</h2>
              <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">
                Lee el QR con la cámara de tu móvil y prueba el mismo flujo que encontrarán los invitados el día de la boda.
              </p>
              <div className="mt-6 rounded-2xl border border-border bg-white p-3 shadow-sm md:mt-8">
                {demoQr ? (
                  <img src={demoQr} alt="Código QR para abrir la demo de Cápsula del tiempo" className="h-48 w-48 sm:h-56 sm:w-56" />
                ) : (
                  <div className="h-48 w-48 animate-pulse rounded-xl bg-muted sm:h-56 sm:w-56" aria-label="Generando código QR" />
                )}
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <Camera className="h-4 w-4 text-primary" /> No necesitas instalar ninguna app
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TimeCapsuleLanding;
