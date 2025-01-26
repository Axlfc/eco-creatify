import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const metrics = [
  {
    name: "Q1",
    recycledMaterials: 75,
    carbonOffset: 45,
    waterSaved: 60,
  },
  {
    name: "Q2",
    recycledMaterials: 85,
    carbonOffset: 55,
    waterSaved: 70,
  },
  {
    name: "Q3",
    recycledMaterials: 90,
    carbonOffset: 65,
    waterSaved: 80,
  },
  {
    name: "Q4",
    recycledMaterials: 95,
    carbonOffset: 75,
    waterSaved: 85,
  },
];

const impactData = [
  {
    title: "Recycled Materials Used",
    value: "85%",
    description: "of our products use recycled materials",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-green-500"
      >
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
      </svg>
    ),
  },
  {
    title: "Carbon Offset",
    value: "60%",
    description: "reduction in carbon footprint",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-500"
      >
        <path d="M2 22 16 8" />
        <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
        <path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
        <path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
        <path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" />
      </svg>
    ),
  },
  {
    title: "Water Conservation",
    value: "75%",
    description: "water saved in production",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-cyan-500"
      >
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
      </svg>
    ),
  },
];

export const SustainabilityMetrics = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Our Environmental Impact
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Track our commitment to sustainability and environmental responsibility
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {impactData.map((item, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4">
                {item.icon}
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{item.value}</div>
                <p className="text-sm text-gray-500">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Quarterly Sustainability Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ChartContainer
                config={{
                  recycledMaterials: { theme: { light: "#22c55e", dark: "#22c55e" } },
                  carbonOffset: { theme: { light: "#3b82f6", dark: "#3b82f6" } },
                  waterSaved: { theme: { light: "#06b6d4", dark: "#06b6d4" } },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar
                      dataKey="recycledMaterials"
                      name="Recycled Materials"
                      fill="var(--color-recycledMaterials)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="carbonOffset"
                      name="Carbon Offset"
                      fill="var(--color-carbonOffset)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="waterSaved"
                      name="Water Saved"
                      fill="var(--color-waterSaved)"
                      radius={[4, 4, 0, 0]}
                    />
                    <ChartTooltip>
                      <ChartTooltipContent />
                    </ChartTooltip>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};