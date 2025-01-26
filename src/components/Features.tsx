import { Sparkles, Leaf, Zap } from "lucide-react";

const features = [
  {
    title: "Advanced Customization",
    description: "Create unique designs with our intuitive tools and real-time preview.",
    icon: Sparkles,
  },
  {
    title: "Sustainable Materials",
    description: "All products are made with eco-friendly materials and processes.",
    icon: Leaf,
  },
  {
    title: "Fast Delivery",
    description: "Quick turnaround times with our efficient production system.",
    icon: Zap,
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl font-bold mb-4">Why Choose Afaces?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the perfect blend of technology and sustainability
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-6 rounded-lg bg-background/80 backdrop-blur-sm border animate-slide-up-fade"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};