import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Leaf, Recycle, TreePine, ShoppingCart } from "lucide-react";
import { createCheckoutSession } from "@/utils/stripe";
import { useToast } from "@/hooks/use-toast";

interface CustomizationOptions {
  color: string;
  material: string;
  size: number;
}

const materials = [
  { id: "recycled", name: "Recycled Plastic", sustainability: 95 },
  { id: "bamboo", name: "Bamboo", sustainability: 90 },
  { id: "hemp", name: "Hemp Fiber", sustainability: 85 },
  { id: "organic", name: "Organic Cotton", sustainability: 80 },
];

const colors = [
  { id: "natural", name: "Natural", hex: "#F2FCE2" },
  { id: "ocean", name: "Ocean Blue", hex: "#D3E4FD" },
  { id: "sunset", name: "Sunset", hex: "#FEC6A1" },
  { id: "lavender", name: "Lavender", hex: "#D6BCFA" },
];

export const ProductCustomizer = () => {
  const [options, setOptions] = useState<CustomizationOptions>({
    color: colors[0].id,
    material: materials[0].id,
    size: 50,
  });
  const { toast } = useToast();

  const selectedMaterial = materials.find((m) => m.id === options.material);
  const selectedColor = colors.find((c) => c.id === options.color);

  const handlePurchase = async () => {
    try {
      // Using the Custom Decor Piece price ID as an example
      await createCheckoutSession("price_1QmEuHGzzgXMTNqrT4531sI6");
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate checkout. Please try again.",
      });
    }
  };

  return (
    <div className="bg-secondary/5 rounded-lg">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Customize Your Product</h2>
        <div className="grid gap-8">
          {/* Product Preview */}
          <Card className="overflow-hidden bg-background/50 border-0">
            <div
              className="aspect-square rounded-lg transition-all duration-300 flex items-center justify-center"
              style={{
                backgroundColor: selectedColor?.hex,
                transform: `scale(${options.size / 50})`,
              }}
            >
              <div className="text-4xl opacity-50">Preview</div>
            </div>
          </Card>

          {/* Customization Controls */}
          <div className="space-y-6">
            {/* Material Selection */}
            <div className="space-y-3">
              <Label>Material</Label>
              <Select
                value={options.material}
                onValueChange={(value) =>
                  setOptions({ ...options, material: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material.id} value={material.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{material.name}</span>
                        <Badge variant="secondary" className="ml-2 bg-green-100/10 text-green-500">
                          {material.sustainability}% Eco
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <Label>Color</Label>
              <div className="grid grid-cols-4 gap-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setOptions({ ...options, color: color.id })}
                    className={`w-full aspect-square rounded-full border-2 transition-all ${
                      options.color === color.id
                        ? "border-primary scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Adjustment */}
            <div className="space-y-3">
              <Label>Size</Label>
              <Slider
                value={[options.size]}
                onValueChange={(value) =>
                  setOptions({ ...options, size: value[0] })
                }
                min={25}
                max={75}
                step={1}
                className="w-full"
              />
            </div>

            {/* Purchase Button */}
            <Button
              className="w-full mt-6"
              size="lg"
              onClick={handlePurchase}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Purchase Custom Design
            </Button>

            {/* Sustainability Info */}
            <div className="pt-6 border-t border-border/50">
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                Sustainability Features
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-green-100/5 rounded-lg">
                  <Leaf className="w-5 h-5 mx-auto mb-1.5 text-green-500" />
                  <p className="text-xs text-muted-foreground">Eco-Friendly</p>
                </div>
                <div className="text-center p-3 bg-green-100/5 rounded-lg">
                  <Recycle className="w-5 h-5 mx-auto mb-1.5 text-green-500" />
                  <p className="text-xs text-muted-foreground">Recyclable</p>
                </div>
                <div className="text-center p-3 bg-green-100/5 rounded-lg">
                  <TreePine className="w-5 h-5 mx-auto mb-1.5 text-green-500" />
                  <p className="text-xs text-muted-foreground">Sustainable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
