import { useEffect } from "react";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  Coffee,
  Download,
  Images,
  PartyPopper,
  QrCode,
  Sparkles,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { PageSeo } from "@/components/PageSeo";
import logo from "@/assets/LogoMiniRevelao.png";
import "@/styles/captains-landing.css";
import "@/styles/photostrip-landing.css";

const createUrl = "https://acceso.revelao.cam/nuevophotostripdemo";
const accessUrl = "https://acceso.revelao.cam";

const steps = [
  ["Creas el evento", "Personaliza el nombre, las fechas y el acabado de la tira."],
  ["Compartes el QR", "Los invitados entran al fotomatón desde su propio móvil."],
  ["Posan una sola vez", "Una cuenta atrás captura cuatro fotos de forma automática."],
  ["Se revela la tira", "Pueden descargarla y verla en el mural común del evento."],
];

const plans = [
  {
    id: "photostrip_100",
    name: "Pack 100",
    strips: "Hasta 100 tiras",
    price: "29 €",
    ideal: "Ideal para celebraciones íntimas",
    stripeUrl: "https://buy.stripe.com/aFafZa1M53ngak78TR3ks0a",
    featured: false,
  },
  {
    id: "photostrip_200",
    name: "Pack 200",
    strips: "Hasta 200 tiras",
    price: "49 €",
    ideal: "Ideal para bodas y eventos medianos",
    stripeUrl: "https://buy.stripe.com/28EdR28atga2bob5HF3ks0b",
    featured: true,
  },
  {
    id: "photostrip_unlimited",
    name: "Ilimitado",
    strips: "Tiras ilimitadas",
    price: "79 €",
    ideal: "Ideal para eventos grandes",
    stripeUrl: "https://buy.stripe.com/4gM28k2Q92jcdwjb1Z3ks0c",
    featured: false,
  },
];

const faqs = [
  ["¿Hace falta descargar una app?", "No. Photostrip funciona directamente en el navegador del móvil al escanear el QR."],
  ["¿Cuántas fotos hace cada invitado?", "Cada participación crea una tira con cuatro fotografías. La captura es automática después de pulsar Empezar."],
  ["¿Se puede elegir color o blanco y negro?", "Sí. Puedes permitir color, blanco y negro o dejar que cada invitado elija antes de empezar."],
  ["¿Dónde se guardan las tiras?", "Cada persona descarga la suya y las tiras terminadas aparecen en la galería compartida del evento, según la privacidad que configures."],
  ["¿Los invitados pueden repetir sin límite?", "No. Cada navegador dispone de una única participación por evento, evitando repeticiones accidentales y manteniendo la experiencia ágil."],
];

const StripPreview = ({ className = "" }: { className?: string }) => (
  <div className={`photostrip-strip w-full rounded-lg bg-white p-2 shadow-[0_16px_36px_rgba(20,20,20,.14)] ${className}`}>
    <div className="space-y-2">
      {["bg-[#e78c84]", "bg-[#e8bf79]", "bg-[#7ca69b]", "bg-[#80727e]"].map((color, index) => (
        <div key={color} className={`relative aspect-[4/3] overflow-hidden rounded-md ${color}`}>
          <span className="absolute left-[36%] top-[17%] h-9 w-9 rounded-full bg-[#f3d0b7]" />
          <span className="absolute bottom-0 left-[24%] h-[48%] w-[52%] rounded-t-full bg-[#2b2725]" />
          <span className="absolute left-2 top-2 text-[9px] font-semibold text-white/80">0{index + 1}</span>
        </div>
      ))}
    </div>
    <div className="px-1 pb-1 pt-3 text-center text-foreground">
      <p className="text-sm font-semibold">Laura & Miguel</p>
      <p className="mt-0.5 text-[8px] font-medium uppercase tracking-[.16em] text-muted-foreground">Photostrip · Revelao</p>
    </div>
  </div>
);

const HeroVisual = () => (
  <div className="photostrip-hero-visual relative mx-auto w-full px-4 pb-7 sm:px-7" aria-label="Vista previa del fotomatón Photostrip">
    <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-[#fff1ef] px-5 pb-7 pt-12 shadow-[0_24px_64px_-34px_rgba(240,106,95,.5)] sm:px-8 sm:pt-14">
      <span className="absolute left-6 top-6 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" /> En directo
      </span>
      <div className="mx-auto max-w-[280px] rounded-3xl border border-border bg-white p-3 shadow-sm">
        <div className="rounded-2xl bg-muted px-5 py-9 text-center sm:py-11">
          <Camera className="mx-auto h-6 w-6 text-primary" />
          <p className="mt-4 text-xs font-semibold text-muted-foreground">Mira a cámara</p>
          <p className="mt-1 text-6xl font-bold tracking-[-.08em]">3</p>
          <div className="mx-auto mt-5 grid max-w-[190px] grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((number) => (
              <span key={number} className={`grid aspect-square place-items-center rounded-full text-xs font-semibold ${number === 1 ? "bg-primary text-white" : "border border-border bg-white text-muted-foreground"}`}>{number}</span>
            ))}
          </div>
          <p className="mt-5 text-xs font-medium text-muted-foreground">Foto 1 de 4</p>
        </div>
      </div>
    </div>
    <StripPreview className="absolute -bottom-4 right-0 rotate-3 sm:-right-2" />
  </div>
);

const PhotostripLanding = () => {
  useEffect(() => {
    const schema = document.createElement("script");
    schema.id = "ld-photostrip";
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Photostrip by Revelao",
      description: "Fotomatón digital para bodas y eventos con cuatro fotos, tira descargable y galería compartida mediante QR.",
      brand: { "@type": "Brand", name: "Revelao" },
      url: "https://www.revelao.cam/photostrip",
      offers: plans.map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        price: plan.price.replace(" €", ""),
        priceCurrency: "EUR",
        url: plan.stripeUrl,
        availability: "https://schema.org/InStock",
      })),
    });
    document.getElementById(schema.id)?.remove();
    document.head.appendChild(schema);
    return () => schema.remove();
  }, []);

  return (
    <main className="captains-revelao photostrip-revelao min-h-screen overflow-hidden bg-white text-[#151515]">
      <PageSeo
        title="Photostrip para bodas y eventos | Fotomatón con QR | Revelao"
        description="Convierte cada móvil en un fotomatón. Tus invitados hacen cuatro fotos, reciben su tira y comparten un mural del evento sin descargar ninguna app."
        canonicalPath="/photostrip"
      />

      <header className="captains-navigation fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-white/95 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-10" aria-label="Navegación de Photostrip">
          <a href="/" className="flex shrink-0 items-center gap-3" aria-label="Ir a Revelao.cam">
            <img src={logo} alt="Revelao.cam" className="h-auto w-[124px] sm:w-[150px]" />
            <span className="hidden border-l border-border pl-3 text-sm font-semibold sm:inline">Photostrip</span>
          </a>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#momentos">Cuándo usarlo</a>
            <a href="#precios">Precios</a>
          </div>
          <div className="flex items-center gap-2">
            <a href={accessUrl} className="captains-top-link captains-top-link-demo hidden min-[420px]:inline-flex">Acceder</a>
            <a href={createUrl} className="captains-top-link captains-top-link-primary">Probar demo</a>
          </div>
        </nav>
      </header>

      <section className="photostrip-hero px-4 sm:px-6 lg:px-10" aria-labelledby="photostrip-title">
        <div className="photostrip-container mx-auto grid items-center gap-10 lg:grid-cols-[1fr_.82fr]">
          <div className="max-w-3xl">
            <p className="captains-kicker inline-flex">Nuevo · by Revelao</p>
            <h1 id="photostrip-title" className="captains-title mt-5">El fotomatón que cabe en un QR</h1>
            <p className="photostrip-lead mt-5 max-w-xl leading-relaxed text-muted-foreground">
              Cuatro fotos, una tira y un mural lleno de invitados. Sin cabina, sin app y sin complicaciones.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={createUrl} className="captains-button captains-button-primary">Crear demo gratis <ArrowRight className="h-4 w-4" /></a>
              <a href="#como-funciona" className="captains-button captains-button-secondary">Ver cómo funciona</a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Sin descargar app</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Desde cualquier móvil</span>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section className="photostrip-feature-strip bg-muted px-4 sm:px-6 lg:px-10">
        <div className="photostrip-container mx-auto grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[[Camera, "4 fotos automáticas"], [QrCode, "Acceso con un QR"], [Download, "Tira descargable"], [Images, "Galería compartida"]].map(([Icon, label]) => {
            const ItemIcon = Icon as typeof Camera;
            return <div key={label as string} className="photostrip-feature flex flex-col items-center justify-center gap-2.5 rounded-lg border border-border bg-white p-4 text-center"><ItemIcon className="h-5 w-5 text-primary" /><p className="text-sm font-semibold">{label as string}</p></div>;
          })}
        </div>
      </section>

      <section id="como-funciona" className="photostrip-section scroll-mt-20 bg-white px-4 sm:px-6 lg:px-10">
        <div className="photostrip-container mx-auto">
          <p className="captains-section-label">Así de fácil</p>
          <h2 className="captains-heading mt-3 max-w-3xl">Del QR a una tira inolvidable</h2>
          <div className="captains-how-carousel">
            {steps.map(([title, description], index) => (
              <article key={title} className="captains-panel photostrip-step bg-white">
                <span className="captains-how-card-number" aria-hidden="true">{index + 1}</span>
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-2.5 text-sm font-normal leading-6 text-[#151515]/68">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="momentos" className="photostrip-section scroll-mt-20 bg-muted px-4 sm:px-6 lg:px-10">
        <div className="photostrip-container mx-auto">
          <div className="max-w-3xl">
            <p className="captains-section-label">Un QR, muchos momentos</p>
            <h2 className="captains-heading mt-3">No esperes al baile para empezar las fotos</h2>
            <p className="photostrip-body mt-4 leading-7 text-muted-foreground">Usa el mismo QR antes, durante y después de la boda. Ponlo donde tus invitados ya están compartiendo el momento.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              [CalendarDays, "Antes de la boda", "Inclúyelo en la invitación digital, la web de la boda o el grupo de WhatsApp para romper el hielo."],
              [PartyPopper, "El día de la boda", "Repártelo por las mesas, la barra, el photocall o la pista de baile para multiplicar las tiras."],
              [Coffee, "El día después", "Vuelve a compartirlo durante el brunch o la resaca y revivid juntos la galería."],
            ].map(([Icon, title, description]) => {
              const MomentIcon = Icon as typeof CalendarDays;
              return <article key={title as string} className="captains-panel bg-white"><MomentIcon className="h-6 w-6 text-primary" /><h3 className="mt-5 text-xl font-semibold">{title as string}</h3><p className="mt-2.5 text-sm leading-6 text-muted-foreground">{description as string}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section className="photostrip-section bg-white px-4 sm:px-6 lg:px-10">
        <div className="photostrip-content-container mx-auto grid items-center gap-10 lg:grid-cols-[.78fr_1.15fr]">
          <div className="photostrip-mural relative mx-auto flex w-full items-center justify-center rounded-3xl bg-[#fff1ef] p-7">
            <StripPreview className="-rotate-6 -translate-y-4" />
            <StripPreview className="rotate-6 translate-y-6 -translate-x-3" />
          </div>
          <div>
            <p className="captains-section-label">El mural de la fiesta</p>
            <h2 className="captains-heading mt-3">Cada tira cuenta una historia distinta</h2>
            <p className="photostrip-body mt-4 max-w-xl leading-7 text-muted-foreground">Al terminar, la tira aparece en la galería común. Los invitados descubren las poses, las risas y los pequeños grupos que se han formado durante el evento.</p>
            <ul className="mt-7 space-y-4 text-base">
              {["Galería pública, para participantes o solo para ti", "Moderación y descargas desde tu panel", "Acabado en color o blanco y negro"].map((feature) => <li key={feature} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{feature}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section id="precios" className="photostrip-section scroll-mt-20 bg-muted px-4 sm:px-6 lg:px-10">
        <div className="photostrip-container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <p className="captains-section-label">Precios</p>
            <h2 className="captains-heading mt-3">Elige cuántas tiras quieres revelar</h2>
            <p className="photostrip-body mt-4 leading-7 text-muted-foreground">Pago único por evento. Cada invitado crea una tira completa de cuatro fotografías.</p>
          </div>
          <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.id} className={`relative flex h-full flex-col rounded-lg border bg-white p-6 ${plan.featured ? "border-primary/60 bg-red-50 shadow-[0_24px_60px_-28px_rgba(240,106,95,.45)]" : "border-border"}`}>
                {plan.featured ? <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">Más popular</span> : null}
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">Tu fotomatón digital para un evento</p>
                <div className="mt-4 flex items-end gap-2"><span className="text-3xl font-bold tracking-tight">{plan.price}</span><span className="pb-0.5 text-xs text-muted-foreground">por evento</span></div>
                <ul className="mt-7 flex-1 space-y-3 text-sm">
                  {[plan.strips, "Código QR de acceso", "Personalización", "Galería compartida", "Diseño y descarga de la tira"].map((feature) => <li key={feature} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{feature}</li>)}
                  <li className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0" />{plan.ideal}</li>
                </ul>
                <a href={plan.stripeUrl} className="captains-button captains-button-primary mt-8 w-full" aria-label={`Elegir ${plan.name} por ${plan.price}`}>Elegir plan <ArrowRight className="h-4 w-4" /></a>
              </article>
            ))}
          </div>
          <p className="mt-7 text-center text-sm text-muted-foreground">Pago seguro con Stripe · Recibirás por email el enlace para crear tu evento.</p>
        </div>
      </section>

      <section className="photostrip-section bg-white px-4 sm:px-6 lg:px-10">
        <div className="photostrip-content-container mx-auto">
          <p className="captains-section-label">Preguntas frecuentes</p>
          <h2 className="captains-heading mt-3">Lo esencial, sin letra pequeña</h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {faqs.map(([question, answer]) => <details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold"><span>{question}</span><span className="text-2xl font-normal text-primary transition-transform group-open:rotate-45">+</span></summary><p className="max-w-2xl pt-3 leading-6 text-muted-foreground">{answer}</p></details>)}
          </div>
        </div>
      </section>

      <section className="photostrip-section bg-primary px-4 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold text-white/75">La cámara está lista</p>
          <h2 className="captains-heading mt-3 text-white">Que empiecen las fotos</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-7 text-white/80">Crea una demo gratis con 3 tiras, descarga el QR y prueba el mural completo.</p>
          <a href={createUrl} className="captains-button mt-8 border-white bg-white text-foreground hover:bg-white/90">Crear Photostrip demo <ArrowRight className="h-4 w-4" /></a>
        </div>
      </section>

      <Footer text="Photostrip, el fotomatón digital de Revelao.cam para bodas y eventos." />
    </main>
  );
};

export default PhotostripLanding;
