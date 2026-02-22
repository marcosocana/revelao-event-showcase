import { Button } from "@/components/ui/button";
import { getAdminLoginUrl, useI18n, translations } from "@/lib/i18n";
export const CombinedCTABanner = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  const adminLoginUrl = getAdminLoginUrl(lang);
  return <section className="py-8 md:py-16 bg-primary/5">
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 gap-4 md:gap-0 max-w-6xl mx-auto">
          {/* Left side - Contact/Questions CTA */}
          <div className="revelao-card text-center md:text-left bg-primary p-8 md:p-12 md:rounded-r-none md:rounded-l-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              {t.cta.leftTitle}
            </h3>
            <p className="text-lg text-white/90 mb-8">{t.cta.leftText}</p>
            <Button size="lg" className="bg-white text-foreground hover:bg-white/90" asChild>
              <a href="https://wa.me/34695834018?text=Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?">
                {t.cta.leftButton}
              </a>
            </Button>
          </div>

          {/* Right side - Access CTA */}
          <div className="revelao-card text-center md:text-left bg-muted p-8 md:p-12 md:rounded-l-none md:rounded-r-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              {t.cta.rightTitle}
            </h3>
            <p className="text-lg text-foreground mb-8">
              {t.cta.rightText}
            </p>
            <Button size="lg" asChild className="bg-foreground text-background hover:bg-foreground/90">
              <a href={adminLoginUrl} target="_blank" rel="noopener noreferrer">
                {t.cta.rightButton}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
