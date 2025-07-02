import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TranslatableText } from "@/components/TranslatableText";
import ReadingProgress from "./deliberation/ReadingProgress";
import PerspectiveViewer from "./deliberation/PerspectiveViewer";
import CommentForm from "./deliberation/CommentForm";

interface Perspective {
  id: string;
  title: string;
  content: string;
  author: string;
  viewpoint: string;
  language?: string;
}

interface DeliberationRoomProps {
  roomId: string;
  title: string;
  description: string;
  perspectives: Perspective[];
  isAuthenticated: boolean;
  userId?: string;
  username?: string;
}

const DeliberationRoom: React.FC<DeliberationRoomProps> = ({
  roomId,
  title,
  description,
  perspectives,
  isAuthenticated,
  userId,
  username,
}) => {
  const [activeTab, setActiveTab] = useState<string>(perspectives[0]?.id || "");
  const [readPerspectives, setReadPerspectives] = useState<Set<string>>(new Set());
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (perspectives.length > 0) {
      const progress = (readPerspectives.size / perspectives.length) * 100;
      setReadingProgress(progress);
    }
  }, [readPerspectives, perspectives.length]);

  useEffect(() => {
    if (!activeTab) return;
    
    const timer = setTimeout(() => {
      setReadPerspectives(prev => new Set([...prev, activeTab]));
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to participate in deliberations",
        variant: "destructive",
      });
      return;
    }

    if (readPerspectives.size < perspectives.length) {
      toast({
        title: "All perspectives must be read",
        description: "Please read all perspectives before commenting",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write a comment before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Comment submitted",
        description: "Your perspective has been added to the deliberation",
      });
      
      setComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: "Error",
        description: "Failed to submit your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-8 border-border/30">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">
              <TranslatableText text={title} />
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              <TranslatableText text={description} />
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users size={14} />
            <span>{perspectives.length} perspectives</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <ReadingProgress
          readPerspectives={readPerspectives}
          totalPerspectives={perspectives.length}
          readingProgress={readingProgress}
        />

        <PerspectiveViewer
          perspectives={perspectives}
          activeTab={activeTab}
          readPerspectives={readPerspectives}
          onTabChange={handleTabChange}
        />
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <CommentForm
          comment={comment}
          setComment={setComment}
          readingProgress={readingProgress}
          isAuthenticated={isAuthenticated}
          isSubmitting={isSubmitting}
          onSubmit={handleCommentSubmit}
        />
      </CardFooter>
    </Card>
  );
};

export default DeliberationRoom;
