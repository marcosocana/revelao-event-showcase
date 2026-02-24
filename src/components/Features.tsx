import { useEffect, useState, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import step1Image from "@/assets/step-1-qr.svg";
import step2Image from "@/assets/step-2-capture.svg";
import step3Image from "@/assets/step-3-anticipation.svg";
import step4Image from "@/assets/step-4-reveal.svg";
import { useI18n, translations } from "@/lib/i18n";

const featureImages = [step1Image, step2Image, step3Image, step4Image];

export const Features = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  const features = t.features.steps.map((step, index) => ({
    ...step,
    image: featureImages[index],
  }));
  const [api, setApi] = useState<CarouselApi>();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!api || !isVisible) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [api, isVisible]);

  return (
    <section ref={sectionRef} className="py-12 md:py-24 bg-muted/30" id="como-funciona">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            {t.features.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </div>

        <div className="revelao-card px-6 py-8 md:px-10 md:py-12">
          {/* Desktop Layout */}
          <div className="hidden md:grid grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center animate-fade-in" style={{
                animationDelay: `${index * 150}ms`
              }}>
                {/* Number */}
                <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background text-lg font-bold mb-3">
                  {index + 1}
                </div>

                {/* Image */}
                <div className="w-40 h-40 mb-4 flex items-center justify-center">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Text */}
                <h3 className="text-base font-bold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile Layout - Carousel */}
          <div className="md:hidden">
            <Carousel setApi={setApi} className="max-w-sm mx-auto" opts={{
              align: "start",
              loop: false
            }}>
              <CarouselContent>
                {features.map((feature, index) => (
                  <CarouselItem key={index}>
                    <div className="flex flex-col items-center text-center gap-4 p-4">
                      {/* Number */}
                      <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center text-background text-xl font-bold">
                        {index + 1}
                      </div>

                      {/* Image */}
                      <div className="w-40 h-40 flex items-center justify-center">
                        <img 
                          src={feature.image} 
                          alt={feature.title} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      {/* Text */}
                      <div>
                        <h3 className="text-lg font-bold mb-2 text-foreground">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 disabled:opacity-0 disabled:pointer-events-none" />
              <CarouselNext className="right-2 disabled:opacity-0 disabled:pointer-events-none" />
            </Carousel>
          </div>
        </div>

        <div id="video-demo" className="mt-8 md:mt-12 revelao-card bg-primary/5 px-6 py-8 md:px-10 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="revelao-card bg-black/95 ring-1 ring-primary/30">
              <div className="aspect-video w-full overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/_VakaDTWYJA"
                  title={t.features.videoLabel}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col items-center gap-3 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{t.features.videoTitle}</span>
              <span>{t.features.videoSubtitle}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
