import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getAccessDemoUrl, useI18n, translations } from "@/lib/i18n";

const plans = [
  {
    title: "Demo",
    planId: "demo",
    price: "0€",
    stripeUrl: "https://acceso.revelao.cam/nuevoeventodemo2",
    cta: "Pruébalo gratis",
    subtitle: "10 fotos · 3 vídeos · 6 audios",
  },
  {
    title: "Start",
    planId: "small",
    price: "39€",
    stripeUrl: "https://buy.stripe.com/dRmdR2fCVbTMgIv0nl3ks06",
    cta: "Elegir",
    subtitle: "200 fotos · 30 vídeos · 60 audios",
  },
  {
    title: "Plus",
    planId: "medium",
    price: "79€",
    stripeUrl: "https://buy.stripe.com/00w9AM3UdaPIfEr4DB3ks05",
    cta: "Elegir",
    subtitle: "5.000 fotos · 200 vídeos · 500 audios",
    featured: true,
    badge: "Más popular",
  },
  {
    title: "Pro",
    planId: "xxl",
    price: "149€",
    stripeUrl: "https://buy.stripe.com/7sY3co8at3ngfErc633ks04",
    cta: "Elegir",
    subtitle: "Fotos, vídeos y audios ilimitados",
  },
];

const whatsappMessage = "Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?";

const PlanCard = ({ plan, perEvent, features }: { plan: { title: string; planId: string; price: string; stripeUrl: string; cta: string; subtitle: string; featured?: boolean; badge?: string; fallbackSubtitle: string }; perEvent: string; features: string[] }) => {
  const subtitleText = (plan.subtitle || plan.fallbackSubtitle || "").trim().toLowerCase();
  const visibleFeatures = features.filter((feature) => feature.trim().toLowerCase() !== subtitleText);

  return (
    <div
      className={[
        "relative revelao-card p-5 md:p-6 transition-opacity hover:opacity-90",
        plan.badge ? "pt-9" : "",
        plan.featured ? "revelao-card--featured border border-red-400 bg-red-50" : "border-border",
      ].join(" ")}
    >
    {plan.badge ? (
      <span className="absolute right-4 top-4 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-3 py-1">
        {plan.badge}
      </span>
    ) : null}

    <div className="mb-5">
      <h3 className="revelao-h4 mb-1">{plan.title}</h3>
      <p className="text-sm text-muted-foreground">
        {plan.subtitle ? plan.subtitle : plan.fallbackSubtitle}
      </p>
      <div className="flex items-end gap-2 mt-3">
        <span className="text-4xl font-bold text-foreground">{plan.price}</span>
        <span className="text-sm text-muted-foreground pb-1">{perEvent}</span>
      </div>
    </div>

    <ul className="space-y-2.5 mb-5">
      {visibleFeatures.map((feature) => (
        (() => {
          const isIdeal =
            feature.toLowerCase().startsWith("ideal para") ||
            feature.toLowerCase().startsWith("ideal for") ||
            feature.toLowerCase().startsWith("ideale per");
          const Icon = isIdeal ? Star : Check;
          const iconClass = isIdeal ? "text-foreground" : "text-primary";
          return (
        <li key={feature} className="flex items-start gap-3">
          <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconClass}`} />
          <span className="text-sm text-foreground">{feature}</span>
        </li>
          );
        })()
      ))}
    </ul>

    <Button
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
      asChild
    >
      <a href={plan.stripeUrl} target="_blank" rel="noopener noreferrer">
        {plan.cta}
      </a>
    </Button>
  </div>
  );
};

export const Pricing = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  const accessDemoUrl = getAccessDemoUrl(lang);
  const stripeUrlByPlan: Record<string, string | undefined> = {
    small: import.meta.env.VITE_STRIPE_CHECKOUT_URL_SMALL ?? "https://buy.stripe.com/dRmdR2fCVbTMgIv0nl3ks06",
    medium: import.meta.env.VITE_STRIPE_CHECKOUT_URL_MEDIUM ?? "https://buy.stripe.com/00w9AM3UdaPIfEr4DB3ks05",
    large: import.meta.env.VITE_STRIPE_CHECKOUT_URL_LARGE,
    xxl: import.meta.env.VITE_STRIPE_CHECKOUT_URL_XXL ?? "https://buy.stripe.com/7sY3co8at3ngfErc633ks04",
  };
  const featureMap: Record<string, Record<string, string[]>> = {
    es: {
      demo: [
        "10 fotos · 3 vídeos · 6 audios",
        "Galería activa 10 días",
        "Sin descarga en alta calidad",
        "Personalización básica",
        "Código QR exclusivo",
        "Panel básico de gestión",
      ],
      small: [
        "200 fotos · 30 vídeos · 60 audios",
        "Galería 20 días",
        "TV Slideshow en directo (Ver fotos en vivo)",
        "Plantillas QR",
        "Descarga en alta calidad",
        "Personalización completa",
        "Acceso privado por enlace",
        "Código QR exclusivo",
        "Panel básico de gestión",
        "Ideal para celebraciones íntimas",
      ],
      medium: [
        "5.000 fotos · 200 vídeos · 500 audios",
        "Galería online 100 días",
        "TV Slideshow en directo (Ver fotos en vivo)",
        "Plantillas QR",
        "Descarga en alta calidad",
        "Personalización completa",
        "Posibilidad de subir fotos y vídeos desde la galería del móvil",
        "Acceso privado por enlace",
        "Soporte telefónico",
        "Código QR exclusivo",
        "Panel completo de gestión",
        "Ideal para bodas y eventos medianos",
      ],
      xxl: [
        "Fotos, vídeos y audios ilimitados",
        "Galería 90 días",
        "TV Slideshow en directo (Ver fotos en vivo)",
        "Plantillas QR",
        "Marca blanca personalizada (sin referencia a Revelao)",
        "Posibilidad de subir fotos y vídeos desde la galería del móvil",
        "Descarga en alta calidad",
        "Soporte telefónico durante el evento",
        "Backup 1 año",
        "Código QR exclusivo",
        "Panel avanzado de analítica y gestión",
        "Ideal para grandes celebraciones",
      ],
    },
    en: {
      demo: [
        "10 photos · 3 videos · 6 audios",
        "Gallery active for 10 days",
        "No high‑quality downloads",
        "Basic customization",
        "Exclusive QR code",
        "Basic management panel",
      ],
      small: [
        "200 photos · 30 videos · 60 audios",
        "Gallery for 20 days",
        "Live TV slideshow (View photos live)",
        "QR templates",
        "High‑quality downloads",
        "Full customization",
        "Private access via link",
        "Exclusive QR code",
        "Basic management panel",
        "Ideal for intimate celebrations",
      ],
      medium: [
        "5,000 photos · 200 videos · 500 audios",
        "Online gallery for 100 days",
        "Live TV slideshow (View photos live)",
        "QR templates",
        "High‑quality downloads",
        "Full customization",
        "Option to upload photos and videos from your phone gallery",
        "Private access via link",
        "Phone support",
        "Exclusive QR code",
        "Full management panel",
        "Ideal for weddings and mid‑size events",
      ],
      xxl: [
        "Unlimited photos, videos and audios",
        "Gallery for 90 days",
        "Live TV slideshow (View photos live)",
        "QR templates",
        "Custom white‑label (no Revelao branding)",
        "Option to upload photos and videos from your phone gallery",
        "High‑quality downloads",
        "Phone support during the event",
        "1‑year backup",
        "Exclusive QR code",
        "Advanced analytics & management panel",
        "Ideal for large celebrations",
      ],
    },
    it: {
      demo: [
        "10 foto · 3 video · 6 audio",
        "Galleria attiva 10 giorni",
        "Nessun download in alta qualità",
        "Personalizzazione base",
        "Codice QR esclusivo",
        "Pannello di gestione base",
      ],
      small: [
        "200 foto · 30 video · 60 audio",
        "Galleria 20 giorni",
        "Slideshow TV in diretta (Guarda le foto dal vivo)",
        "Modelli QR",
        "Download in alta qualità",
        "Personalizzazione completa",
        "Accesso privato tramite link",
        "Codice QR esclusivo",
        "Pannello di gestione base",
        "Ideale per celebrazioni intime",
      ],
      medium: [
        "5.000 foto · 200 video · 500 audio",
        "Galleria online 100 giorni",
        "Slideshow TV in diretta (Guarda le foto dal vivo)",
        "Modelli QR",
        "Download in alta qualità",
        "Personalizzazione completa",
        "Possibilità di caricare foto e video dalla galleria del telefono",
        "Accesso privato tramite link",
        "Supporto telefonico",
        "Codice QR esclusivo",
        "Pannello di gestione completo",
        "Ideale per matrimoni ed eventi medi",
      ],
      xxl: [
        "Foto, video e audio illimitati",
        "Galleria 90 giorni",
        "Slideshow TV in diretta (Guarda le foto dal vivo)",
        "Modelli QR",
        "White label personalizzato (senza riferimenti a Revelao)",
        "Possibilità di caricare foto e video dalla galleria del telefono",
        "Download in alta qualità",
        "Supporto telefonico durante l’evento",
        "Backup 1 anno",
        "Codice QR esclusivo",
        "Pannello avanzato di analisi e gestione",
        "Ideale per grandi celebrazioni",
      ],
    },
  };

  const translatedPlans = plans.map((plan, index) => ({
    ...plan,
    stripeUrl: plan.planId === "demo" ? accessDemoUrl : stripeUrlByPlan[plan.planId] ?? plan.stripeUrl,
    title: t.pricing.plans[index]?.title ?? plan.title,
    cta: t.pricing.plans[index]?.cta ?? plan.cta,
    subtitle: t.pricing.plans[index]?.subtitle ?? plan.subtitle,
    badge: t.pricing.plans[index]?.badge ?? plan.badge,
    fallbackSubtitle: plan.subtitle ?? "",
    features: featureMap[lang]?.[plan.planId] ?? featureMap.es[plan.planId],
  }));
  const visiblePlans = translatedPlans.filter((plan) => plan.planId !== "demo");
  return <section className="py-10 md:py-16 bg-transparent scroll-mt-12 md:scroll-mt-14 no-card-hover" id="precio">
      <div className="container px-4 mx-auto container-mobile-right-edge">
        <div className="text-center mb-8 md:mb-10 animate-fade-in">
          <h2 className="revelao-h2 mb-2 text-center">
            {t.pricing.title}
          </h2>
          <p className="revelao-h3 mx-auto max-w-4xl text-center">
            {t.pricing.subtitle}.{" "}
            {lang === "en"
              ? "Buy it today and have everything ready for the day of your event. If none of the plans fit, "
              : lang === "it"
                ? "Acquistalo oggi e prepara tutto per il giorno del tuo evento. Se nessun piano fa al caso tuo, "
                : "Cómpralo hoy y déjalo todo preparado para el gran día. Si no te encaja ninguno, "}
            <a
              className="text-foreground font-semibold hover:underline"
              href={`https://wa.me/34695834018?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {lang === "en" ? "write to us" : lang === "it" ? "scrivici" : "escríbenos"}
            </a>
            .
          </p>
        </div>

        {/* Desktop grid */}
        <div className="mx-auto hidden max-w-5xl grid-cols-3 gap-4 md:grid md:gap-6">
          {visiblePlans.map((plan, index) => (
            <div key={plan.title} style={{ animationDelay: `${index * 120}ms` }}>
              <PlanCard plan={plan} perEvent={t.pricing.perEvent} features={plan.features} />
            </div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <Carousel className="w-full" opts={{ align: "start" }}>
            <CarouselContent className="ml-0 gap-3">
              {visiblePlans.map((plan) => (
                <CarouselItem key={plan.title} className="basis-[77%] pl-0">
                  <PlanCard plan={plan} perEvent={t.pricing.perEvent} features={plan.features} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

      </div>
    </section>;
};
