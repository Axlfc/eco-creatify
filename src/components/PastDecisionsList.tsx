
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  ThumbsUp,
  ThumbsDown,
  BarChart4,
  Calendar,
  Users,
  ExternalLink,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

// Mock data for past decisions
const mockDecisions = [
  {
    id: "1",
    title: "Implementation of Community Garden Project",
    description: "Decision to proceed with the community garden in Central District",
    category: "Environment",
    decidedAt: "2024-01-10",
    result: "approved" as const,
    participants: 45,
    consensusLevel: 85,
    implementation: {
      status: "in-progress" as const,
      progress: 60,
      expectedCompletion: "2024-03-15"
    },
    feedback: {
      satisfaction: 78,
      concerns: 12,
      suggestions: 8
    },
    impactMetrics: {
      environmentalImpact: 85,
      communityEngagement: 92,
      budgetEfficiency: 70
    }
  },
  {
    id: "2", 
    title: "Digital Privacy Guidelines",
    description: "Establishment of community standards for digital privacy",
    category: "Technology",
    decidedAt: "2024-01-05",
    result: "approved" as const,
    participants: 32,
    consensusLevel: 78,
    implementation: {
      status: "completed" as const,
      progress: 100,
      expectedCompletion: "2024-01-20"
    },
    feedback: {
      satisfaction: 82,
      concerns: 5,
      suggestions: 15
    },
    impactMetrics: {
      securityImprovement: 88,
      userAdoption: 65,
      complianceScore: 95
    }
  },
  {
    id: "3",
    title: "Youth Technology Mentorship Program Budget",
    description: "Budget allocation for the youth mentorship initiative",
    category: "Education",
    decidedAt: "2023-12-28",
    result: "modified" as const,
    participants: 38,
    consensusLevel: 65,
    implementation: {
      status: "delayed" as const,
      progress: 25,
      expectedCompletion: "2024-02-28"
    },
    feedback: {
      satisfaction: 60,
      concerns: 25,
      suggestions: 20
    },
    impactMetrics: {
      educationalImpact: 70,
      mentorParticipation: 55,
      budgetUtilization: 45
    }
  }
];

const resultConfig = {
  "approved": { 
    icon: CheckCircle, 
    color: "text-green-600", 
    bg: "bg-green-50", 
    label: "Approved",
    border: "border-green-200"
  },
  "rejected": { 
    icon: AlertTriangle, 
    color: "text-red-600", 
    bg: "bg-red-50", 
    label: "Rejected",
    border: "border-red-200"
  },
  "modified": { 
    icon: TrendingUp, 
    color: "text-blue-600", 
    bg: "bg-blue-50", 
    label: "Modified",
    border: "border-blue-200"
  }
};

const implementationConfig = {
  "completed": { color: "text-green-600", label: "Completed" },
  "in-progress": { color: "text-blue-600", label: "In Progress" },
  "delayed": { color: "text-amber-600", label: "Delayed" },
  "cancelled": { color: "text-red-600", label: "Cancelled" }
};

const PastDecisionsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { toast } = useToast();

  const filteredDecisions = mockDecisions.filter(decision => {
    const matchesSearch = 
      decision.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      decision.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || decision.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleViewDetail = (decisionId: string, title: string) => {
    // TODO: Implementar vista de detalle de decisión pasada
    toast({
      title: "Vista de detalle",
      description: `Análisis completo de "${title}" estará disponible próximamente`,
      variant: "default"
    });
  };

  const handleProvideFeedback = (decisionId: string, title: string) => {
    // TODO: Implementar formulario de feedback
    toast({
      title: "Feedback",
      description: `Formulario de feedback para "${title}" estará disponible próximamente`,
      variant: "default"
    });
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-blue-600";
    if (value >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const categories = ["All", "Environment", "Technology", "Education", "Governance", "Community"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart4 className="h-5 w-5" />
            Past Decisions & Impact Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Seguimiento del impacto de decisiones pasadas, feedback de la comunidad y métricas de implementación.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar decisiones pasadas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              className="px-3 py-2 border rounded-md bg-background"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-6">
            {filteredDecisions.length > 0 ? (
              filteredDecisions.map((decision) => {
                const config = resultConfig[decision.result];
                const StatusIcon = config.icon;
                const implConfig = implementationConfig[decision.implementation.status];
                
                return (
                  <Card key={decision.id} className={`${config.border} hover:shadow-md transition-shadow`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{decision.category}</Badge>
                            <Badge className={`${config.bg} ${config.color} border-0`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                            <Badge variant="outline" className={implConfig.color}>
                              {implConfig.label}
                            </Badge>
                            <Badge variant="outline">
                              {decision.consensusLevel}% consensus
                            </Badge>
                          </div>
                          <h3 className="font-medium text-lg mb-2">{decision.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{decision.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(decision.decidedAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {decision.participants} participants
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {decision.implementation.progress}% implemented
                            </span>
                          </div>

                          {/* Implementation Progress */}
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">Implementation Progress</span>
                              <span className="text-sm text-muted-foreground">
                                {decision.implementation.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${decision.implementation.progress}%` }}
                              ></div>
                            </div>
                            {decision.implementation.expectedCompletion && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Expected completion: {new Date(decision.implementation.expectedCompletion).toLocaleDateString()}
                              </p>
                            )}
                          </div>

                          {/* Impact Metrics */}
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                              <div className={`text-lg font-semibold ${getMetricColor(decision.feedback.satisfaction)}`}>
                                {decision.feedback.satisfaction}%
                              </div>
                              <div className="text-xs text-muted-foreground">Satisfaction</div>
                            </div>
                            <div className="text-center">
                              <div className={`text-lg font-semibold ${getMetricColor(100 - decision.feedback.concerns)}`}>
                                {decision.feedback.concerns}
                              </div>
                              <div className="text-xs text-muted-foreground">Concerns</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-blue-600">
                                {decision.feedback.suggestions}
                              </div>
                              <div className="text-xs text-muted-foreground">Suggestions</div>
                            </div>
                          </div>

                          {/* Specific Impact Metrics */}
                          <div className="border-t pt-3">
                            <h4 className="text-sm font-medium mb-2">Impact Metrics:</h4>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              {Object.entries(decision.impactMetrics).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                  <span className={getMetricColor(value)}>{value}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(decision.id, decision.title)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Detail
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleProvideFeedback(decision.id, decision.title)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Feedback
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-10 bg-muted/30 rounded-md">
                <BarChart4 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-medium mb-2">No past decisions found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || selectedCategory !== "All"
                    ? "No se encontraron decisiones que coincidan con tus filtros"
                    : "No hay decisiones pasadas disponibles para análisis"
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PastDecisionsList;
