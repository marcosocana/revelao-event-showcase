import { Button } from "@/components/ui/button";
import { Check, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
const guestOptions = [{
  value: "50",
  label: "50",
  guests: 50,
  price: "36€",
  costPerGuest: "0,72€",
  canBook: true,
  stripeUrl: "https://buy.stripe.com/cNiaEY0i9gnpbi4dL60Fi03"
}, {
  value: "300",
  label: "300",
  guests: 300,
  price: "74€",
  costPerGuest: "0,25€",
  canBook: true,
  stripeUrl: "https://buy.stripe.com/14A5kE9SJgnpeuggXi0Fi02"
}, {
  value: "500",
  label: "500",
  guests: 500,
  price: "96€",
  costPerGuest: "0,19€",
  canBook: true,
  stripeUrl: "https://buy.stripe.com/dRm8wQ4yp5IL85S7mI0Fi04"
}, {
  value: "1000",
  label: "1000",
  guests: 1000,
  price: "139€",
  costPerGuest: "0,14€",
  canBook: true,
  stripeUrl: "https://buy.stripe.com/fZu28sd4VefhgCo5eA0Fi05"
}, {
  value: "1000+",
  label: "1000+",
  guests: 1200,
  price: "A consultar",
  costPerGuest: "Contactar",
  canBook: false,
  stripeUrl: null
}];
const features = ["Fotos ilimitadas", "Galería privada 20 días", "Descarga en alta calidad", "Personalización de marca", "Soporte para dudas"];
const whatsappMessage = "Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?";
export const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState("50");
  const currentPlan = guestOptions.find(option => option.value === selectedPlan) || guestOptions[0];
  return <section className="py-12 md:py-24 bg-muted/30" id="precio">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <h2 className="font-bold mb-2 text-foreground md:text-5xl text-center text-3xl">
              Precio
            </h2>
            <p className="text-base text-muted-foreground mb-8 text-center md:text-xl">
              ¿Cuántos invitados tiene tu evento?
            </p>
            
            <div className="space-y-8">
              <Tabs value={selectedPlan} onValueChange={setSelectedPlan} className="w-full">
                <TabsList className="w-full grid grid-cols-5 h-auto p-1">
                  {guestOptions.map(option => <TabsTrigger key={option.value} value={option.value} className="text-xs md:text-sm py-2 px-1 md:px-3">
                      {option.label}
                    </TabsTrigger>)}
                </TabsList>
              </Tabs>

              <div className="border-t border-border pt-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-foreground" />
                    <span className="text-base md:text-2xl font-semibold text-foreground">
                      {currentPlan.value === "1000+" ? "Más de 1000 invitados" : `Hasta ${currentPlan.guests} invitados`}
                    </span>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="font-bold text-foreground text-3xl md:text-4xl">
                      {currentPlan.price}
                    </span>
                    {currentPlan.canBook && <span className="text-muted-foreground">/evento</span>}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {features.map((feature, index) => <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-foreground" />
                      <span className="text-foreground">{feature}</span>
                    </li>)}
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-foreground" />
                    <span className="text-foreground">
                      <span className="font-semibold">{currentPlan.costPerGuest} por invitado</span>
                    </span>
                  </li>
                </ul>

                {currentPlan.stripeUrl ? (
                  <Button className="w-full" variant="default" asChild>
                    <a href={currentPlan.stripeUrl} target="_blank" rel="noopener noreferrer">
                      Comenzar
                    </a>
                  </Button>
                ) : (
                  <Button className="w-full" variant="default" asChild>
                    <a href={`https://wa.me/34695834018?text=${encodeURIComponent(whatsappMessage)}`}>
                      Contactar
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};