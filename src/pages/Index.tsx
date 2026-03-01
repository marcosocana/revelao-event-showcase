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
import { useState, useEffect } from "react";
import { useI18n, translations } from "@/lib/i18n";

const Index = () => {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const { lang, setLang } = useI18n();

  useEffect(() => {
    const handleOpenModal = () => setIsPricingModalOpen(true);
    window.addEventListener('openPricingModal', handleOpenModal);
    return () => window.removeEventListener('openPricingModal', handleOpenModal);
  }, []);

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
          <Templates />
        </div>
        <div className="section-gray reveal-on-scroll">
          <Pricing />
        </div>
        <div className="section-white reveal-on-scroll">
          <WhyRevelaoSection />
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
