import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { Templates } from "@/components/Templates";
import { FAQs } from "@/components/FAQs";
import { SuccessStories } from "@/components/SuccessStories";
import { FreeTrial } from "@/components/FreeTrial";
import { CombinedCTABanner } from "@/components/CombinedCTABanner";
import { Footer } from "@/components/Footer";
import { PricingModal } from "@/components/PricingModal";
import { BlogSection } from "@/components/BlogSection";
import { HomeSeoContent } from "@/components/HomeSeoContent";
import { useState, useEffect } from "react";
import { useI18n, translations } from "@/lib/i18n";

const Index = () => {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const { lang } = useI18n();

  useEffect(() => {
    const handleOpenModal = () => setIsPricingModalOpen(true);
    window.addEventListener('openPricingModal', handleOpenModal);
    return () => window.removeEventListener('openPricingModal', handleOpenModal);
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Features />
        <SuccessStories />
        <Templates />
        <Pricing />
        <BlogSection />
        <HomeSeoContent />
        <FreeTrial />
        <FAQs />
        <CombinedCTABanner />
      </main>
      <Footer />
      <PricingModal open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen} />
    </div>
  );
};
export default Index;
