import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { FAQs } from "@/components/FAQs";
import { SuccessStories } from "@/components/SuccessStories";
import { CombinedCTABanner } from "@/components/CombinedCTABanner";
import { Footer } from "@/components/Footer";
import { PricingModal } from "@/components/PricingModal";
import { useState, useEffect } from "react";

const Index = () => {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsPricingModalOpen(true);
    window.addEventListener('openPricingModal', handleOpenModal);
    return () => window.removeEventListener('openPricingModal', handleOpenModal);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <SuccessStories />
        <FAQs />
        <CombinedCTABanner />
      </main>
      <Footer />
      <PricingModal open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen} />
    </div>
  );
};
export default Index;