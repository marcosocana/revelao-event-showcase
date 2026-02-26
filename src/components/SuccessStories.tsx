import testimonial1 from "@/assets/testimonio4-1.png";
import testimonial2 from "@/assets/testimonio2-2.png";
import testimonial3 from "@/assets/testimonio3-2.png";
import testimonial4 from "@/assets/testimonio-6.png";
import puebloQr from "@/assets/puebloqr.png";
import nocheQr from "@/assets/nocheqr.png";
import { useEffect, useRef, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useI18n, translations } from "@/lib/i18n";

const baseImages = [testimonial4, testimonial2, testimonial1];
const extraImages = [puebloQr, testimonial3, nocheQr];

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
    if (!isVisible) return;
  }, [isVisible]);

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

        {/* Desktop Layout - Two Rows */}
        <div className="hidden md:block no-card-hover">
          <div className="flex flex-col gap-6 max-w-6xl mx-auto">
            <div className="flex gap-6">
              {mobileStories.slice(0, 3).map((story, index) => {
                const isLarge = index === 0;
                return (
                  <div
                    key={index}
                    className={`revelao-card flex-1 ${isLarge ? "basis-[52%]" : "basis-[24%]"}`}
                  >
                    <div className="relative h-[280px] overflow-hidden">
                      <img
                        src={story.image}
                        alt={story.event}
                        className="w-full h-full object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/10" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-white text-sm leading-relaxed">
                          “{story.quote}”
                        </p>
                        <div className="mt-2 text-white/85">
                          <p className="font-semibold text-sm">{story.author}</p>
                          <p className="text-xs">{story.event}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-6">
              {mobileStories.slice(3, 6).map((story, index) => {
                const isLarge = index === 2;
                return (
                  <div
                    key={index}
                    className={`revelao-card flex-1 ${isLarge ? "basis-[52%]" : "basis-[24%]"}`}
                  >
                    <div className="relative h-[280px] overflow-hidden">
                      <img
                        src={story.image}
                        alt={story.event}
                        className="w-full h-full object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/10" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-white text-sm leading-relaxed">
                          “{story.quote}”
                        </p>
                        <div className="mt-2 text-white/85">
                          <p className="font-semibold text-sm">{story.author}</p>
                          <p className="text-xs">{story.event}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Layout - Carousel */}
        <div className="md:hidden no-card-hover">
          <Carousel className="w-full" opts={{ align: "start", loop: false }}>
            <CarouselContent className="ml-0 gap-3">
              {mobileStories.map((story, index) => (
                <CarouselItem key={index} className="basis-[78%] pl-0">
                  <div className="revelao-card">
                    <div className="relative h-[280px] overflow-hidden">
                      <img 
                        src={story.image} 
                        alt={story.event}
                        className="w-full h-full object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/10" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-white text-sm leading-relaxed">
                          “{story.quote}”
                        </p>
                        <div className="mt-2 text-white/85">
                          <p className="font-semibold text-sm">{story.author}</p>
                          <p className="text-xs">{story.event}</p>
                        </div>
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
