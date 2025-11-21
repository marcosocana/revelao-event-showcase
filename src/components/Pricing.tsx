import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: "49€",
    description: "Perfecto para eventos pequeños",
    features: [
      "Hasta 50 invitados",
      "200 fotos máximo",
      "Galería durante 7 días",
      "Descarga en alta calidad",
      "Soporte por email",
    ],
    highlighted: false,
  },
  {
    name: "Premium",
    price: "99€",
    description: "Ideal para bodas y eventos grandes",
    features: [
      "Hasta 150 invitados",
      "500 fotos máximo",
      "Galería durante 30 días",
      "Descarga en alta calidad",
      "Código QR personalizado",
      "Soporte prioritario",
    ],
    highlighted: true,
  },
  {
    name: "Empresarial",
    price: "199€",
    description: "Para eventos corporativos",
    features: [
      "Invitados ilimitados",
      "Fotos ilimitadas",
      "Galería durante 90 días",
      "Descarga en alta calidad",
      "Branding personalizado",
      "Soporte 24/7",
      "Analíticas del evento",
    ],
    highlighted: false,
  },
];

const whatsappMessage = "Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?";

export const Pricing = () => {
  return (
    <section className="py-24 bg-background" id="precio">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Planes y precios
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Elige el plan perfecto para tu evento. Sin sorpresas, sin costes ocultos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-300 animate-fade-in ${
                plan.highlighted
                  ? "border-primary bg-gradient-to-b from-secondary/50 to-card shadow-glow scale-105"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-soft"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-accent text-accent-foreground text-sm font-semibold rounded-full shadow-soft">
                    Más popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-card-foreground">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">/evento</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlighted ? "hero" : "default"}
                className="w-full"
                size="lg"
                asChild
              >
                <a href={`https://wa.me/34695834018?text=${encodeURIComponent(whatsappMessage)}`}>
                  Contratar
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
