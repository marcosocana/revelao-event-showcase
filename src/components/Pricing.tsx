import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
const guestOptions = [
  { value: "50", label: "Hasta 50", guests: 50, price: "25,9€", costPerGuest: "0,25€", canBook: true },
  { value: "300", label: "Hasta 300", guests: 300, price: "49,9€", costPerGuest: "0,16€", canBook: true },
  { value: "500", label: "Hasta 500", guests: 500, price: "65,9€", costPerGuest: "0,13€", canBook: true },
  { value: "1000", label: "Hasta 1000", guests: 1000, price: "109,9€", costPerGuest: "0,11€", canBook: true },
  { value: "1200", label: "Más de 1000", guests: 1200, price: "A consultar", costPerGuest: "Contactar", canBook: false }
];
const features = ["Fotos ilimitadas", "Galería privada 20 días", "Descarga en alta calidad", "Personalización de marca", "Soporte para dudas"];
const whatsappMessage = "Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?";
export const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState("50");
  const currentPlan = guestOptions.find(option => option.value === selectedPlan) || guestOptions[0];

  return <section className="py-24" id="precio">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Personaliza tu Revelao
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Selecciona el número de invitados y descubre tu precio personalizado
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <p className="text-center text-lg font-medium text-foreground mb-6">
            ¿Cuántos invitados van a asistir a tu evento?
          </p>
          <Tabs value={selectedPlan} onValueChange={setSelectedPlan} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8 h-auto">
              {guestOptions.map((option) => (
                <TabsTrigger 
                  key={option.value} 
                  value={option.value}
                  className="text-xs md:text-sm py-3 px-2"
                >
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="p-8 rounded-lg border border-border bg-card animate-fade-in">
              <div className="mb-8">
                <div>
                  <span className={`font-bold text-foreground ${currentPlan.canBook ? 'text-4xl' : 'text-2xl'}`}>
                    {currentPlan.price}
                  </span>
                  {currentPlan.canBook && <span className="text-muted-foreground">/evento</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {currentPlan.label}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {features.map((feature, index) => <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-foreground" />
                    <span className="text-foreground">{feature}</span>
                  </li>)}
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-foreground" />
                  <span className="text-foreground">
                    Coste por usuario: <span className="font-semibold">{currentPlan.costPerGuest}</span>
                  </span>
                </li>
              </ul>

              <Button className="w-full" variant="default" asChild>
                <a href={`https://wa.me/34695834018?text=${encodeURIComponent(whatsappMessage)}`}>
                  Contratar servicio    
                </a>
              </Button>
            </div>
          </Tabs>
        </div>
      </div>
    </section>;
};