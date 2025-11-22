import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const getPricing = (guests: number) => {
  if (guests <= 300) {
    return {
      price: "49,9€",
      costPerGuest: "0,16€",
      canBook: true,
    };
  } else if (guests <= 500) {
    return {
      price: "65,9€",
      costPerGuest: "0,13€",
      canBook: true,
    };
  } else if (guests <= 1000) {
    return {
      price: "109,9€",
      costPerGuest: "0,11€",
      canBook: true,
    };
  } else {
    return {
      price: "Consultar precio",
      costPerGuest: "A consultar",
      canBook: false,
    };
  }
};

const features = [
  "Fotos ilimitadas",
  "Galería privada 20 días",
  "Descarga en alta calidad",
  "Personalización de marca",
  "Soporte para dudas",
];

const whatsappMessage = "Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?";

export const Pricing = () => {
  const [guests, setGuests] = useState([300]);
  const pricing = getPricing(guests[0]);

  return (
    <section className="py-24" id="precio">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Personaliza tu Revelao
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ajusta el número de invitados y descubre tu precio personalizado
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="p-8 rounded-lg border border-border bg-card animate-fade-in">
            <div className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-4">
                Número de invitados: <span className="text-primary font-bold">{guests[0]}</span>
              </label>
              <Slider
                value={guests}
                onValueChange={setGuests}
                min={50}
                max={1200}
                step={50}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>50</span>
                <span>1200+</span>
              </div>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-bold text-foreground">
                {pricing.price}
              </span>
              {pricing.canBook && <span className="text-muted-foreground">/evento</span>}
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-foreground" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-foreground" />
                <span className="text-foreground">
                  Coste por usuario: <span className="font-semibold">{pricing.costPerGuest}</span>
                </span>
              </li>
            </ul>

            <Button className="w-full" variant="default" asChild>
              <a href={`https://wa.me/34695834018?text=${encodeURIComponent(whatsappMessage)}`}>
                Contratar
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
