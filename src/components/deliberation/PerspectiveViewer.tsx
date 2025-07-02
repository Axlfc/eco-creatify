import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";
import { TranslatableText } from "@/components/TranslatableText";

interface Perspective {
  id: string;
  title: string;
  content: string;
  author: string;
  viewpoint: string;
  language?: string;
}

interface PerspectiveViewerProps {
  perspectives: Perspective[];
  activeTab: string;
  readPerspectives: Set<string>;
  onTabChange: (value: string) => void;
}

const PerspectiveViewer: React.FC<PerspectiveViewerProps> = ({
  perspectives,
  activeTab,
  readPerspectives,
  onTabChange
}) => {
  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={onTabChange}>
      <TabsList className="w-full grid grid-cols-3 mb-4">
        {perspectives.map((perspective) => (
          <TabsTrigger key={perspective.id} value={perspective.id} className="relative">
            <span>
              <TranslatableText 
                text={perspective.viewpoint} 
                sourceLanguage={perspective.language || "en"}
              />
            </span>
            {readPerspectives.has(perspective.id) && (
              <BookOpen className="h-3 w-3 absolute top-1 right-1 text-green-500" />
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {perspectives.map((perspective) => (
        <TabsContent key={perspective.id} value={perspective.id}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                <TranslatableText 
                  text={perspective.title} 
                  sourceLanguage={perspective.language || "en"}
                />
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                By {perspective.author}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <TranslatableText 
                  text={perspective.content}
                  sourceLanguage={perspective.language || "en"}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default PerspectiveViewer;