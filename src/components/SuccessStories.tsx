import testimonial1 from "@/assets/testimonio4-1.png";
import testimonial2 from "@/assets/testimonio2-2.png";
import testimonial3 from "@/assets/testimonio3-2.png";
import testimonial4 from "@/assets/testimonio-6.png";
import puebloQr from "@/assets/puebloqr.png";
import nocheQr from "@/assets/nocheqr.png";
import { useEffect, useRef, useState } from "react";
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
  const marqueeStories = mobileStories.filter(Boolean);
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

        <div className="success-marquee">
          <div className="animate-marquee-right flex w-max items-stretch">
            {[0, 1].map((loopIndex) => (
              <div key={loopIndex} className="flex shrink-0 items-stretch gap-6 pr-6">
                {marqueeStories.map((story, index) => (
                  <div
                    key={`${story.event}-${loopIndex}-${index}`}
                    className="success-card group flex w-[416px] shrink-0 gap-4 overflow-hidden rounded-lg bg-neutral-100 p-5 sm:w-[420px] lg:w-[520px]"
                  >
                    <div className="flex-1 overflow-hidden rounded-lg">
                      <img
                        src={story.image}
                        alt={story.event}
                        className="h-40 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 sm:h-44 lg:h-48"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between text-center">
                      <p className="text-base leading-[21px] tracking-[-0.01em] text-neutral-900">
                        “{story.quote}”
                      </p>
                      <p className="text-sm text-neutral-600">{story.author}</p>
                      <p className="text-sm text-neutral-600">{story.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
