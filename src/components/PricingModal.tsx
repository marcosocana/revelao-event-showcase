import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { getAccessDemoUrl, useI18n, translations } from "@/lib/i18n";

const planOptions = [
  {
    value: "demo",
    planId: "demo",
    price: "0€",
    stripeUrl: "https://acceso.revelao.cam/nuevoeventodemo",
  },
  {
    value: "small",
    planId: "small",
    price: "39€",
    stripeUrl: "https://buy.stripe.com/dRmdR2fCVbTMgIv0nl3ks06",
  },
  {
    value: "medium",
    planId: "medium",
    price: "79€",
    stripeUrl: "https://buy.stripe.com/00w9AM3UdaPIfEr4DB3ks05",
  },
  {
    value: "xxl",
    planId: "xxl",
    price: "149€",
    stripeUrl: "https://buy.stripe.com/7sY3co8at3ngfErc633ks04",
  },
];

const whatsappMessage = "Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PricingModal = ({ open, onOpenChange }: PricingModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState("demo");
  const currentPlan = planOptions.find(option => option.value === selectedPlan) || planOptions[0];
  const { lang } = useI18n();
  const t = translations[lang];
  const accessDemoUrl = getAccessDemoUrl(lang);
  const translatedPlans = planOptions.map((plan, index) => ({
    ...plan,
    label: t.pricing.plans[index]?.title ?? plan.planId,
    subtitle: t.pricing.plans[index]?.subtitle ?? "",
    cta: t.pricing.plans[index]?.cta ?? t.pricingModal.choose,
  }));
  const featureMap: Record<string, Record<string, string[]>> = {
    es: {
      demo: [
        "10 fotos · 3 vídeos · 6 audios",
        "Galería activa 10 días",
        "Sin descarga en alta calidad",
        "Personalización básica",
        "Código QR exclusivo",
        "Panel básico de gestión",
      ],
      small: [
        "200 fotos · 30 vídeos · 60 audios",
        "Galería 20 días",
        "Descarga en alta calidad",
        "Personalización completa",
        "Acceso privado por enlace",
        "Código QR exclusivo",
        "Panel básico de gestión",
        "Ideal para celebraciones íntimas",
      ],
      medium: [
        "1200 fotos · 90 vídeos · 200 audios",
        "Galería 60 días",
        "Descarga en alta calidad",
        "Personalización completa",
        "Acceso privado por enlace",
        "Soporte telefónico",
        "Código QR exclusivo",
        "Panel completo de gestión",
        "Ideal para bodas y eventos medianos",
      ],
      xxl: [
        "Fotos, vídeos y audios ilimitados",
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
        "10 photos · 3 videos · 6 audios",
        "Gallery active for 10 days",
        "No high‑quality downloads",
        "Basic customization",
        "Exclusive QR code",
        "Basic management panel",
      ],
      small: [
        "200 photos · 30 videos · 60 audios",
        "Gallery for 20 days",
        "High‑quality downloads",
        "Full customization",
        "Private access via link",
        "Exclusive QR code",
        "Basic management panel",
        "Ideal for intimate celebrations",
      ],
      medium: [
        "1200 photos · 90 videos · 200 audios",
        "Gallery for 60 days",
        "High‑quality downloads",
        "Full customization",
        "Private access via link",
        "Phone support",
        "Exclusive QR code",
        "Full management panel",
        "Ideal for weddings and mid‑size events",
      ],
      xxl: [
        "Unlimited photos, videos and audios",
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
        "10 foto · 3 video · 6 audio",
        "Galleria attiva 10 giorni",
        "Nessun download in alta qualità",
        "Personalizzazione base",
        "Codice QR esclusivo",
        "Pannello di gestione base",
      ],
      small: [
        "200 foto · 30 video · 60 audio",
        "Galleria 20 giorni",
        "Download in alta qualità",
        "Personalizzazione completa",
        "Accesso privato tramite link",
        "Codice QR esclusivo",
        "Pannello di gestione base",
        "Ideale per celebrazioni intime",
      ],
      medium: [
        "1200 foto · 90 video · 200 audio",
        "Galleria 60 giorni",
        "Download in alta qualità",
        "Personalizzazione completa",
        "Accesso privato tramite link",
        "Supporto telefonico",
        "Codice QR esclusivo",
        "Pannello di gestione completo",
        "Ideale per matrimoni ed eventi medi",
      ],
      xxl: [
        "Foto, video e audio illimitati",
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
  const stripeUrlByPlan: Record<string, string | undefined> = {
    small: import.meta.env.VITE_STRIPE_CHECKOUT_URL_SMALL,
    medium: import.meta.env.VITE_STRIPE_CHECKOUT_URL_MEDIUM,
    large: import.meta.env.VITE_STRIPE_CHECKOUT_URL_LARGE,
    xxl: import.meta.env.VITE_STRIPE_CHECKOUT_URL_XXL,
  };
  const resolvedStripeUrl = currentPlan.planId
    ? stripeUrlByPlan[currentPlan.planId] ?? (currentPlan.planId === "demo" ? accessDemoUrl : currentPlan.stripeUrl)
    : currentPlan.stripeUrl;
  const currentFeatures = featureMap[lang]?.[currentPlan.planId] ?? featureMap.es[currentPlan.planId];
  const currentLabel = translatedPlans.find((plan) => plan.planId === currentPlan.planId)?.label ?? currentPlan.planId;
  const currentSubtitle = translatedPlans.find((plan) => plan.planId === currentPlan.planId)?.subtitle ?? "";
  const currentCta = translatedPlans.find((plan) => plan.planId === currentPlan.planId)?.cta ?? t.pricingModal.choose;
  const normalizedSubtitle = currentSubtitle.trim().toLowerCase();
  const visibleFeatures = currentFeatures.filter((feature) => feature.trim().toLowerCase() !== normalizedSubtitle);

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
            <TabsList className="w-full grid grid-cols-4 h-auto p-1">
              {translatedPlans.map(option => (
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
              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-semibold text-foreground">{currentLabel}</h3>
                {currentSubtitle ? (
                  <p className="text-sm md:text-base text-muted-foreground">{currentSubtitle}</p>
                ) : null}
              </div>
              <div className="text-left md:text-right">
                <span className="font-bold text-foreground text-3xl md:text-4xl">
                  {currentPlan.price}
                </span>
                {resolvedStripeUrl && <span className="text-muted-foreground">{t.pricingModal.perEvent}</span>}
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {visibleFeatures.map((feature, index) => {
                const normalized = feature.toLowerCase();
                const isIdeal =
                  normalized.startsWith("ideal para") ||
                  normalized.startsWith("ideal for") ||
                  normalized.startsWith("ideale per");
                const Icon = isIdeal ? Star : Check;
                return (
                  <li key={index} className="flex items-start gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5 text-foreground" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                );
              })}
            </ul>

            {resolvedStripeUrl ? (
              <Button className="w-full rounded-full" variant="default" asChild>
                <a href={resolvedStripeUrl} target="_blank" rel="noopener noreferrer">
                  {currentCta}
                </a>
              </Button>
            ) : (
              <Button className="w-full rounded-full" variant="default" asChild>
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
