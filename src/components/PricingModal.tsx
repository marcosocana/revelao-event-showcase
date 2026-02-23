import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useI18n, translations } from "@/lib/i18n";

const guestOptions = [
  {
    value: "50",
    label: "50",
    planId: "small",
    guests: 50,
    price: "36€",
    costPerGuest: "0,72€",
    stripeUrl: "https://buy.stripe.com/3cI5kw3Ud3ngeAn2vt3ks00"
  },
  {
    value: "300",
    label: "300",
    planId: "medium",
    guests: 300,
    price: "74€",
    costPerGuest: "0,25€",
    stripeUrl: "https://buy.stripe.com/9B67sEbmFcXQ1NB0nl3ks01"
  },
  {
    value: "500",
    label: "500",
    planId: "large",
    guests: 500,
    price: "96€",
    costPerGuest: "0,19€",
    stripeUrl: "https://buy.stripe.com/00wfZa4Yh1f863Rda73ks02"
  },
  {
    value: "1000",
    label: "1000",
    planId: "xxl",
    guests: 1000,
    price: "139€",
    costPerGuest: "0,14€",
    stripeUrl: "https://buy.stripe.com/3cI8wIaiBf5Ydwj9XV3ks03"
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

const whatsappMessage = "Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PricingModal = ({ open, onOpenChange }: PricingModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState("50");
  const currentPlan = guestOptions.find(option => option.value === selectedPlan) || guestOptions[0];
  const { lang } = useI18n();
  const t = translations[lang];
  const features = t.pricingModal.features;
  const stripeUrlByPlan: Record<string, string | undefined> = {
    small: import.meta.env.VITE_STRIPE_CHECKOUT_URL_SMALL,
    medium: import.meta.env.VITE_STRIPE_CHECKOUT_URL_MEDIUM,
    large: import.meta.env.VITE_STRIPE_CHECKOUT_URL_LARGE,
    xxl: import.meta.env.VITE_STRIPE_CHECKOUT_URL_XXL,
  };
  const resolvedStripeUrl = currentPlan.planId
    ? stripeUrlByPlan[currentPlan.planId] ?? currentPlan.stripeUrl
    : currentPlan.stripeUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl text-center">{t.pricingModal.title}</DialogTitle>
          <p className="text-base text-muted-foreground text-center mt-2">
            {t.pricingModal.subtitle}
          </p>
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
                  {currentPlan.value === "1000+"
                    ? t.pricingModal.moreGuests
                    : t.pricingModal.untilGuests.replace("{guests}", String(currentPlan.guests))}
                </span>
              </div>
              <div className="text-left md:text-right">
                <span className="font-bold text-foreground text-3xl md:text-4xl">
                  {currentPlan.price}
                </span>
                {resolvedStripeUrl && <span className="text-muted-foreground">{t.pricingModal.perEvent}</span>}
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
                  <span className="font-semibold">{currentPlan.costPerGuest} {t.pricingModal.perGuest}</span>
                </span>
              </li>
            </ul>

            {resolvedStripeUrl ? (
              <Button className="w-full" variant="default" asChild>
                <a href={resolvedStripeUrl} target="_blank" rel="noopener noreferrer">
                  {t.pricingModal.choose}
                </a>
              </Button>
            ) : (
              <Button className="w-full" variant="default" asChild>
                <a href={`https://wa.me/34695834018?text=${encodeURIComponent(whatsappMessage)}`}>
                  {t.pricingModal.contact}
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
