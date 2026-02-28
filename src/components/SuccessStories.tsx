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

        {/* Auto Marquee - Same layout on all breakpoints */}
        <div>
          <div className="overflow-hidden w-full">
            <div className="marquee-row">
              <div className="marquee-track">
                {mobileStories.map((story, index) => {
                  return (
                    <div
                      key={`${story.event}-${index}`}
                      className="marquee-card w-[320px] sm:w-[420px] md:w-[520px]"
                    >
                      <div className="marquee-image">
                        <img
                          src={story.image}
                          alt={story.event}
                          className="h-48 w-full object-cover sm:h-52 md:h-56"
                        />
                      </div>
                      <div className="marquee-content">
                        <p className="marquee-quote">“{story.quote}”</p>
                        <p className="marquee-meta">{story.author}</p>
                        <p className="marquee-meta">{story.event}</p>
                      </div>
                    </div>
                  );
                })}
                {mobileStories.map((story, index) => {
                  return (
                    <div
                      key={`dup-${story.event}-${index}`}
                      className="marquee-card w-[320px] sm:w-[420px] md:w-[520px]"
                    >
                      <div className="marquee-image">
                        <img
                          src={story.image}
                          alt={story.event}
                          className="h-48 w-full object-cover sm:h-52 md:h-56"
                        />
                      </div>
                      <div className="marquee-content">
                        <p className="marquee-quote">“{story.quote}”</p>
                        <p className="marquee-meta">{story.author}</p>
                        <p className="marquee-meta">{story.event}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
