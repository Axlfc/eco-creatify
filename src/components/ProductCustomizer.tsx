import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Leaf, Recycle, TreePine } from "lucide-react";

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

  const selectedMaterial = materials.find((m) => m.id === options.material);
  const selectedColor = colors.find((c) => c.id === options.color);

  return (
    <section className="py-12 px-4 md:px-6 bg-secondary/30">
      <div className="container max-w-6xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Preview */}
          <Card className="p-6 relative overflow-hidden">
            <div
              className="aspect-square rounded-lg transition-all duration-300"
              style={{
                backgroundColor: selectedColor?.hex,
                transform: `scale(${options.size / 50})`,
              }}
            >
              {/* This is a placeholder for the actual product preview */}
              <div className="w-full h-full flex items-center justify-center text-4xl">
                Preview
              </div>
            </div>
          </Card>

          {/* Customization Controls */}
          <Card className="p-6 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Customize Your Product</h2>

              {/* Material Selection */}
              <div className="space-y-4 mb-8">
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
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-green-100 text-green-800"
                          >
                            {material.sustainability}% Eco
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color Selection */}
              <div className="space-y-4 mb-8">
                <Label>Color</Label>
                <div className="grid grid-cols-4 gap-4">
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
              <div className="space-y-4">
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
            </div>

            {/* Sustainability Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Sustainability Features
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-100/10 rounded-lg">
                  <Leaf className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm">Eco-Friendly</p>
                </div>
                <div className="text-center p-4 bg-green-100/10 rounded-lg">
                  <Recycle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm">Recyclable</p>
                </div>
                <div className="text-center p-4 bg-green-100/10 rounded-lg">
                  <TreePine className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm">Sustainable</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};