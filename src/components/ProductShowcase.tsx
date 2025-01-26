import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const products = [
  {
    id: 1,
    title: "Eco-Friendly Backpack",
    description: "Customizable backpack made from recycled materials",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    sustainability: "Made from 100% recycled materials",
  },
  {
    id: 2,
    title: "Smart Water Bottle",
    description: "Personalized hydration tracking with LED display",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    sustainability: "BPA-free, recyclable materials",
  },
  {
    id: 3,
    title: "Custom Desk Organizer",
    description: "Modular desk organization system",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    sustainability: "Sustainable bamboo construction",
  },
  {
    id: 4,
    title: "Smart Planter",
    description: "IoT-enabled plant care system",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    sustainability: "Solar-powered monitoring",
  },
];

export const ProductShowcase = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Our Products
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Discover our range of sustainable, customizable products
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-square relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{product.title}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-green-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                          <path d="M21 3v5h-5" />
                        </svg>
                        {product.sustainability}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};