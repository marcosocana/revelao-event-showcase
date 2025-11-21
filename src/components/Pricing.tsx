import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: "29€",
    description: "Perfecto para eventos pequeños",
    features: [
      "Hasta 50 invitados",
      "Fotos ilimitadas",
      "Galería privada 30 días",
      "Descarga en alta calidad",
      "Soporte por email",
    ],
  },
  {
    name: "Premium",
    price: "59€",
    description: "Ideal para bodas y eventos grandes",
    features: [
      "Hasta 200 invitados",
      "Fotos ilimitadas",
      "Galería privada 90 días",
      "Descarga en alta calidad",
      "Personalización de marca",
      "Soporte prioritario",
    ],
    highlighted: true,
  },
  {
    name: "Corporativo",
    price: "A medida",
    description: "Para eventos empresariales",
    features: [
      "Invitados ilimitados",
      "Fotos ilimitadas",
      "Galería privada ilimitada",
      "Descarga en alta calidad",
      "Marca personalizada",
      "Integración con tu evento",
      "Account manager dedicado",
    ],
  },
];

const whatsappMessage = "Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?";

export const Pricing = () => {
  return (
    <section className="py-24" id="precio">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Elige tu plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Planes simples y transparentes para cada tipo de evento
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-8 rounded-lg border animate-fade-in ${
                plan.highlighted
                  ? "border-foreground bg-foreground text-background shadow-medium"
                  : "border-border bg-card"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? "text-background" : "text-foreground"}`}>
                {plan.name}
              </h3>
              <p className={`mb-6 ${plan.highlighted ? "text-background/70" : "text-muted-foreground"}`}>
                {plan.description}
              </p>
              
              <div className="mb-8">
                <span className={`text-4xl font-bold ${plan.highlighted ? "text-background" : "text-foreground"}`}>
                  {plan.price}
                </span>
                {plan.price !== "A medida" && <span className={plan.highlighted ? "text-background/70" : "text-muted-foreground"}>/evento</span>}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? "text-background" : "text-foreground"}`} />
                    <span className={plan.highlighted ? "text-background" : "text-foreground"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.highlighted ? "outline" : "default"}
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
