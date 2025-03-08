
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { availableLanguages } from "@/hooks/use-translation";

interface StageInputFieldsProps {
  stageId: string;
  title: string;
  content: string;
  language?: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onLanguageChange?: (value: string) => void;
}

export const StageInputFields: React.FC<StageInputFieldsProps> = ({
  stageId,
  title,
  content,
  language = "en",
  onTitleChange,
  onContentChange,
  onLanguageChange,
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="input-language">Your Content Language</Label>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger id="input-language" className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {availableLanguages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(stageId === "problem-identification" || stageId === "brainstorming") && (
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
      )}

      {stageId !== "problem-identification" && stageId !== "brainstorming" && (
        <Textarea
          placeholder={getStagePrompt(stageId)}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          rows={5}
        />
      )}

      {language !== "en" && (
        <div className="flex items-center text-xs text-muted-foreground">
          <Globe className="h-3 w-3 mr-1" />
          <span>Your content will be automatically translated for users who speak other languages</span>
        </div>
      )}
    </div>
  );
};
