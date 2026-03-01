import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import step1Image from "@/assets/11.png";
import step2Image from "@/assets/22.png";
import step3Image from "@/assets/33.png";
import step4Image from "@/assets/44.png";
import { useI18n, translations } from "@/lib/i18n";
import demoVideo from "@/assets/Revelao_4.mp4";
import demoPoster from "@/assets/Revelao_4_poster.jpg";
import { VideoDemo } from "@/components/VideoDemo";

const featureImages = [step1Image, step2Image, step3Image, step4Image];

export const Features = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  const sectionRef = useRef<HTMLElement | null>(null);
  const swiperRef = useRef<import("swiper").Swiper | null>(null);
  const features = t.features.steps.map((step, index) => ({
    ...step,
    image: featureImages[index],
  }));

  useEffect(() => {
    featureImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const swiper = swiperRef.current;
        if (!swiper) return;
        if (entry.isIntersecting) {
          swiper.slideToLoop(0, 0);
          swiper.autoplay?.start();
        } else {
          swiper.autoplay?.stop();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-24 bg-transparent" id="como-funciona">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-8 md:mb-10 animate-fade-in">
          <h2 className="revelao-h2 mb-2 text-center">
            {t.features.title}
          </h2>
          <p className="revelao-h3 mb-2 text-center max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </div>

        <div className="revelao-card no-card-hover overflow-visible px-4 py-6 md:px-12 md:py-12 bg-[radial-gradient(circle_at_20%_10%,rgba(239,68,68,0.28),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(239,68,68,0.18),transparent_60%),linear-gradient(135deg,#f5f5f5,#ffffff)]">
          <div className="relative">
            <Swiper
              className="features-swiper"
              modules={[Autoplay, EffectFade, Navigation, Pagination, A11y]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              slidesPerView={1}
              loop
              autoplay={{ delay: 14000, disableOnInteraction: false }}
              navigation={{ nextEl: ".features-next", prevEl: ".features-prev" }}
              pagination={{ el: ".features-pagination", clickable: true, bulletClass: "slider_bullet", bulletActiveClass: "is-active" }}
              a11y={{ enabled: true }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
            >
              {features.map((feature, index) => (
                <SwiperSlide key={feature.title}>
                  <div className="features-slide grid min-h-[52vh] grid-cols-1 gap-6 md:min-h-[60vh] md:gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center">
                    <div className="flex flex-col gap-4 md:gap-6 items-start text-left">
                      <div className="text-sm font-semibold text-neutral-500 uppercase tracking-[0.2em]">
                        Paso {index + 1}
                      </div>
                      <h3
                        className="text-[2rem] md:text-[4.125rem] font-semibold tracking-tight leading-[1.05] text-transparent bg-clip-text"
                        style={{
                          backgroundImage:
                            "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 100%)",
                        }}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-sm md:text-lg leading-relaxed text-neutral-600 max-w-xl">
                        {feature.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="h-[20rem] w-[20rem] md:h-[40rem] md:w-[40rem] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="module-slider_nav mt-6">
              <div className="flex items-center justify-between">
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    data-slider="previous"
                    className="features-prev circle-btn"
                    aria-label="Previous slide"
                  >
                    <div className="button-icon-wrap">
                      <div className="accordion-line-wrap">
                        <div className="accordion-icon_line cc-horizontal cc-accordion-card" />
                        <div className="accordion-icon_line cc-vertical cc-accordion-card" />
                      </div>
                      <div className="button-icon cc-arrow-left">←</div>
                    </div>
                  </button>
                </div>
                <div className="flex-shrink-0">
                  <div className="features-pagination slider_pagination swiper-pagination-bullets" />
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    data-slider="next"
                    className="features-next circle-btn"
                    aria-label="Next slide"
                  >
                    <div className="button-icon-wrap">
                      <div className="accordion-line-wrap">
                        <div className="accordion-icon_line cc-horizontal cc-accordion-card" />
                        <div className="accordion-icon_line cc-vertical cc-accordion-card" />
                      </div>
                      <div className="button-icon cc-arrow-right">→</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FeaturesVideo = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  return (
    <section id="video-demo" className="py-12 md:py-24 bg-transparent">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex flex-col items-center gap-3 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{t.features.videoTitle}</span>
            <span>{t.features.videoSubtitle}</span>
          </div>
          <VideoDemo src={demoVideo} poster={demoPoster} />
        </div>
      </div>
    </section>
  );
};
