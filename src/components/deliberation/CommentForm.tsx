import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, MessageSquare } from "lucide-react";

interface CommentFormProps {
  comment: string;
  setComment: (comment: string) => void;
  readingProgress: number;
  isAuthenticated: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  comment,
  setComment,
  readingProgress,
  isAuthenticated,
  isSubmitting,
  onSubmit
}) => {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Share your perspective</span>
        {readingProgress < 100 && (
          <span className="text-xs text-amber-500 flex items-center">
            <BookOpen className="h-3 w-3 mr-1" />
            Please read all perspectives first
          </span>
        )}
      </div>
      <Textarea
        placeholder={
          readingProgress < 100
            ? "Read all perspectives before commenting..."
            : "After considering all perspectives, I think..."
        }
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mb-2"
        disabled={readingProgress < 100 || !isAuthenticated}
        readOnlyMessage={
          !isAuthenticated
            ? "Please sign in to participate"
            : readingProgress < 100
            ? "Please read all perspectives first"
            : undefined
        }
        rows={4}
      />
      <Button 
        className="w-full mt-2"
        onClick={onSubmit}
        disabled={readingProgress < 100 || !comment.trim() || isSubmitting || !isAuthenticated}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Submit Considered Response
      </Button>
    </div>
  );
};

export default CommentForm;