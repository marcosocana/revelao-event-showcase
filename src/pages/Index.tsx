import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { SuccessStories } from "@/components/SuccessStories";
import { CTABanner } from "@/components/CTABanner";
import { Footer } from "@/components/Footer";
const Index = () => {
  return <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing className="shadow-inner" />
        <SuccessStories />
        <CTABanner />
      </main>
      <Footer />
    </div>;
};
export default Index;