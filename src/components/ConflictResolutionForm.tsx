import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquare, 
  Handshake, 
  Lightbulb,
  UsersRound,
  Diff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createConflictResolution } from "@/services/conflictResolutionService";
import { Stage } from "@/types/conflictResolution";
import { supabase } from "@/integrations/supabase/client";

interface ConflictResolutionFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

const ConflictResolutionForm = ({ onCancel, onSubmit }: ConflictResolutionFormProps) => {
  const [title, setTitle] = useState("");
  const [partyA, setPartyA] = useState("");
  const [partyB, setPartyB] = useState("");
  const [positionA, setPositionA] = useState("");
  const [positionB, setPositionB] = useState("");
  const [commonGround, setCommonGround] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const MIN_LENGTH = 100;
  
  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        if (!title.trim()) {
          toast({
            title: "Missing information",
            description: "Please provide a title for this conflict resolution",
            variant: "destructive",
          });
          return false;
        }
        if (!partyA.trim() || !partyB.trim()) {
          toast({
            title: "Missing information",
            description: "Please identify both parties involved in the conflict",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      case 2:
        if (positionA.length < MIN_LENGTH) {
          toast({
            title: "Insufficient detail",
            description: `Position A needs at least ${MIN_LENGTH} characters to ensure adequate explanation`,
            variant: "destructive",
          });
          return false;
        }
        if (positionB.length < MIN_LENGTH) {
          toast({
            title: "Insufficient detail",
            description: `Position B needs at least ${MIN_LENGTH} characters to ensure adequate explanation`,
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      case 3:
        if (commonGround.length < MIN_LENGTH) {
          toast({
            title: "Insufficient detail",
            description: `Common ground section needs at least ${MIN_LENGTH} characters to be meaningful`,
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      case 4:
        if (proposedSolution.length < MIN_LENGTH) {
          toast({
            title: "Insufficient detail",
            description: `Proposed solution needs at least ${MIN_LENGTH} characters to be actionable`,
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(Math.max(1, step - 1));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You need to be logged in to submit a conflict resolution.",
          variant: "destructive"
        });
        return;
      }
      
      // Create the conflict resolution in our database
      await createConflictResolution({
        title,
        description: "Conflict resolution process",
        partyA,
        partyB,
        positionA: {
          content: positionA,
          createdBy: user.id
        },
        positionB: {
          content: positionB,
          createdBy: user.id
        },
        progress: {
          current_stage: Stage.Articulation,
          completed_stages: [],
          stage_progress: {}
        },
        commonGround: {
          points: [commonGround],
          agreedBy: [user.id],
          createdAt: new Date().toISOString()
        },
        proposedSolutions: [{
          description: proposedSolution,
          addressesPoints: [],
          proposedBy: user.id,
          createdAt: new Date().toISOString()
        }],
        consensusReached: false,
        isPublic: true,
        userId: user.id
      });
      
      toast({
        title: "Conflict resolution submitted",
        description: "Your conflict resolution template has been submitted.",
      });
      
      onSubmit();
    } catch (error) {
      console.error("Error submitting conflict resolution:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your conflict resolution.",
        variant: "destructive"
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="conflict-title">Title of the Conflict</Label>
              <Input
                id="conflict-title"
                placeholder="Summarize the conflict in a concise title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="party-a">Party A (Identifier/Position)</Label>
                <Input
                  id="party-a"
                  placeholder="e.g., Environmental Advocates"
                  value={partyA}
                  onChange={(e) => setPartyA(e.target.value)}
                />
              </div>
              
              <div className="space-y-2 flex-1">
                <Label htmlFor="party-b">Party B (Identifier/Position)</Label>
                <Input
                  id="party-b"
                  placeholder="e.g., Economic Development Group"
                  value={partyB}
                  onChange={(e) => setPartyB(e.target.value)}
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UsersRound className="h-5 w-5 text-primary" />
                <Label htmlFor="position-a">{`${partyA}'s Position (${positionA.length}/${MIN_LENGTH} characters)`}</Label>
              </div>
              <Textarea
                id="position-a"
                placeholder="Describe the first position in detail..."
                value={positionA}
                onChange={(e) => setPositionA(e.target.value)}
                rows={5}
                className={positionA.length > 0 && positionA.length < MIN_LENGTH ? "border-red-300" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UsersRound className="h-5 w-5 text-primary" />
                <Label htmlFor="position-b">{`${partyB}'s Position (${positionB.length}/${MIN_LENGTH} characters)`}</Label>
              </div>
              <Textarea
                id="position-b"
                placeholder="Describe the second position in detail..."
                value={positionB}
                onChange={(e) => setPositionB(e.target.value)}
                rows={5}
                className={positionB.length > 0 && positionB.length < MIN_LENGTH ? "border-red-300" : ""}
              />
            </div>
            
            <div className="rounded-md bg-secondary/50 p-3 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Diff className="h-4 w-4 text-primary" />
                <span className="font-medium">Position Documentation Guidelines</span>
              </div>
              <ul className="space-y-1 list-disc pl-5">
                <li>State each position accurately without bias</li>
                <li>Use evidence and specific examples where possible</li>
                <li>Acknowledge underlying concerns and values</li>
                <li>Avoid judgmental language or assumptions</li>
              </ul>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Handshake className="h-5 w-5 text-primary" />
                <Label htmlFor="common-ground">{`Common Ground (${commonGround.length}/${MIN_LENGTH} characters)`}</Label>
              </div>
              <Textarea
                id="common-ground"
                placeholder="Identify shared values, interests, or areas of agreement between the parties..."
                value={commonGround}
                onChange={(e) => setCommonGround(e.target.value)}
                rows={6}
                className={commonGround.length > 0 && commonGround.length < MIN_LENGTH ? "border-red-300" : ""}
              />
            </div>
            
            <div className="rounded-md bg-secondary/50 p-3 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Handshake className="h-4 w-4 text-primary" />
                <span className="font-medium">Finding Common Ground Tips</span>
              </div>
              <ul className="space-y-1 list-disc pl-5">
                <li>Look for shared fundamental values beneath different positions</li>
                <li>Identify mutual needs that both parties recognize</li>
                <li>Consider long-term aspirations that may be compatible</li>
                <li>Acknowledge areas where compromise might be possible</li>
              </ul>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <Label htmlFor="proposed-solution">{`Proposed Solution (${proposedSolution.length}/${MIN_LENGTH} characters)`}</Label>
              </div>
              <Textarea
                id="proposed-solution"
                placeholder="Propose a solution that addresses concerns from both perspectives..."
                value={proposedSolution}
                onChange={(e) => setProposedSolution(e.target.value)}
                rows={8}
                className={proposedSolution.length > 0 && proposedSolution.length < MIN_LENGTH ? "border-red-300" : ""}
              />
            </div>
            
            <div className="rounded-md bg-secondary/50 p-3 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <span className="font-medium">Effective Solution Guidelines</span>
              </div>
              <ul className="space-y-1 list-disc pl-5">
                <li>Address core concerns from both sides</li>
                <li>Be specific, detailed and actionable</li>
                <li>Consider potential objections and address them</li>
                <li>Focus on collaborative implementation</li>
              </ul>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Conflict Resolution Template
          <div className="ml-auto text-sm font-normal text-muted-foreground">
            Step {step} of 4
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStep()}
        
        <div className="flex justify-between pt-2">
          <Button
            variant="ghost"
            onClick={step === 1 ? onCancel : prevStep}
            type="button"
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          
          <Button
            variant="outline"
            onClick={step === 4 ? handleSubmit : nextStep}
            type="button"
          >
            {step === 4 ? "Submit" : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConflictResolutionForm;
