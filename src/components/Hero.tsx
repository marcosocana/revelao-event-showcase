import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import ruedaVideo from "@/assets/rueda.mp4";
import demoVideo from "@/assets/Revelao_2.mp4";
import { getAccessDemoUrl, useI18n, translations } from "@/lib/i18n";
import IphoneMockup3D from "@/components/IphoneMockup3D";

export const Hero = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { lang } = useI18n();
  const t = translations[lang];
  const accessDemoUrl = getAccessDemoUrl(lang);
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
      <div className="absolute inset-0 z-0 bg-white/95 backdrop-blur-sm" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left side - Content */}
          <div className="flex-1 text-center lg:text-left animate-fade-in">
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
                className="border-2 border-primary text-primary hover:bg-transparent hover:text-primary transition-none"
                onClick={() => setIsVideoOpen(true)}
              >
                Ver vídeo
              </Button>
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <a href={accessDemoUrl} target="_blank" rel="noopener noreferrer">
                  {t.hero.ctaFree}
                </a>
              </Button>
            </div>
          </div>

          {/* Right side - Video */}
          <div className="flex-shrink-0 w-full max-w-[180px] md:max-w-[260px] lg:max-w-[280px] mb-8 lg:mb-0">
            <IphoneMockup3D showIsland={false} showShadow shadowClassName="soft-tight">
              <video
                src="/phone-video.mp4?v=2"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </IphoneMockup3D>
          </div>
        </div>
      </div>
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl w-[92vw] p-4">
          <div className="aspect-[940/532] w-full overflow-hidden rounded-lg">
            <video
              src={demoVideo}
              preload="metadata"
              loop
              muted
              playsInline
              autoPlay
              controls
              className="revelao-video w-full h-full object-cover"
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
