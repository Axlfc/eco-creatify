import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { StageRequirements } from "./StageRequirements";
import { StageInputFields } from "./StageInputFields";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";

interface StageParticipationProps {
  proposalId: string;
  currentStage: {
    id: string;
    name: string;
    requirements: {
      type: string;
      value: number;
      description: string;
      current?: number;
    }[];
  };
  onParticipate: (data: any) => Promise<void>;
}

const StageParticipation: React.FC<StageParticipationProps> = ({
  proposalId,
  currentStage,
  onParticipate,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState("en"); // Add language state
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to participate",
        variant: "destructive",
      });
      return;
    }

    if (content.trim() === "") {
      toast({
        title: "Input required",
        description: "Please share your thoughts before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const participationData = {
        stageId: currentStage.id,
        title: title || undefined, // Only include title for stages that use it
        content,
        language // Include language in the submission
      };
      
      await onParticipate(participationData);
      
      // Reset form after successful submission
      setTitle("");
      setContent("");
      
      toast({
        title: "Contribution submitted",
        description: "Thank you for your input on this stage!"
      });
    } catch (error) {
      console.error("Error submitting participation:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your input. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participate in this Stage</CardTitle>
        <CardDescription>
          Share your perspective on the {currentStage.name.toLowerCase()} stage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <StageRequirements requirements={currentStage.requirements} />
          
          <StageInputFields
            stageId={currentStage.id}
            title={title}
            content={content}
            language={language}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onLanguageChange={setLanguage}
          />
          
          <Button 
            type="submit" 
            className="w-full mt-6"
            disabled={isSubmitting || !isAuthenticated}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Perspective"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StageParticipation;
