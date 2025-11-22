import { Button } from "@/components/ui/button";
import { Check, Users } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
const guestOptions = [{
  sliderValue: 0,
  label: "Hasta 50",
  guests: 50,
  price: "25,9€",
  costPerGuest: "0,25€",
  canBook: true
}, {
  sliderValue: 1,
  label: "Hasta 300",
  guests: 300,
  price: "49,9€",
  costPerGuest: "0,16€",
  canBook: true
}, {
  sliderValue: 2,
  label: "Hasta 500",
  guests: 500,
  price: "65,9€",
  costPerGuest: "0,13€",
  canBook: true
}, {
  sliderValue: 3,
  label: "Hasta 1000",
  guests: 1000,
  price: "109,9€",
  costPerGuest: "0,11€",
  canBook: true
}, {
  sliderValue: 4,
  label: "Más de 1000",
  guests: 1200,
  price: "A consultar",
  costPerGuest: "Contactar",
  canBook: false
}];
const sliderMarks = ["50", "300", "500", "1000", "1000+"];
const features = ["Fotos ilimitadas", "Galería privada 20 días", "Descarga en alta calidad", "Personalización de marca", "Soporte para dudas"];
const whatsappMessage = "Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?";
export const Pricing = () => {
  const [sliderValue, setSliderValue] = useState([0]);
  const currentPlan = guestOptions[sliderValue[0]];
  return <section className="py-24 bg-muted/30" id="precio">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
              ¿Cuántos invitados?
            </h2>
            
            <div className="space-y-8">
              <div className="px-4">
                <Slider value={sliderValue} onValueChange={setSliderValue} max={4} step={1} className="w-full" />
                <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                  {sliderMarks.map((mark, index) => <span key={index} className="text-xs md:text-sm">
                      {mark}
                    </span>)}
                </div>
              </div>

              <div className="border-t border-border pt-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-foreground" />
                    <span className="md:text-2xl font-semibold text-foreground text-base">
                      {currentPlan.label} invitados
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold text-foreground ${currentPlan.canBook ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
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
            </div>
          </div>
        </div>
      </div>
    </section>;
};