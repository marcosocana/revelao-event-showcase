import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const baseFeatures = [
  "Fotos ilimitadas",
  "Galería privada 20 días",
  "Descarga en alta calidad",
  "Personalización de marca",
  "Soporte para dudas",
];

const plans = [
  {
    title: "Demo",
    guests: 10,
    price: "0€",
    costPerGuest: "0€",
    stripeUrl: "https://acceso.revelao.cam/nuevoeventodemo",
    cta: "Pruébalo gratis",
    subtitle: "Solo 10 fotos",
  },
  {
    title: "Pequeño",
    guests: 50,
    price: "36€",
    costPerGuest: "0,72€",
    stripeUrl: "https://buy.stripe.com/cNiaEY0i9gnpbi4dL60Fi03",
    cta: "Elegir",
  },
  {
    title: "Mediano",
    guests: 300,
    price: "74€",
    costPerGuest: "0,25€",
    stripeUrl: "https://buy.stripe.com/14A5kE9SJgnpeuggXi0Fi02",
    cta: "Elegir",
    featured: true,
    badge: "Más popular",
  },
  {
    title: "Grande",
    guests: 500,
    price: "96€",
    costPerGuest: "0,19€",
    stripeUrl: "https://buy.stripe.com/dRm8wQ4yp5IL85S7mI0Fi04",
    cta: "Elegir",
  },
  {
    title: "XL",
    guests: 1000,
    price: "139€",
    costPerGuest: "0,14€",
    stripeUrl: "https://buy.stripe.com/fZu28sd4VefhgCo5eA0Fi05",
    cta: "Elegir",
  },
];

const whatsappMessage = "Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?";

const PlanCard = ({ plan }: { plan: (typeof plans)[0] }) => (
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
        {plan.subtitle ? plan.subtitle : `Hasta ${plan.guests} invitados`}
      </p>
      <div className="flex items-end gap-2 mt-3">
        <span className="text-4xl font-bold text-foreground">{plan.price}</span>
        <span className="text-sm text-muted-foreground pb-1">/evento</span>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        {plan.costPerGuest} por invitado
      </p>
    </div>

    <ul className="space-y-2.5 mb-5">
      {baseFeatures.map((feature) => (
        <li key={feature} className="flex items-start gap-3">
          <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
          <span className="text-sm text-foreground">{feature}</span>
        </li>
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
  return <section className="py-10 md:py-16 bg-muted/30" id="precio">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-8 md:mb-10 animate-fade-in">
          <h2 className="font-bold mb-2 text-foreground md:text-5xl text-center text-3xl">
            Precio
          </h2>
          <p className="text-base text-muted-foreground mb-6 text-center md:text-lg">
            Elige el plan ideal según el tamaño de tu evento
          </p>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div key={plan.title} style={{ animationDelay: `${index * 120}ms` }}>
              <PlanCard plan={plan} />
            </div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <Carousel className="w-full" opts={{ align: "start" }}>
            <CarouselContent>
              {plans.map((plan) => (
                <CarouselItem key={plan.title} className="basis-[85%] pr-4">
                  <PlanCard plan={plan} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          ¿Más de 1000 invitados?{" "}
          <a
            className="text-foreground font-semibold hover:underline"
            href={`https://wa.me/34695834018?text=${encodeURIComponent(whatsappMessage)}`}
          >
            Escríbenos por WhatsApp
          </a>
          .
        </div>
      </div>
    </section>;
};
