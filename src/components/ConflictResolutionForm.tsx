import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  MessageCircle, 
  Scale, 
  ClipboardList, 
  Lightbulb,
  Handshake,
  CheckCircle,
  AlertTriangle,
  Clock,
  User
} from "lucide-react";

interface ConflictResolutionFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

interface ConflictResolutionData {
  title: string;
  description: string;
  partyA: string;
  partyB: string;
  positionA: {
    description: string;
    keyPoints: string[];
    evidence: string[];
  };
  positionB: {
    description: string;
    keyPoints: string[];
    evidence: string[];
  };
  common_ground?: {
    sharedValues: string[];
    agreedFacts: string[];
    mutualGoals: string[];
  };
  disagreementPoints?: {
    coreIssues: string[];
    differentPerspectives: string[];
    conflictingEvidence: string[];
  };
  evidenceList?: {
    sources: string[];
    documentation: string[];
    expertOpinions: string[];
  };
  proposedSolutions?: {
    compromises: string[];
    alternativeApproaches: string[];
    implementationSteps: string[];
  };
  mediationRequest?: {
    requested: boolean;
    preferredMediators: string[];
    mediationGoals: string[];
  };
  progress: {
    currentStage: string;
    completedSteps: string[];
    nextActions: string[];
    timeframe: string;
  };
}

const ConflictResolutionForm: React.FC<ConflictResolutionFormProps> = ({ onCancel, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ConflictResolutionData>({
    title: "",
    description: "",
    partyA: "",
    partyB: string;
    positionA: {
      description: string;
      keyPoints: string[];
      evidence: string[];
    };
    positionB: {
      description: string;
      keyPoints: string[];
      evidence: string[];
    };
    common_ground?: {
      sharedValues: string[];
      agreedFacts: string[];
      mutualGoals: string[];
    };
    disagreementPoints?: {
      coreIssues: string[];
      differentPerspectives: string[];
      conflictingEvidence: string[];
    };
    evidenceList?: {
      sources: string[];
      documentation: string[];
      expertOpinions: string[];
    };
    proposedSolutions?: {
      compromises: string[];
      alternativeApproaches: string[];
      implementationSteps: string[];
    };
    mediationRequest?: {
      requested: boolean;
      preferredMediators: string[];
      mediationGoals: string[];
    };
    progress: {
      currentStage: string;
      completedSteps: string[];
      nextActions: string[];
      timeframe: string;
    };
  }

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createConflictResolution = useMutation({
    mutationFn: async (data: ConflictResolutionData) => {
      const { data: result, error } = await supabase
        .from('conflict_resolutions')
        .insert({
          title: data.title,
          description: data.description,
          party_a: data.partyA,
          party_b: data.partyB,
          position_a: data.positionA,
          position_b: data.positionB,
          progress: data.progress,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Conflict resolution template created",
        description: "Your structured approach to conflict resolution has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ['conflict-resolutions'] });
      onSubmit();
    },
    onError: (error) => {
      toast({
        title: "Error creating conflict resolution",
        description: "Please try again later.",
        variant: "destructive",
      });
      console.error("Error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createConflictResolution.mutate(formData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addArrayItem = (path: string, item: string) => {
    if (!item.trim()) return;
    
    const pathParts = path.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }
      
      const finalKey = pathParts[pathParts.length - 1];
      if (!current[finalKey]) current[finalKey] = [];
      current[finalKey] = [...current[finalKey], item];
      
      return newData;
    });
  };

  const removeArrayItem = (path: string, index: number) => {
    const pathParts = path.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }
      
      const finalKey = pathParts[pathParts.length - 1];
      current[finalKey] = current[finalKey].filter((_: any, i: number) => i !== index);
      
      return newData;
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Users className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Conflict Overview</h3>
              <p className="text-gray-600">Define the basic information about the conflict situation</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Conflict Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="Brief description of the conflict"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Provide context and background information about the conflict"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="partyA">Party A</Label>
                  <Input
                    id="partyA"
                    value={formData.partyA}
                    onChange={(e) => updateFormData('partyA', e.target.value)}
                    placeholder="Name or identifier for Party A"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="partyB">Party B</Label>
                  <Input
                    id="partyB"
                    value={formData.partyB}
                    onChange={(e) => updateFormData('partyB', e.target.value)}
                    placeholder="Name or identifier for Party B"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MessageCircle className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Positions of Each Party</h3>
              <p className="text-gray-600">Describe the positions, key points, and evidence for each party involved</p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Position of Party A</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="positionADescription">Description</Label>
                    <Textarea
                      id="positionADescription"
                      value={formData.positionA.description}
                      onChange={(e) => updateFormData('positionA.description', e.target.value)}
                      placeholder="Describe the position of Party A"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Key Points</Label>
                    {formData.positionA.keyPoints.map((point, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{point}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('positionA.keyPoints', index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a key point"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('positionA.keyPoints', (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <Button type="button" onClick={(e) => {
                        const input = e.target?.previousElementSibling as HTMLInputElement;
                        if (input) {
                          addArrayItem('positionA.keyPoints', input.value);
                          input.value = '';
                        }
                      }}>Add</Button>
                    </div>
                  </div>

                  <div>
                    <Label>Evidence</Label>
                    {formData.positionA.evidence.map((evidence, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{evidence}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('positionA.evidence', index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add evidence"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('positionA.evidence', (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <Button type="button" onClick={(e) => {
                        const input = e.target?.previousElementSibling as HTMLInputElement;
                        if (input) {
                          addArrayItem('positionA.evidence', input.value);
                          input.value = '';
                        }
                      }}>Add</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Position of Party B</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="positionBDescription">Description</Label>
                    <Textarea
                      id="positionBDescription"
                      value={formData.positionB.description}
                      onChange={(e) => updateFormData('positionB.description', e.target.value)}
                      placeholder="Describe the position of Party B"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Key Points</Label>
                    {formData.positionB.keyPoints.map((point, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{point}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('positionB.keyPoints', index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a key point"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('positionB.keyPoints', (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <Button type="button" onClick={(e) => {
                        const input = e.target?.previousElementSibling as HTMLInputElement;
                        if (input) {
                          addArrayItem('positionB.keyPoints', input.value);
                          input.value = '';
                        }
                      }}>Add</Button>
                    </div>
                  </div>

                  <div>
                    <Label>Evidence</Label>
                    {formData.positionB.evidence.map((evidence, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{evidence}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('positionB.evidence', index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add evidence"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('positionB.evidence', (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <Button type="button" onClick={(e) => {
                        const input = e.target?.previousElementSibling as HTMLInputElement;
                        if (input) {
                          addArrayItem('positionB.evidence', input.value);
                          input.value = '';
                        }
                      }}>Add</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Handshake className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Finding Common Ground</h3>
              <p className="text-gray-600">Identify shared values, agreed facts, and mutual goals between the parties</p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Common Ground</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Shared Values</Label>
                    {formData.common_ground?.sharedValues?.map((value, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{value}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('common_ground.sharedValues', index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a shared value"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('common_ground.sharedValues', (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <Button type="button" onClick={(e) => {
                        const input = e.target?.previousElementSibling as HTMLInputElement;
                        if (input) {
                          addArrayItem('common_ground.sharedValues', input.value);
                          input.value = '';
                        }
                      }}>Add</Button>
                    </div>
                  </div>

                  <div>
                    <Label>Agreed Facts</Label>
                    {formData.common_ground?.agreedFacts?.map((fact, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{fact}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('common_ground.agreedFacts', index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add an agreed fact"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('common_ground.agreedFacts', (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <Button type="button" onClick={(e) => {
                        const input = e.target?.previousElementSibling as HTMLInputElement;
                        if (input) {
                          addArrayItem('common_ground.agreedFacts', input.value);
                          input.value = '';
                        }
                      }}>Add</Button>
                    </div>
                  </div>

                  <div>
                    <Label>Mutual Goals</Label>
                    {formData.common_ground?.mutualGoals?.map((goal, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{goal}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('common_ground.mutualGoals', index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a mutual goal"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('common_ground.mutualGoals', (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <Button type="button" onClick={(e) => {
                        const input = e.target?.previousElementSibling as HTMLInputElement;
                        if (input) {
                          addArrayItem('common_ground.mutualGoals', input.value);
                          input.value = '';
                        }
                      }}>Add</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <AlertTriangle className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Addressing Disagreements</h3>
              <p className="text-gray-600">Identify core issues, different perspectives, and conflicting evidence</p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Disagreement Points</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Core Issues</Label>
                    {formData.disagreementPoints?.coreIssues?.map((issue, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{issue}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('disagreementPoints.coreIssues', index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a core issue"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('disagreementPoints.coreIssues', (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <Button type="button" onClick={(e) => {
                        const input = e.target?.previousElementSibling as HTMLInputElement;
                        if (input) {
                          addArrayItem('disagreementPoints.coreIssues', input.value);
                          input.value = '';
                        }
                      }}>Add</Button>
                    </div>
                  </div>

                  <div>
                    <Label>Different Perspectives</Label>
                    {formData.disagreementPoints?.differentPerspectives?.map((perspective, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{perspective}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('disagreementPoints.differentPerspectives', index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a different perspective"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('disagreementPoints.differentPerspectives', (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <Button type="button" onClick={(e) => {
                        const input = e.target?.previousElementSibling as HTMLInputElement;
                        if (input) {
                          addArrayItem('disagreementPoints.differentPerspectives', input.value);
                          input.value = '';
                        }
                      }}>Add</Button>
                    </div>
                  </div>

                  <div>
                    <Label>Conflicting Evidence</Label>
                    {formData.disagreementPoints?.conflictingEvidence?.map((evidence, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{evidence}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('disagreementPoints.conflictingEvidence', index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add conflicting evidence"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('disagreementPoints.conflictingEvidence', (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <Button type="button" onClick={(e) => {
                        const input = e.target?.previousElementSibling as HTMLInputElement;
                        if (input) {
                          addArrayItem('disagreementPoints.conflictingEvidence', input.value);
                          input.value = '';
                        }
                      }}>Add</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Lightbulb className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Proposing Solutions</h3>
              <p className="text-gray-600">Suggest compromises, alternative approaches, and implementation steps</p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Proposed Solutions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Compromises</Label>
                    {formData.proposedSolutions?.compromises?.map((compromise, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{compromise}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('proposedSolutions.compromises', index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a compromise"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('proposedSolutions.compromises', (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <Button type="button" onClick={(e) => {
                        const input = e.target?.previousElementSibling as HTMLInputElement;
                        if (input) {
                          addArrayItem('proposedSolutions.compromises', input.value);
                          input.value = '';
                        }
                      }}>Add</Button>
                    </div>
                  </div>

                  <div>
                    <Label>Alternative Approaches</Label>
                    {formData.proposedSolutions?.alternativeApproaches?.map((approach, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{approach}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('proposedSolutions.alternativeApproaches', index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add an alternative approach"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('proposedSolutions.alternativeApproaches', (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <Button type="button" onClick={(e) => {
                        const input = e.target?.previousElementSibling as HTMLInputElement;
                        if (input) {
                          addArrayItem('proposedSolutions.alternativeApproaches', input.value);
                          input.value = '';
                        }
                      }}>Add</Button>
                    </div>
                  </div>

                  <div>
                    <Label>Implementation Steps</Label>
                    {formData.proposedSolutions?.implementationSteps?.map((step, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{step}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('proposedSolutions.implementationSteps', index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add an implementation step"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('proposedSolutions.implementationSteps', (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <Button type="button" onClick={(e) => {
                        const input = e.target?.previousElementSibling as HTMLInputElement;
                        if (input) {
                          addArrayItem('proposedSolutions.implementationSteps', input.value);
                          input.value = '';
                        }
                      }}>Add</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Conflict Resolution Template
        </CardTitle>
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              
              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={
                    (currentStep === 1 && (!formData.title || !formData.description || !formData.partyA || !formData.partyB))
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createConflictResolution.isLoading}
                >
                  {createConflictResolution.isLoading ? 'Creating...' : 'Create Conflict Resolution'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ConflictResolutionForm;
