
import Navigation from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Newsletter } from "@/components/Newsletter";
import { ProductShowcase } from "@/components/ProductShowcase";
import { ProductCustomizer } from "@/components/ProductCustomizer";
import { SustainabilityMetrics } from "@/components/SustainabilityMetrics";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <Hero />
        <ProductShowcase />
        <ProductCustomizer />
        <Features />
        <SustainabilityMetrics />
        <Newsletter />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
