import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import { ArrowRight } from "lucide-react";
import step0Image from "@/assets/Group3535.png";
import step1Image from "@/assets/11.png";
import step2Image from "@/assets/how-step-captura.png";
import step3Image from "@/assets/how-step-esperando.png";
import step4Image from "@/assets/how-step-revelado.png";
import stepCreateNew from "@/assets/how-step-create-new.png";
import stepShareNew from "@/assets/how-step-share-new.png";
import stepUploadNew from "@/assets/how-step-upload-new.png";
import stepRevealNew from "@/assets/how-step-reveal-new.png";
import landingVideoSrc from "@/assets/RevelaoComprimido.mp4";
import landingVideoPoster from "@/assets/Revelao_4_poster.jpg";
import { getAccessDemoUrl, useI18n, translations } from "@/lib/i18n";
import { VideoDemo } from "@/components/VideoDemo";

const featureImages = [step0Image, step1Image, step2Image, step3Image, step4Image];

type FeatureStepOverride = {
  title: string;
  description: string;
};

type FeaturesProps = {
  id?: string;
  titleOverride?: string;
  stepsOverride?: FeatureStepOverride[];
  ctaOverride?: string;
  stepLabelOverride?: string;
  cardClassName?: string;
};

export const Features = ({
  id = "como-funciona",
  titleOverride,
  stepsOverride,
  ctaOverride,
  stepLabelOverride = "Paso",
  cardClassName,
}: FeaturesProps = {}) => {
  const { lang } = useI18n();
  const t = translations[lang];
  const accessDemoUrl = getAccessDemoUrl(lang);
  const swiperRef = useRef<import("swiper").Swiper | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const sourceSteps = stepsOverride ?? t.features.steps;
  const selectedImages = sourceSteps.length === 4
    ? [stepCreateNew, stepShareNew, stepUploadNew, stepRevealNew]
    : featureImages;
  const features = sourceSteps.map((step, index) => ({
    ...step,
    image: selectedImages[index % selectedImages.length],
  }));
  const templatesWord = lang === "en" ? "templates" : lang === "it" ? "modelli" : "plantillas";

  const renderDescription = (description: string, index: number) => {
    if (stepsOverride || index !== 1 || !description.includes(templatesWord)) return description;
    const [before, after] = description.split(templatesWord, 2);
    return (
      <>
        {before}
        <a href="/plantillas-qr" className="font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
          {templatesWord}
        </a>
        {after}
      </>
    );
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateViewport = () => setIsDesktop(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  return (
    <section className="overflow-hidden bg-transparent py-12 md:py-20" id={id}>
      <div className="container px-4 mx-auto">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="revelao-h2 text-foreground">{titleOverride ?? t.features.title}</h2>
        </div>

        <div className="mx-auto mt-8 max-w-6xl pb-5 md:mt-12 md:px-5 md:pb-8 md:pr-12">
          <div className="relative">
            {features.length - activeIndex > 3 ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hidden translate-x-12 translate-y-12 rounded-[8px] border border-foreground/10 bg-white/50 shadow-[0_12px_30px_rgba(28,28,28,0.04)] md:block"
              />
            ) : null}
            {features.length - activeIndex > 2 ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hidden translate-x-8 translate-y-8 rounded-[8px] border border-foreground/15 bg-white/65 shadow-[0_14px_35px_rgba(28,28,28,0.05)] md:block"
              />
            ) : null}
            {features.length - activeIndex > 1 ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hidden translate-x-4 translate-y-4 rounded-[8px] border border-foreground/20 bg-white/85 shadow-[0_16px_40px_rgba(28,28,28,0.07)] md:block"
              />
            ) : null}
            <Swiper
              key={isDesktop ? "features-desktop" : "features-mobile"}
              className="relative z-10 !overflow-visible [&_.swiper-wrapper]:items-stretch [&_.swiper-slide]:h-auto"
              modules={[Autoplay, EffectCreative, A11y]}
              effect={isDesktop ? "creative" : "slide"}
              creativeEffect={{
                limitProgress: 4,
                prev: {
                  translate: ["-108%", 0, -240],
                  opacity: 0,
                },
                next: {
                  translate: [18, 18, -90],
                  scale: 0.975,
                  opacity: 0,
                },
              }}
              slidesPerView={isDesktop ? 1 : 1.08}
              spaceBetween={isDesktop ? 0 : 12}
              speed={650}
              autoplay={{ delay: 9000, disableOnInteraction: false, stopOnLastSlide: true }}
              a11y={{ enabled: true }}
              watchSlidesProgress
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setActiveIndex(swiper.activeIndex);
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            >
              {features.map((feature, index) => {
                return (
                  <SwiperSlide key={`${feature.title}-${index}`}>
                    <article className={`revelao-card no-card-hover grid h-full items-stretch overflow-hidden border border-black/15 bg-white shadow-[0_22px_60px_rgba(28,28,28,0.12)] lg:min-h-[31rem] lg:grid-cols-[0.82fr_1.18fr] ${cardClassName ?? ""}`}>
                      <div className="order-2 flex flex-col justify-start p-6 md:p-10 lg:order-1 lg:p-12">
                        <h3 className="text-3xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-4xl">
                          <span className="text-primary">{index + 1}.</span>{" "}
                          {feature.title}
                        </h3>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                          {renderDescription(feature.description, index)}
                        </p>

                        {index === 0 ? (
                          <a href={accessDemoUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                            {ctaOverride ?? (lang === "en" ? "Create event" : lang === "it" ? "Crea evento" : "Crear evento")}
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </a>
                        ) : null}
                      </div>

                      <div className="relative order-1 flex h-[18rem] items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#fff_0%,#f4f4f4_100%)] p-6 md:h-[24rem] md:p-9 lg:order-2 lg:h-auto lg:min-h-[31rem] lg:p-10">
                        <img
                          src={feature.image}
                          alt=""
                          loading={index === 0 ? "eager" : "lazy"}
                          decoding="async"
                          className="block h-full w-full object-contain"
                        />
                      </div>
                    </article>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          <div className="mt-9 flex flex-col items-center gap-4 md:mt-20">
            <div className="flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={activeIndex === 0}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/25 bg-white text-foreground shadow-sm transition-all hover:border-primary hover:text-primary disabled:opacity-25 md:h-14 md:w-14"
                aria-label={lang === "en" ? "Previous step" : lang === "it" ? "Passaggio precedente" : "Paso anterior"}
              >
                <ArrowRight className="h-5 w-5 rotate-180" aria-hidden="true" />
              </button>
              <span className="min-w-[5.5rem] text-center text-lg font-semibold tracking-[0.12em] text-foreground md:text-xl">
                {String(activeIndex + 1).padStart(2, "0")} <span className="font-normal text-muted-foreground">/ {String(features.length).padStart(2, "0")}</span>
              </span>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={activeIndex === features.length - 1}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-25 md:h-14 md:w-14"
                aria-label={lang === "en" ? "Next step" : lang === "it" ? "Passaggio successivo" : "Siguiente paso"}
              >
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2" aria-label={lang === "en" ? "Select step" : lang === "it" ? "Seleziona passaggio" : "Seleccionar paso"}>
              {features.map((feature, index) => (
                <button
                  key={`feature-dot-${feature.title}-${index}`}
                  type="button"
                  onClick={() => swiperRef.current?.slideTo(index)}
                  className={`h-2.5 rounded-full transition-all ${activeIndex === index ? "w-7 bg-primary" : "w-2.5 bg-foreground/15 hover:bg-foreground/30"}`}
                  aria-label={`${stepLabelOverride} ${index + 1}: ${feature.title}`}
                  aria-current={activeIndex === index ? "step" : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FeaturesVideo = () => {
  return (
    <section id="video-demo" className="py-12 md:py-24 bg-transparent">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <VideoDemo src={landingVideoSrc} poster={landingVideoPoster} />
        </div>
      </div>
    </section>
  );
};
