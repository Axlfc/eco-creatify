
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, Users, MessageCircle, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CommunityGuidelines = () => {
  const { data: guidelines } = useQuery({
    queryKey: ["guidelines"],
    queryFn: () => [
      { id: 1, title: "Respeto mutuo", description: "Mantén un tono constructivo y respetuoso", icon: Users },
      { id: 2, title: "Contenido relevante", description: "Publica contenido relacionado con la comunidad", icon: MessageCircle },
      { id: 3, title: "No spam", description: "Evita contenido repetitivo o promocional excesivo", icon: Shield },
      { id: 4, title: "Privacidad", description: "Respeta la privacidad de otros miembros", icon: Eye },
    ]
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Community Guidelines
        </CardTitle>
        <CardDescription>
          Rules and best practices for a healthy community environment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {guidelines?.map((guideline) => {
            const IconComponent = guideline.icon;
            return (
              <div key={guideline.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                <IconComponent className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">{guideline.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{guideline.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Enforcement Levels
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Warning
              </Badge>
              <span className="text-sm">First violation - friendly reminder</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Temporary restriction
              </Badge>
              <span className="text-sm">Repeated violations - limited access</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Suspension
              </Badge>
              <span className="text-sm">Serious violations - account suspended</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                Permanent ban
              </Badge>
              <span className="text-sm">Severe or repeated serious violations</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Good standing
            </Badge>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Following guidelines - full community access</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityGuidelines;
