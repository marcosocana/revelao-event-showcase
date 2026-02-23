import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { getAccessDemoUrl, useI18n, translations } from "@/lib/i18n";

export const FreeTrial = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  const accessDemoUrl = getAccessDemoUrl(lang);
  return (
    <div className="w-full bg-primary/10 px-6 py-6 md:px-8 md:py-8 text-center">
      <h2 className="text-xl md:text-3xl font-bold text-foreground mb-3">
        {t.freeTrial.title}
      </h2>

      <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-lg mx-auto">
        {t.freeTrial.subtitle}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
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
  );
};
