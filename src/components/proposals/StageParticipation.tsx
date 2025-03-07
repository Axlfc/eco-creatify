
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Send, AlertTriangle } from "lucide-react";
import { DeliberationStage } from "./DeliberationStages";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

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

  const getStagePrompt = (stageId: string) => {
    switch (stageId) {
      case "problem-identification":
        return "What specific aspects of this issue need addressing? Describe the problem thoroughly.";
      case "brainstorming":
        return "What solutions could address the identified problems? Be creative and specific.";
      case "evaluation":
        return "What are the strengths and weaknesses of each proposed solution?";
      case "refinement":
        return "How can we improve the leading solutions? Suggest specific enhancements.";
      case "decision":
        return "Which refined solution do you support and why?";
      default:
        return "Share your thoughts on this stage of the deliberation process.";
    }
  };

  const getInputFields = (stageId: string) => {
    switch (stageId) {
      case "problem-identification":
        return (
          <>
            <Input 
              placeholder="Problem title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-2"
            />
            <Textarea
              placeholder={getStagePrompt(stageId)}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </>
        );
      case "brainstorming":
        return (
          <>
            <Input 
              placeholder="Solution title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-2"
            />
            <Textarea
              placeholder={getStagePrompt(stageId)}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </>
        );
      default:
        return (
          <Textarea
            placeholder={getStagePrompt(stageId)}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
        );
    }
  };

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

  const getRequirementsText = () => {
    const remainingReqs = currentStage.requirements.filter(req => {
      if (req.current === undefined) return true;
      return req.current < req.value;
    });
    
    if (remainingReqs.length === 0) return null;
    
    return (
      <Alert variant="warning" className="mb-4">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <AlertDescription>
          This stage requires: {remainingReqs.map(r => r.description).join(", ")}
        </AlertDescription>
      </Alert>
    );
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
        {getRequirementsText()}
        
        <div className="space-y-4">
          <div className="text-sm">
            Current participation: <Users className="h-3.5 w-3.5 inline ml-1" /> 
            <span className="font-medium mx-1">
              {currentStage.requirements.find(r => r.type === "participation")?.current || 0}
            </span> 
            participants
          </div>
          
          {getInputFields(currentStage.id)}
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
