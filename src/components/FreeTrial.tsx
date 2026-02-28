import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { getAccessDemoUrl, useI18n, translations } from "@/lib/i18n";
import bodaQr from "@/assets/boda-qr.png";

export const FreeTrial = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  const accessDemoUrl = getAccessDemoUrl(lang);
  return (
    <div className="w-full bg-transparent px-6 py-6 md:px-8 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
            {t.freeTrial.title}
          </h2>

          <p className="text-xs md:text-sm text-muted-foreground mb-6 max-w-lg md:max-w-none">
            {t.freeTrial.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start items-center">
            <Button
              size="default"
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 text-sm px-6 py-4"
              asChild
            >
              <a href={accessDemoUrl} target="_blank" rel="noopener noreferrer">
                <Sparkles className="w-4 h-4 mr-2" />
                {t.freeTrial.cta}
              </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            {t.freeTrial.badges}
          </p>
        </div>
        <div className="w-full md:w-[320px] lg:w-[360px] mx-auto">
          <img
            src={bodaQr}
            alt="Revelao QR"
            className="w-full h-auto rounded-2xl border border-border object-cover"
          />
        </div>
      </div>
    </div>
  );
};
