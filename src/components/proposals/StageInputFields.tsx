
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface StageInputFieldsProps {
  stageId: string;
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export const StageInputFields: React.FC<StageInputFieldsProps> = ({
  stageId,
  title,
  content,
  onTitleChange,
  onContentChange,
}) => {
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

  if (stageId === "problem-identification" || stageId === "brainstorming") {
    return (
      <>
        <Input 
          placeholder={stageId === "problem-identification" ? "Problem title" : "Solution title"}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="mb-2"
        />
        <Textarea
          placeholder={getStagePrompt(stageId)}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          rows={5}
        />
      </>
    );
  }

  return (
    <Textarea
      placeholder={getStagePrompt(stageId)}
      value={content}
      onChange={(e) => onContentChange(e.target.value)}
      rows={5}
    />
  );
};
