import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export const Hero = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-0" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center space-y-8 animate-fade-down">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Design Your Perfect Experience
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Create unique, sustainable products tailored to your preferences with our advanced customization platform.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="group">
              Start Creating
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};