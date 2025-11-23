import weddingImg from "@/assets/testimonial-wedding.jpg";
import birthdayImg from "@/assets/testimonial-birthday.jpg";
import corporateImg from "@/assets/testimonial-corporate.jpg";
import { useEffect, useState, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

const stories = [
  {
    event: "Boda de Laura y Carlos",
    quote: "Las fotos anónimas crearon un ambiente mágico. Al día siguiente todos estábamos pegados al móvil esperando la revelación.",
    author: "Laura M.",
    image: weddingImg,
  },
  {
    event: "Cumpleaños de 30",
    quote: "Mis amigos se volvieron locos subiendo fotos. No saber qué había capturado cada uno hizo la espera insoportable (en el buen sentido).",
    author: "Diego R.",
    image: birthdayImg,
  },
  {
    event: "Cena de empresa",
    quote: "Usamos Revelao.cam en nuestro evento corporativo. El nivel de participación fue increíble, todo el equipo involucrado.",
    author: "Ana S., HR Manager",
    image: corporateImg,
  },
];

export const SuccessStories = () => {
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
    <section ref={sectionRef} className="py-12 md:py-24 bg-secondary/50" id="casos-de-exito">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Eventos que crearon expectación y capturaron momentos únicos
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stories.map((story, index) => (
            <div
              key={index}
              className="bg-card rounded-lg border border-border overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.event}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-8">
                <div className="mb-4">
                  <p className="text-foreground leading-relaxed mb-4">
                    {story.quote}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-foreground">{story.author}</p>
                  <p className="text-sm text-muted-foreground">{story.event}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Layout - Carousel */}
        <div className="md:hidden">
          <Carousel 
            setApi={setApi} 
            className="max-w-sm mx-auto" 
            opts={{
              align: "start",
              loop: true
            }}
          >
            <CarouselContent>
              {stories.map((story, index) => (
                <CarouselItem key={index}>
                  <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={story.image} 
                        alt={story.event}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="p-8">
                      <div className="mb-4">
                        <p className="text-foreground leading-relaxed mb-4">
                          {story.quote}
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <p className="font-semibold text-foreground">{story.author}</p>
                        <p className="text-sm text-muted-foreground">{story.event}</p>
                      </div>
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
