import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features, FeaturesVideo } from "@/components/Features";
import { EventGalleryFlow } from "@/components/EventGalleryFlow";
import { Pricing } from "@/components/Pricing";
import { KpiStrip } from "@/components/KpiStrip";
import { WhyRevelaoSection } from "@/components/WhyRevelaoSection";
import { Templates } from "@/components/Templates";
import { FAQs } from "@/components/FAQs";
import { SuccessStories } from "@/components/SuccessStories";
import { FreeTrial } from "@/components/FreeTrial";
import { Footer } from "@/components/Footer";
import { PricingModal } from "@/components/PricingModal";
import { BlogSection } from "@/components/BlogSection";
import { HomeSeoContent } from "@/components/HomeSeoContent";
import IphoneMockup3D from "@/components/IphoneMockup3D";
import { TrialReminder } from "@/components/TrialReminder";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { SimpleCTA } from "@/components/SimpleCTA";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useI18n, translations } from "@/lib/i18n";
import qrExampleInProgress from "@/assets/encurso.png";
import qrExampleFinished from "@/assets/terminado.png";

const Index = () => {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const { lang, setLang } = useI18n();

  useEffect(() => {
    const handleOpenModal = () => setIsPricingModalOpen(true);
    window.addEventListener('openPricingModal', handleOpenModal);
    return () => window.removeEventListener('openPricingModal', handleOpenModal);
  }, []);

  const exampleCards = [
    {
      title: "Evento en curso",
      description: "Mira cómo se ve y funciona un evento mientras sigue activo.",
      url: "https://acceso.revelao.cam/events/KrErAopl",
      qrSrc: qrExampleInProgress,
    },
    {
      title: "Evento terminado",
      description: "Descubre cómo queda la galería una vez finaliza el evento.",
      url: "https://acceso.revelao.cam/events/O8igAtwS",
      qrSrc: qrExampleFinished,
    },
  ];

  const openExample = (url: string) => {
    if (typeof window === "undefined") return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) {
      const width = 430;
      const height = 860;
      const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
      const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);
      const features = `popup=yes,width=${width},height=${height},left=${Math.round(left)},top=${Math.round(top)},resizable=yes,scrollbars=yes`;
      const popup = window.open("", "revelao-mobile-preview", features);
      if (popup) {
        popup.location.href = url;
        popup.focus();
        return;
      }
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const saved = localStorage.getItem("revelao-lang");
    if (saved) return;
    const browserLang = (navigator.language || navigator.languages?.[0] || "es").toLowerCase();
    if (browserLang.startsWith("en")) {
      setLang("en");
      return;
    }
    if (browserLang.startsWith("it")) {
      setLang("it");
      return;
    }
    setLang("es");
  }, [setLang]);

  useEffect(() => {
    const meta = translations[lang].seoHomeMeta;
    const canonicalUrl = "https://revelao.cam/";
    document.title = meta.title;

    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const setProperty = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta("description", meta.description);
    setMeta("keywords", meta.keywords);
    setProperty("og:title", meta.title);
    setProperty("og:description", meta.description);
    setProperty("og:url", canonicalUrl);
    setProperty("og:type", "website");
    setProperty("og:image", "https://www.revelao.cam/og-image.jpg");

    let canonical = document.querySelector(`link[rel="canonical"]`);
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Revelao.cam",
      url: "https://revelao.cam/",
      logo: "https://revelao.cam/favicon.png",
    };
    let ld = document.getElementById("ld-org");
    if (!ld) {
      ld = document.createElement("script");
      ld.setAttribute("type", "application/ld+json");
      ld.setAttribute("id", "ld-org");
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify(orgSchema);
  }, [lang]);

  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll(".reveal-on-scroll"));
    if (!("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    revealNodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="section-white reveal-on-scroll">
          <Hero />
        </div>
        <div className="section-gray reveal-on-scroll">
          <Features />
        </div>
        <div className="section-white reveal-on-scroll">
          <FeaturesVideo />
        </div>
        <div className="section-gray reveal-on-scroll">
          <SuccessStories />
        </div>
        <div className="section-white reveal-on-scroll">
          <WhyRevelaoSection />
        </div>
        <div className="section-gray reveal-on-scroll">
          <Pricing />
        </div>
        <div className="section-white reveal-on-scroll">
          <section className="py-10 md:py-12 bg-transparent">
            <div className="container px-4 mx-auto">
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {exampleCards.map((card) => (
                  <div key={card.title} className="revelao-card no-card-hover p-6 flex flex-col items-center text-center gap-5">
                    <button
                      type="button"
                      onClick={() => openExample(card.url)}
                      className="rounded-xl bg-white p-3 border border-border inline-flex"
                      aria-label={`Ver ejemplo: ${card.title}`}
                    >
                      <img src={card.qrSrc} alt={card.title} className="h-[132px] w-[132px] object-contain" />
                    </button>
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold text-foreground">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                      onClick={() => openExample(card.url)}
                    >
                        Ver ejemplo
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
        <div className="section-white reveal-on-scroll">
          <Templates />
        </div>
        <div className="section-white reveal-on-scroll">
          <BlogSection />
        </div>
        <div className="section-white reveal-on-scroll">
          <KpiStrip />
        </div>
        <div className="section-gray reveal-on-scroll">
          <SimpleCTA />
        </div>
        <div className="section-white reveal-on-scroll">
          <section className="py-4 md:py-8 bg-transparent scroll-mt-12 md:scroll-mt-14" id="faqs">
            <div className="container px-4 mx-auto">
              <div className="max-w-3xl mx-auto">
                <FAQs />
              </div>
            </div>
          </section>
        </div>
        <div className="section-white reveal-on-scroll">
          <EventGalleryFlow />
        </div>
        <div className="reveal-on-scroll">
          <HomeSeoContent />
        </div>
        <section className="py-4 md:py-6 bg-background reveal-on-scroll">
          <div className="mx-auto w-full">
            <div className="w-full">
              <TrialReminder />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloating />
      <PricingModal open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen} />
    </div>
  );
};
export default Index;
