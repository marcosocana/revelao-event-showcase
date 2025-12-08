import { useEffect, useState, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import step1Image from "@/assets/step-1-qr.svg";
import step2Image from "@/assets/step-2-capture.svg";
import step3Image from "@/assets/step-3-anticipation.svg";
import step4Image from "@/assets/step-4-reveal.svg";

const features = [{
  title: "Escanea el código QR",
  description: "Tus invitados escanean el código QR que encontrarán en carteles, tarjetas, etc...",
  image: step4Image
}, {
  title: "Captura los mejores momentos",
  description: "Todos los invitados pueden tomar fotos durante el evento de forma anónima",
  image: step1Image
}, {
  title: "La expectación aumenta...",
  description: "Las fotos permanecen ocultas durante el evento, creando misterio y emoción",
  image: step2Image
}, {
  title: "Día de revelado",
  description: "Al día siguiente, todas las fotos se revelan en una galería privada para revivir los mejores momentos y que todos puedan volver a revivir el evento",
  image: step3Image
}];

export const Features = () => {
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
    <section ref={sectionRef} className="py-12 md:py-24 bg-secondary/50" id="como-funciona">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Cómo funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Explora la experiencia Revelao en solo 4 pasos:</p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center animate-fade-in" style={{
              animationDelay: `${index * 150}ms`
            }}>
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
            loop: true
          }}>
            <CarouselContent>
              {features.map((feature, index) => (
                <CarouselItem key={index}>
                  <div className="flex flex-col items-center text-center gap-4 p-4">
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
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
