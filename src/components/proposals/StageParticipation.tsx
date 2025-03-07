
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Send } from "lucide-react";
import { DeliberationStage } from "./DeliberationStages";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { StageInputFields } from "./StageInputFields";
import { StageRequirements } from "./StageRequirements";

interface StageParticipationProps {
  proposalId: string;
  currentStage: DeliberationStage;
  onParticipate: (data: any) => Promise<void>;
}

const StageParticipation: React.FC<StageParticipationProps> = ({
  proposalId,
  currentStage,
  onParticipate
}) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to participate in deliberations",
        variant: "destructive",
      });
      return;
    }

    if (currentStage.id === "problem-identification" || currentStage.id === "brainstorming") {
      if (!title || !content) {
        toast({
          title: "Both fields required",
          description: "Please provide both a title and details",
          variant: "destructive",
        });
        return;
      }
    } else if (!content) {
      toast({
        title: "Empty content",
        description: "Please write something before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onParticipate({
        stageId: currentStage.id,
        title: title || undefined,
        content,
        userId: user?.id
      });
      
      toast({
        title: "Contribution submitted",
        description: "Your input has been added to the deliberation process",
      });
      
      setContent("");
      setTitle("");
    } catch (error) {
      console.error("Error submitting contribution:", error);
      toast({
        title: "Error",
        description: "Failed to submit your contribution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <currentStage.icon className="h-5 w-5" />
          Participate in {currentStage.name}
        </CardTitle>
        <CardDescription>
          This stage ends in {Math.ceil((currentStage.endDate?.getTime() || 0 - Date.now()) / (1000 * 60 * 60 * 24))} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <StageRequirements requirements={currentStage.requirements} />
        
        <div className="space-y-4">
          <div className="text-sm">
            Current participation: <Users className="h-3.5 w-3.5 inline ml-1" /> 
            <span className="font-medium mx-1">
              {currentStage.requirements.find(r => r.type === "participation")?.current || 0}
            </span> 
            participants
          </div>
          
          <StageInputFields 
            stageId={currentStage.id}
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting || !isAuthenticated}
        >
          <Send className="mr-2 h-4 w-4" />
          Submit Contribution
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StageParticipation;
