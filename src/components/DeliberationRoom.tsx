
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MessageSquare, ThumbsUp, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Perspective {
  id: string;
  title: string;
  content: string;
  author: string;
  viewpoint: string;
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
    // Calculate reading progress percentage
    if (perspectives.length > 0) {
      const progress = (readPerspectives.size / perspectives.length) * 100;
      setReadingProgress(progress);
    }
  }, [readPerspectives, perspectives.length]);

  // Mark a perspective as read after spending at least 30 seconds on it
  useEffect(() => {
    if (!activeTab) return;
    
    const timer = setTimeout(() => {
      setReadPerspectives(prev => new Set([...prev, activeTab]));
    }, 10000); // 10 seconds for testing, use 30000 for production
    
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
      // Here you would submit the comment to your database
      // For now, we'll just simulate success
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
            <CardTitle className="text-xl">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users size={14} />
            <span>{perspectives.length} perspectives</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Reading progress</span>
            <span className="text-muted-foreground">
              {readPerspectives.size} of {perspectives.length} perspectives read
            </span>
          </div>
          <Progress value={readingProgress} className="h-2" color={readingProgress === 100 ? "bg-green-500" : undefined} />
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="w-full grid grid-cols-3 mb-4">
            {perspectives.map((perspective) => (
              <TabsTrigger key={perspective.id} value={perspective.id} className="relative">
                <span>{perspective.viewpoint}</span>
                {readPerspectives.has(perspective.id) && (
                  <BookOpen className="h-3 w-3 absolute top-1 right-1 text-green-500" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {perspectives.map((perspective) => (
            <TabsContent key={perspective.id} value={perspective.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{perspective.title}</CardTitle>
                  <div className="text-sm text-muted-foreground">By {perspective.author}</div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p>{perspective.content}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
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
            onClick={handleCommentSubmit}
            disabled={readingProgress < 100 || !comment.trim() || isSubmitting || !isAuthenticated}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Submit Considered Response
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DeliberationRoom;
