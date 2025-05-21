import { useNavigate } from "react-router-dom";
import { createCheckoutSession } from "@/utils/stripe";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  billingCycle: string;
  features: string[];
}

const pricingTiers: PricingTier[] = [
  {
    id: "price_1QmEt3GzzgXMTNqrz4dhC84f",
    name: "Starter Kit",
    description: "A one-time purchase for essential eco-friendly tools",
    price: 49,
    category: "Physical Goods",
    billingCycle: "One-Off",
    features: ["Essential eco-friendly tools", "Starter guide", "Community access"],
  },
  {
    id: "price_1QmEuHGzzgXMTNqrT4531sI6",
    name: "Custom Decor Piece",
    description: "Personalized sustainable home decor",
    price: 99,
    category: "Physical Goods",
    billingCycle: "One-Off",
    features: ["Customized design", "Sustainable materials", "Professional crafting"],
  },
  {
    id: "price_1QmF0bGzzgXMTNqrdhfUaUTX",
    name: "Workshop Access",
    description: "3-hour virtual workshop on eco-creativity",
    price: 79,
    category: "Digital Services",
    billingCycle: "One-Off",
    features: ["Live instruction", "Interactive Q&A", "Workshop materials"],
  },
  {
    id: "price_1QmF1UGzzgXMTNqr1YUwKjdf",
    name: "Eco-Learn Basic",
    description: "Access to exclusive eco-creative tutorials and guides",
    price: 19,
    category: "Digital Services",
    billingCycle: "Monthly",
    features: ["Tutorial library", "Monthly updates", "Community forum access"],
  },
  {
    id: "price_1QmF2FGzzgXMTNqrINxN9xFV",
    name: "Eco-Learn Pro",
    description: "Includes Basic + monthly webinar and a digital product template",
    price: 39,
    category: "Digital Services",
    billingCycle: "Monthly",
    features: ["All Basic features", "Monthly webinars", "Product templates", "Priority support"],
  },
  {
    id: "price_1QmF3XGzzgXMTNqrmpLkzsr1",
    name: "Annual Pro Plan",
    description: "Pro Plan benefits with a 15% annual discount",
    price: 399,
    category: "Digital Services",
    billingCycle: "Annual",
    features: ["All Pro features", "15% annual discount", "Exclusive workshops"],
  },
  {
    id: "price_1QmF5EGzzgXMTNqrMCMBXpks",
    name: "3D Visualization",
    description: "Visualization services for custom eco-friendly products",
    price: 149,
    category: "Digital Services",
    billingCycle: "Per Use",
    features: ["3D modeling", "Multiple revisions", "High-res renders"],
  },
  {
    id: "price_1QmF6wGzzgXMTNqrXCrg59Ga",
    name: "Eco-Luxury Box",
    description: "A curated sustainable materials/products subscription box",
    price: 89,
    category: "Physical Goods",
    billingCycle: "Monthly",
    features: ["Curated products", "Sustainable packaging", "Monthly themes"],
  },
  {
    id: "price_1QmF8BGzzgXMTNqrHr5UZr2L",
    name: "Eco-Audit Consultation",
    description: "Consultation on sustainability for design projects",
    price: 199,
    category: "Services",
    billingCycle: "Per Use",
    features: ["1-hour consultation", "Written recommendations", "Follow-up session"],
  },
];

export const PricingTiers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = async (priceId: string) => {
    try {
      await createCheckoutSession(priceId);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate checkout. Please try again.",
      });
    }
  };

  const categories = Array.from(new Set(pricingTiers.map((tier) => tier.category)));

  return (
    <div className="container mx-auto px-4 py-8">
      {categories.map((category) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingTiers
              .filter((tier) => tier.category === category)
              .map((tier) => (
                <Card key={tier.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{tier.name}</CardTitle>
                        <CardDescription className="mt-2">
                          {tier.description}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {tier.billingCycle}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-3xl font-bold mb-4">
                      ${tier.price}
                      {tier.billingCycle !== "One-Off" && (
                        <span className="text-sm font-normal text-muted-foreground">
                          /{tier.billingCycle.toLowerCase()}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleSubscribe(tier.id)}
                    >
                      {tier.billingCycle === "One-Off" ? "Purchase" : "Subscribe"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};