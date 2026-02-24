import weddingImg from "@/assets/testimonial-wedding.jpg";
import birthdayImg from "@/assets/testimonial-birthday.jpg";
import corporateImg from "@/assets/testimonial-corporate.jpg";
import extraImg1 from "@/assets/testimonial-extra-1.svg";
import extraImg2 from "@/assets/testimonial-extra-2.svg";
import extraImg3 from "@/assets/testimonial-extra-3.svg";
import { useEffect, useState, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { useI18n, translations } from "@/lib/i18n";

const baseImages = [weddingImg, birthdayImg, corporateImg];
const extraImages = [extraImg1, extraImg2, extraImg3];

export const SuccessStories = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  const stories = t.stories.items.map((item, index) => ({
    ...item,
    image: baseImages[index],
  }));
  const mobileStories = [
    ...stories,
    ...t.stories.itemsMobileExtra.map((item, index) => ({
      ...item,
      image: extraImages[index],
    })),
  ];
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
    <section ref={sectionRef} className="py-12 md:py-24 bg-background" id="casos-de-exito">
      <div className="container px-4 mx-auto container-mobile-right-edge">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            {t.stories.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.stories.subtitle}
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stories.map((story, index) => (
            <div
              key={index}
              className="revelao-card animate-fade-in"
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
            className="w-full" 
            opts={{
              align: "start",
              loop: false
            }}
          >
            <CarouselContent className="ml-0 gap-3">
              {mobileStories.map((story, index) => (
                <CarouselItem key={index} className="basis-[77%] pl-0">
                  <div className="revelao-card">
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
          </Carousel>
        </div>
      </div>
    </section>
  );
};
