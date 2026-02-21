import { Button } from "@/components/ui/button";
import ruedaVideo from "@/assets/rueda.mp4";
import corazon from "@/assets/corazon.svg";
import { useI18n, translations } from "@/lib/i18n";

export const Hero = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  return (
    <section className="relative min-h-[80vh] px-4 overflow-hidden flex items-center" id="inicio">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover blur-sm" style={{
          filter: 'blur(4px)'
        }}>
          <source src={ruedaVideo} type="video/mp4" />
          {t.hero.videoFallback}
        </video>
      </div>
      <div className="absolute inset-0 z-0 bg-white/85" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left side - Content */}
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center justify-center lg:justify-start w-20 h-20 md:w-32 md:h-32 mb-6">
              <img src={corazon} alt="Revelao.cam" className="w-16 h-16 md:w-28 md:h-28 shadow-none" />
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-black">
              {t.hero.title}{" "}
              <span className="text-primary">{t.hero.titleHighlight}</span>
            </h1>
            
            <p className="text-base md:text-lg text-black/90 mb-6 max-w-xl mx-auto lg:mx-0">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-black/80 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                <span>{t.hero.bulletAnon}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-black" />
                <span>{t.hero.bulletNoApps}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-primary text-primary hover:bg-primary/10" 
                asChild
              >
                <a href="https://wa.me/34695834018?text=Hola! Estoy interesado en contratar Revelao.cam. ¿Puedes darme más información?">
                  {t.hero.ctaTalk}
                </a>
              </Button>
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <a href="https://acceso.revelao.cam/nuevoeventodemo" target="_blank" rel="noopener noreferrer">
                  {t.hero.ctaFree}
                </a>
              </Button>
            </div>
          </div>

          {/* Right side - Video */}
          <div className="flex-shrink-0 w-full max-w-[280px] md:max-w-[320px] lg:max-w-[350px] mb-8 lg:mb-0">
            <video 
              src="/phone-video.mp4?v=2" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-auto rounded-[20px] object-cover shadow-2xl border border-muted-foreground/20" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};
