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
    stripeUrl: "https://acceso.revelao.cam/nuevoeventodemo",
    cta: "Pruébalo gratis",
    subtitle: "Hasta 10 fotos",
  },
  {
    title: "Start",
    planId: "small",
    price: "39€",
    stripeUrl: "https://buy.stripe.com/3cI5kw3Ud3ngeAn2vt3ks00",
    cta: "Elegir",
    subtitle: "Hasta 200 fotos",
  },
  {
    title: "Plus",
    planId: "medium",
    price: "79€",
    stripeUrl: "https://buy.stripe.com/9B67sEbmFcXQ1NB0nl3ks01",
    cta: "Elegir",
    subtitle: "Hasta 1200 fotos",
    featured: true,
    badge: "Más popular",
  },
  {
    title: "Pro",
    planId: "xxl",
    price: "149€",
    stripeUrl: "https://buy.stripe.com/3cI8wIaiBf5Ydwj9XV3ks03",
    cta: "Elegir",
    subtitle: "Fotos ilimitadas",
  },
];

const whatsappMessage = "Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?";

const PlanCard = ({ plan, perEvent, features }: { plan: (typeof plans)[0] & { fallbackSubtitle: string }; perEvent: string; features: string[] }) => (
  <div
    className={[
      "relative revelao-card p-5 md:p-6",
      plan.badge ? "pt-9" : "",
      plan.featured ? "border-primary/40 bg-primary/5 shadow-[0_20px_60px_-30px_rgba(180,38,38,0.35)]" : "border-border",
    ].join(" ")}
  >
    {plan.badge ? (
      <span className="absolute right-4 top-4 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-3 py-1">
        {plan.badge}
      </span>
    ) : null}

    <div className="mb-5">
      <h3 className="text-xl font-semibold text-foreground mb-1">{plan.title}</h3>
      <p className="text-sm text-muted-foreground">
        {plan.subtitle ? plan.subtitle : plan.fallbackSubtitle}
      </p>
      <div className="flex items-end gap-2 mt-3">
        <span className="text-4xl font-bold text-foreground">{plan.price}</span>
        <span className="text-sm text-muted-foreground pb-1">{perEvent}</span>
      </div>
    </div>

    <ul className="space-y-2.5 mb-5">
      {features.map((feature) => (
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
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      asChild
    >
      <a href={plan.stripeUrl} target="_blank" rel="noopener noreferrer">
        {plan.cta}
      </a>
    </Button>
  </div>
);

export const Pricing = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  const accessDemoUrl = getAccessDemoUrl(lang);
  const stripeUrlByPlan: Record<string, string | undefined> = {
    small: import.meta.env.VITE_STRIPE_CHECKOUT_URL_SMALL,
    medium: import.meta.env.VITE_STRIPE_CHECKOUT_URL_MEDIUM,
    large: import.meta.env.VITE_STRIPE_CHECKOUT_URL_LARGE,
    xxl: import.meta.env.VITE_STRIPE_CHECKOUT_URL_XXL,
  };
  const featureMap: Record<string, Record<string, string[]>> = {
    es: {
      demo: [
        "Hasta 10 fotos",
        "Galería activa 10 días",
        "Sin descarga en alta calidad",
        "Personalización básica",
        "Código QR exclusivo",
        "Panel básico de gestión",
      ],
      small: [
        "Hasta 200 fotos",
        "Galería 20 días",
        "Descarga en alta calidad",
        "Personalización completa",
        "Acceso privado por enlace",
        "Código QR exclusivo",
        "Panel básico de gestión",
        "Ideal para celebraciones íntimas",
      ],
      medium: [
        "Hasta 1200 fotos",
        "Galería 60 días",
        "Descarga en alta calidad",
        "Personalización completa",
        "Soporte telefónico",
        "Código QR exclusivo",
        "Panel completo de gestión",
        "Ideal para bodas y eventos medianos",
      ],
      xxl: [
        "Fotos ilimitadas",
        "Galería 90 días",
        "Marca blanca personalizada (sin referencia a Revelao)",
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
        "Up to 10 photos",
        "Gallery active for 10 days",
        "No high‑quality downloads",
        "Basic customization",
        "Exclusive QR code",
        "Basic management panel",
      ],
      small: [
        "Up to 200 photos",
        "Gallery for 20 days",
        "High‑quality downloads",
        "Full customization",
        "Private access via link",
        "Exclusive QR code",
        "Basic management panel",
        "Ideal for intimate celebrations",
      ],
      medium: [
        "Up to 1200 photos",
        "Gallery for 60 days",
        "High‑quality downloads",
        "Full customization",
        "Phone support",
        "Exclusive QR code",
        "Full management panel",
        "Ideal for weddings and mid‑size events",
      ],
      xxl: [
        "Unlimited photos",
        "Gallery for 90 days",
        "Custom white‑label (no Revelao branding)",
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
        "Fino a 10 foto",
        "Galleria attiva 10 giorni",
        "Nessun download in alta qualità",
        "Personalizzazione base",
        "Codice QR esclusivo",
        "Pannello di gestione base",
      ],
      small: [
        "Fino a 200 foto",
        "Galleria 20 giorni",
        "Download in alta qualità",
        "Personalizzazione completa",
        "Accesso privato tramite link",
        "Codice QR esclusivo",
        "Pannello di gestione base",
        "Ideale per celebrazioni intime",
      ],
      medium: [
        "Fino a 1200 foto",
        "Galleria 60 giorni",
        "Download in alta qualità",
        "Personalizzazione completa",
        "Supporto telefonico",
        "Codice QR esclusivo",
        "Pannello di gestione completo",
        "Ideale per matrimoni ed eventi medi",
      ],
      xxl: [
        "Foto illimitate",
        "Galleria 90 giorni",
        "White label personalizzato (senza riferimenti a Revelao)",
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
  return <section className="py-10 md:py-16 bg-muted/30" id="precio">
      <div className="container px-4 mx-auto container-mobile-right-edge">
        <div className="text-center mb-8 md:mb-10 animate-fade-in">
          <h2 className="font-bold mb-2 text-foreground md:text-5xl text-center text-3xl">
            {t.pricing.title}
          </h2>
          <p className="text-base text-muted-foreground mb-6 text-center md:text-lg">
            {t.pricing.subtitle}
          </p>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {translatedPlans.map((plan, index) => (
            <div key={plan.title} style={{ animationDelay: `${index * 120}ms` }}>
              <PlanCard plan={plan} perEvent={t.pricing.perEvent} features={plan.features} />
            </div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <Carousel className="w-full" opts={{ align: "start" }}>
            <CarouselContent className="ml-0 gap-3">
              {translatedPlans.map((plan) => (
                <CarouselItem key={plan.title} className="basis-[77%] pl-0">
                  <PlanCard plan={plan} perEvent={t.pricing.perEvent} features={plan.features} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          {t.pricing.more}{" "}
          <a
            className="text-foreground font-semibold hover:underline"
            href={`https://wa.me/34695834018?text=${encodeURIComponent(whatsappMessage)}`}
          >
            {t.pricing.whatsapp}
          </a>
          .
        </div>
      </div>
    </section>;
};
