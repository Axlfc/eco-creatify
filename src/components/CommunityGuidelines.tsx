
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Check, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";

type CommunityGuideline = {
  id: string;
  category: string;
  title: string;
  description: string;
  severity_level: string;
  examples: string[];
};

export const CommunityGuidelines = () => {
  // Fetch community guidelines
  const { data: guidelines, isLoading } = useQuery({
    queryKey: ['community-guidelines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_guidelines')
        .select('*')
        .order('severity_level', { ascending: false });
      
      if (error) throw error;
      return data as CommunityGuideline[];
    },
  });

  const getSeverityBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return (
          <Badge variant="destructive" className="ml-2">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Critical
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="destructive" className="ml-2 bg-orange-500">
            <AlertTriangle className="h-3 w-3 mr-1" />
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300">
            Medium
          </Badge>
        );
      case 'low':
        return (
          <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-300">
            Low
          </Badge>
        );
      default:
        return <Badge variant="outline" className="ml-2">{level}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading community guidelines...</div>;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Shield className="h-5 w-5 mr-2" />
          Community Guidelines
        </CardTitle>
        <CardDescription>
          Our forum is dedicated to truthful, respectful discourse. These guidelines help maintain a space where evidence-based discussion can flourish.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {guidelines?.map((guideline) => (
            <AccordionItem key={guideline.id} value={guideline.id}>
              <AccordionTrigger className="text-base">
                <span>{guideline.title}</span>
                {getSeverityBadge(guideline.severity_level)}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <p>{guideline.description}</p>
                  
                  {guideline.examples.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Examples:</h4>
                      <ul className="space-y-2">
                        {guideline.examples.map((example, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 mr-2 mt-0.5 text-red-500" />
                            <span className="text-sm text-muted-foreground">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
