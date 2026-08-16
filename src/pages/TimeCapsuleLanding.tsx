import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  ArrowRight,
  CalendarClock,
  Camera,
  Check,
  ChevronRight,
  Clock3,
  Heart,
  Image,
  LockKeyhole,
  MessageCircleHeart,
  Mic2,
  Play,
  Quote,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Footer } from "@/components/Footer";
import { getAdminLoginUrl } from "@/lib/i18n";
import icon from "@/assets/ico.png";

const timeCapsuleDemoUrl = "https://acceso.revelao.cam/capsuladeltiempo/demo";

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
    title: "Crea tu cápsula",
    description: "Ponle un nombre, elige una plantilla y decide cuándo se podrá abrir.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Invita a participar",
    description: "Comparte el enlace o el código QR con todas las personas que quieras.",
    icon: Users,
  },
  {
    number: "03",
    title: "Guardad los mensajes",
    description: "Recibe textos, fotos, vídeos y audios en un único lugar privado.",
    icon: MessageCircleHeart,
  },
  {
    number: "04",
    title: "Vivid el momento",
    description: "Cuando llegue la fecha, abrid la cápsula y disfrutad de cada recuerdo.",
    icon: CalendarClock,
  },
];

const examples = [
  {
    eyebrow: "Para una boda",
    title: "Mensajes para vuestro primer aniversario",
    description: "Los invitados dejan consejos, vídeos y deseos el día de la boda. La pareja los descubre un año después.",
    icon: Heart,
    tint: "bg-red-50",
  },
  {
    eyebrow: "Para un cumpleaños",
    title: "Un regalo firmado por todos",
    description: "Amigos y familia reúnen recuerdos, audios y fotos que se abren juntos durante la celebración.",
    icon: Sparkles,
    tint: "bg-amber-50",
  },
  {
    eyebrow: "Para el futuro",
    title: "Palabras que esperan el momento justo",
    description: "Crea una cápsula para un bebé, una graduación o cualquier fecha que merezca ser recordada.",
    icon: Clock3,
    tint: "bg-blue-50",
  },
];

const templates = [
  {
    name: "Nuestra historia",
    caption: "Cálida y romántica",
    className: "bg-[#f4e8e2] text-[#5b3933]",
    accent: "bg-[#b8685d]",
    lines: ["PARA VOLVER", "A ESTE DÍA"],
  },
  {
    name: "Dentro de un año",
    caption: "Editorial y elegante",
    className: "bg-[#171717] text-white",
    accent: "bg-white",
    lines: ["ABRIR EN", "AGOSTO 2027"],
  },
  {
    name: "Pequeños comienzos",
    caption: "Dulce y luminosa",
    className: "bg-[#e8efe5] text-[#3f5540]",
    accent: "bg-[#758c73]",
    lines: ["PARA CUANDO", "SEAS MAYOR"],
  },
  {
    name: "El mejor está por llegar",
    caption: "Colorida y alegre",
    className: "bg-[#f4d95d] text-[#352f22]",
    accent: "bg-[#e9584f]",
    lines: ["NOS VEMOS", "EN EL FUTURO"],
  },
];

const plans = [
  {
    name: "Evento Basic",
    messages: "Hasta 50 mensajes",
    price: "17€",
    description: "Para un regalo íntimo y lleno de significado.",
    features: ["Textos, fotos, vídeos y audios", "Fecha de apertura personalizada", "Enlace y QR para compartir"],
    href: import.meta.env.VITE_STRIPE_TIME_CAPSULE_50_URL ?? "https://buy.stripe.com/bJebIUgGZ6zsgIv8TR3ks07",
  },
  {
    name: "Evento Pro",
    messages: "Hasta 200 mensajes",
    price: "67€",
    description: "La opción ideal para celebraciones con todos los tuyos.",
    features: ["Todo lo incluido en Basic", "Hasta 200 aportaciones", "Descarga de todos los recuerdos"],
    href: import.meta.env.VITE_STRIPE_TIME_CAPSULE_200_URL ?? "https://buy.stripe.com/cNibIU8at2jc4ZNeeb3ks09",
    featured: true,
    badge: "Más elegido",
  },
  {
    name: "Evento Sin límites",
    messages: "Mensajes ilimitados",
    price: "130€",
    description: "Para grandes historias en las que todo el mundo cuenta.",
    features: ["Todo lo incluido en Pro", "Aportaciones ilimitadas", "Ideal para grandes eventos"],
    href: import.meta.env.VITE_STRIPE_TIME_CAPSULE_UNLIMITED_URL ?? "https://buy.stripe.com/aFabIU9ex1f83VJ3zx3ks08",
  },
];

const TimeCapsuleLanding = () => {
  const accessUrl = getAdminLoginUrl("es");
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoQr, setDemoQr] = useState("");

  useEffect(() => {
    const title = "Cápsula del tiempo digital | Guarda mensajes para el futuro | Revelao";
    const description =
      "Crea una cápsula del tiempo digital con mensajes, fotos, vídeos y audios. Compártela con los tuyos y abridla juntos en una fecha especial.";
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
      name: "Cápsula del tiempo digital by Revelao",
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
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
                <Clock3 className="h-4 w-4" /> Un regalo para vuestro yo del futuro
              </span>
              <h1 className="text-5xl font-bold leading-[0.98] tracking-[-0.045em] text-[#111] sm:text-6xl lg:text-7xl">
                Hay recuerdos que merecen esperar.
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0">
                Reúne mensajes, fotos, vídeos y audios de las personas que quieres. Cerrad la cápsula y volved a abrirla juntos en una fecha especial.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Button size="lg" className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90" asChild>
                  <a href="#precio">Crear mi cápsula <ArrowRight className="ml-2 h-4 w-4" /></a>
                </Button>
                <Button size="lg" variant="outline" className="h-12 rounded-full bg-white px-7" asChild>
                  <a href="#como-funciona">Ver cómo funciona</a>
                </Button>
              </div>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground lg:justify-start">
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Sin descargar apps</span>
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Acceso privado</span>
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Desde 17€</span>
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-[570px] items-center justify-center py-8 lg:py-0">
              <div className="absolute h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
              <div className="relative w-full rounded-[32px] border border-white/80 bg-white/75 p-4 shadow-[0_30px_80px_-35px_rgba(0,0,0,0.28)] backdrop-blur sm:p-7">
                <div className="rounded-[24px] bg-[#f5f5f5] p-5 sm:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Nuestra cápsula</p>
                      <h2 className="mt-1 text-2xl font-bold">Ana & Mateo</h2>
                    </div>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"><LockKeyhole className="h-5 w-5" /></span>
                  </div>
                  <div className="my-6 rounded-2xl bg-[#171717] p-5 text-white">
                    <p className="text-xs text-white/55">Se abrirá dentro de</p>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      {[{ value: "364", label: "días" }, { value: "18", label: "horas" }, { value: "42", label: "min" }].map((item) => (
                        <div key={item.label} className="rounded-xl bg-white/10 px-2 py-3">
                          <strong className="block text-xl">{item.value}</strong>
                          <span className="text-[11px] text-white/55">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <div className="mb-8 flex items-center justify-between"><Mic2 className="h-5 w-5 text-primary" /><span className="text-xs text-muted-foreground">01:24</span></div>
                      <p className="text-sm font-semibold">Un mensaje de mamá</p>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl bg-[#eed2c8] p-4 shadow-sm">
                      <div className="absolute -bottom-8 -right-7 h-24 w-24 rounded-full bg-primary/30" />
                      <Video className="relative h-5 w-5 text-primary" />
                      <div className="relative mt-8 flex items-center justify-between"><p className="text-sm font-semibold">Desde la fiesta</p><Play className="h-4 w-4 fill-current" /></div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3"><span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-50"><Quote className="h-4 w-4 text-primary" /></span><div><p className="text-sm font-semibold">Para vuestro futuro</p><p className="text-xs text-muted-foreground">48 recuerdos guardados</p></div></div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="que-es" className="scroll-mt-16 bg-[#f5f5f5] py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">Qué es</p>
                <h2 className="revelao-h2">Una sorpresa creada entre todos. Para abrir cuando tú decidas.</h2>
              </div>
              <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
                <p>Una cápsula del tiempo digital es un espacio privado donde guardar palabras, imágenes y voces que hoy significan algo y mañana significarán mucho más.</p>
                <p>Puede ser un regalo, una sorpresa colectiva o una forma de conservar un momento. Tú eliges quién participa, qué se guarda y la fecha en la que volveréis a vivirlo.</p>
              </div>
            </div>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: MessageCircleHeart, label: "Mensajes", text: "Palabras que se quedan" },
                { icon: Image, label: "Fotos", text: "Momentos irrepetibles" },
                { icon: Video, label: "Vídeos", text: "Recuerdos en movimiento" },
                { icon: Mic2, label: "Audios", text: "Voces para volver a escuchar" },
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
              <h2 className="revelao-h2">Prepararla es fácil. Esperar será la parte difícil.</h2>
              <p className="revelao-h3 mt-4">Sin aplicaciones, sin configuraciones complicadas y desde cualquier móvil.</p>
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
              <h2 className="revelao-h2">Una cápsula para cada historia.</h2>
              <p className="revelao-h3 mt-4">No hace falta una gran ocasión. Solo algo que quieras recordar.</p>
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
              <h2 className="revelao-h2">Hazla vuestra desde el primer mensaje.</h2>
              <p className="revelao-h3 mt-4">Elige el diseño que mejor encaje con vuestra historia. Podrás personalizar textos, fecha y colores.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {templates.map((template) => (
                <article key={template.name}>
                  <div className={`relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-2xl p-5 sm:p-7 ${template.className}`}>
                    <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.19em] opacity-70"><span>Cápsula</span><span>Revelao</span></div>
                    <div>
                      <span className={`mb-5 block h-10 w-10 rounded-full ${template.accent}`} />
                      <p className="font-serif text-2xl leading-[1.05] sm:text-3xl">{template.lines[0]}<br />{template.lines[1]}</p>
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.16em] opacity-60">Abrir cuando llegue el momento</p>
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
              <h2 className="revelao-h2">Elige cuánto queréis guardar.</h2>
              <p className="revelao-h3 mt-4">Un único pago. Sin suscripciones. Todos los packs incluyen textos, fotos, vídeos y audios.</p>
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
              <h2 className="relative mx-auto max-w-3xl text-3xl font-bold leading-tight md:text-5xl">El futuro llega antes de lo que parece. Guarda algo para cuando llegue.</h2>
              <Button size="lg" className="relative mt-8 h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90" asChild>
                <a href="#precio">Crear mi cápsula <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer text="Crea una cápsula del tiempo digital con las personas que quieres y volved a vivir juntos los mensajes, fotos, vídeos y audios cuando llegue el momento." />

      <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
        <DialogContent className="max-h-[92dvh] max-w-[94vw] overflow-y-auto border-0 bg-white p-0 shadow-2xl sm:rounded-3xl md:max-w-4xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Demo de Cápsula del tiempo</DialogTitle>
            <DialogDescription>
              Vista previa en un móvil y código QR para abrir la demo desde otro dispositivo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid min-h-[620px] md:grid-cols-[0.92fr_1.08fr]">
            <div className="flex items-center justify-center bg-[#f5f5f5] px-6 py-10 md:px-10">
              <div className="relative w-full max-w-[270px] rounded-[48px] bg-gradient-to-br from-[#555d65] via-[#121619] to-[#343a40] p-[9px] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.65)]">
                <span className="absolute -left-[3px] top-28 h-16 w-1 rounded-full bg-[#343a40]" aria-hidden="true" />
                <span className="absolute -left-[3px] top-48 h-11 w-1 rounded-full bg-[#343a40]" aria-hidden="true" />
                <span className="absolute -right-[3px] top-36 h-24 w-1 rounded-full bg-[#343a40]" aria-hidden="true" />
                <div className="relative aspect-[9/19.35] overflow-hidden rounded-[40px] bg-white ring-1 ring-black/80">
                  <div className="absolute left-1/2 top-2 z-10 h-7 w-[42%] -translate-x-1/2 rounded-full bg-[#090909]" aria-hidden="true" />
                  <div className="h-full w-full bg-white" aria-label="Aquí se mostrará la demo de la cápsula del tiempo" />
                  <div className="absolute bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-black/80" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center px-7 py-12 text-center sm:px-12 md:px-14">
              <img src={icon} alt="Revelao" className="mb-7 h-7 w-auto" />
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Demo en tu móvil</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111] sm:text-4xl">Escanea y descubre la experiencia</h2>
              <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">
                Lee este código QR con la cámara de tu móvil para abrir la demo de Cápsula del tiempo.
              </p>
              <div className="mt-8 rounded-2xl border border-border bg-white p-3 shadow-sm">
                {demoQr ? (
                  <img src={demoQr} alt="Código QR para abrir la demo de Cápsula del tiempo" className="h-52 w-52 sm:h-56 sm:w-56" />
                ) : (
                  <div className="h-52 w-52 animate-pulse rounded-xl bg-muted sm:h-56 sm:w-56" aria-label="Generando código QR" />
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
