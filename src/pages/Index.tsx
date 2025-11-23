import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { FAQs } from "@/components/FAQs";
import { SuccessStories } from "@/components/SuccessStories";
import { CombinedCTABanner } from "@/components/CombinedCTABanner";
import { Footer } from "@/components/Footer";
const Index = () => {
  return <div className="min-h-screen bg-background">
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
    </div>;
};
export default Index;