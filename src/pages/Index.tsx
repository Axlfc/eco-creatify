import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Newsletter } from "@/components/Newsletter";
import { Navigation } from "@/components/Navigation";
import { ProductShowcase } from "@/components/ProductShowcase";
import { SustainabilityMetrics } from "@/components/SustainabilityMetrics";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ProductShowcase />
      <SustainabilityMetrics />
      <Features />
      <Newsletter />
    </div>
  );
};

export default Index;