import { useEffect, useMemo, useRef, useState } from "react";
import step1Image from "@/assets/step-1-qr.svg";
import step2Image from "@/assets/step-2-capture.svg";
import step3Image from "@/assets/step-3-anticipation.svg";
import step4Image from "@/assets/step-4-reveal.svg";
import demoVideo from "@/assets/Revelao_31.mp4";
import { useI18n, translations } from "@/lib/i18n";
import { VideoDemo } from "@/components/VideoDemo";

const featureImages = [step1Image, step2Image, step3Image, step4Image];

type MediaType = "image" | "video" | "locked" | "reveal";

type StepConfig = {
  id: string;
  title: string;
  desc: string;
  mediaType: MediaType;
  src?: string;
  alt?: string;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const MockupMedia = ({
  steps,
  activeIndex,
  height,
}: {
  steps: StepConfig[];
  activeIndex: number;
  height?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === currentIndex) return;
    setPrevIndex(currentIndex);
    setCurrentIndex(activeIndex);
  }, [activeIndex, currentIndex]);

  useEffect(() => {
    if (prevIndex === null) return;
    const timeout = setTimeout(() => setPrevIndex(null), prefersReducedMotion() ? 0 : 400);
    return () => clearTimeout(timeout);
  }, [prevIndex]);

  const renderMedia = (step: StepConfig, key: string, isActive: boolean) => {
    const commonClasses = `absolute inset-0 transition-opacity duration-300 ${
      isActive ? "opacity-100" : "opacity-0"
    }`;

    if (step.mediaType === "video" && step.src) {
      return (
        <div key={key} className={commonClasses}>
          <video
            src={step.src}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </div>
      );
    }

    if (step.mediaType === "locked") {
      return (
        <div key={key} className={`${commonClasses} flex items-center justify-center bg-black/80`}>
          <div className="text-center text-white/90">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/30">
              <span className="text-lg">🔒</span>
            </div>
            <p className="text-sm font-semibold">Se revela mañana</p>
            <p className="text-xs text-white/70">Contenido oculto hasta el evento</p>
          </div>
        </div>
      );
    }

    if (step.mediaType === "reveal" && step.src) {
      return (
        <div key={key} className={commonClasses}>
          <div className="relative h-full w-full">
            <img
              src={step.src}
              alt={step.alt ?? step.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="reveal-blur absolute inset-0" />
          </div>
        </div>
      );
    }

    return (
      <div key={key} className={commonClasses}>
        <img
          src={step.src}
          alt={step.alt ?? step.title}
          className="h-full w-full object-cover"
          loading={step.id === "step-1" ? "eager" : "lazy"}
        />
      </div>
    );
  };

  return (
    <div className="relative mx-auto w-full max-w-[360px] md:max-w-[420px]">
      <div
        className="relative overflow-hidden rounded-[36px] border border-border/60 bg-black/90 shadow-xl"
        style={height ? { height } : undefined}
      >
        <div className={`relative w-full ${height ? "h-full" : "aspect-[9/19]"}`}>
          {prevIndex !== null &&
            renderMedia(steps[prevIndex], `prev-${prevIndex}`, false)}
          {renderMedia(steps[currentIndex], `cur-${currentIndex}`, true)}
        </div>
      </div>
    </div>
  );
};

export const Features = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  const steps: StepConfig[] = useMemo(
    () => [
      {
        id: "step-1",
        title: t.features.steps[0]?.title,
        desc: t.features.steps[0]?.description,
        mediaType: "image",
        src: featureImages[0],
        alt: "Escanea el QR",
      },
      {
        id: "step-2",
        title: t.features.steps[1]?.title,
        desc: t.features.steps[1]?.description,
        mediaType: "image",
        src: featureImages[1],
        alt: "Sube tus fotos",
      },
      {
        id: "step-3",
        title: t.features.steps[2]?.title,
        desc: t.features.steps[2]?.description,
        mediaType: "locked",
      },
      {
        id: "step-4",
        title: t.features.steps[3]?.title,
        desc: t.features.steps[3]?.description,
        mediaType: "reveal",
        src: featureImages[3],
        alt: "Revelado",
      },
    ],
    [t]
  );

  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepsListRef = useRef<HTMLDivElement>(null);
  const [mockupHeight, setMockupHeight] = useState<number | undefined>(undefined);
  const [activeStep, setActiveStep] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(
    () => steps.map((_, index) => index === 0)
  );

  useEffect(() => {
    const nodes = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const index = Number(visible[0].target.getAttribute("data-step-index") || 0);
          setActiveStep(index);
          setVisibleSteps((prev) => {
            if (prev[index]) return prev;
            const next = [...prev];
            next[index] = true;
            return next;
          });
        }
      },
      { threshold: [0.55, 0.7] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (!stepsListRef.current) return;
      const rect = stepsListRef.current.getBoundingClientRect();
      setMockupHeight(rect.height);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <section className="py-12 md:py-24 bg-muted/30" id="como-funciona">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            {t.features.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </div>

        <div className="steps-layout grid gap-10 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] md:items-start">
          <div className="md:order-1">
            <div className="steps-mockup sticky top-[120px]">
              <MockupMedia steps={steps} activeIndex={activeStep} height={mockupHeight} />
            </div>
          </div>

          <div className="steps-list space-y-4 md:order-0" ref={stepsListRef}>
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <div
                  key={step.id}
                  ref={(el) => (stepRefs.current[index] = el)}
                  data-step-index={index}
                  aria-current={isActive ? "step" : undefined}
                  className={`revelao-card step-card p-5 md:p-6 transition-all ${
                    isActive ? "border-primary/50 shadow-md bg-background" : "bg-background/70"
                  } ${step.mediaType === "locked" ? "ring-1 ring-primary/30" : ""}`}
                  data-visible={visibleSteps[index] ? "true" : "false"}
                >
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-semibold text-foreground">
                      <span className="mr-2">{index + 1}.</span>
                      {step.title}
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
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
    <section id="video-demo" className="py-12 md:py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="revelao-card bg-primary/5 px-6 py-8 md:px-10 md:py-12">
          <div className="max-w-4xl mx-auto">
            <VideoDemo src={demoVideo} />
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
