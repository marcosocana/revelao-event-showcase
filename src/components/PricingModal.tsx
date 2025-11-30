import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const guestOptions = [
  {
    value: "50",
    label: "50",
    guests: 50,
    price: "25,9€",
    costPerGuest: "0,25€",
    stripeUrl: "https://buy.stripe.com/dRmcN6e8ZfjlfykcH20Fi01"
  },
  {
    value: "300",
    label: "300",
    guests: 300,
    price: "49,9€",
    costPerGuest: "0,16€",
    stripeUrl: "https://buy.stripe.com/dRmcN6e8ZfjlfykcH20Fi01"
  },
  {
    value: "500",
    label: "500",
    guests: 500,
    price: "65,9€",
    costPerGuest: "0,13€",
    stripeUrl: "https://buy.stripe.com/dRmcN6e8ZfjlfykcH20Fi01"
  },
  {
    value: "1000",
    label: "1000",
    guests: 1000,
    price: "109,9€",
    costPerGuest: "0,11€",
    stripeUrl: "https://buy.stripe.com/dRmcN6e8ZfjlfykcH20Fi01"
  },
  {
    value: "1000+",
    label: "1000+",
    guests: 1200,
    price: "A consultar",
    costPerGuest: "Contactar",
    stripeUrl: null
  }
];

const features = [
  "Fotos ilimitadas",
  "Galería privada 20 días",
  "Descarga en alta calidad",
  "Personalización de marca",
  "Soporte para dudas"
];

const whatsappMessage = "Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PricingModal = ({ open, onOpenChange }: PricingModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState("50");
  const currentPlan = guestOptions.find(option => option.value === selectedPlan) || guestOptions[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl text-center">Elige tu plan</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8 mt-4">
          <Tabs value={selectedPlan} onValueChange={setSelectedPlan} className="w-full">
            <TabsList className="w-full grid grid-cols-5 h-auto p-1">
              {guestOptions.map(option => (
                <TabsTrigger 
                  key={option.value} 
                  value={option.value} 
                  className="text-xs md:text-sm py-2 px-1 md:px-3"
                >
                  {option.label}
                </TabsTrigger>
              ))}
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
                {currentPlan.stripeUrl && <span className="text-muted-foreground">/evento</span>}
              </div>
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
                  Coste por usuario: <span className="font-semibold">{currentPlan.costPerGuest}</span>
                </span>
              </li>
            </ul>

            {currentPlan.stripeUrl ? (
              <Button className="w-full" variant="default" asChild>
                <a href={currentPlan.stripeUrl} target="_blank" rel="noopener noreferrer">
                  Elegir plan
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
      </DialogContent>
    </Dialog>
  );
};