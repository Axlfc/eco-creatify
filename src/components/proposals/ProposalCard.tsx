
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MessageSquare, ThumbsUp, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export type ProposalPhase = "presentation" | "discussion" | "voting" | "completed";

export interface ProposalCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  createdAt: string;
  phase: ProposalPhase;
  argumentsCount?: number;
  votesCount?: number;
  remainingTime?: string;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  id,
  title,
  description,
  category,
  author,
  createdAt,
  phase,
  argumentsCount = 0,
  votesCount = 0,
  remainingTime,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPhaseColor = (phase: ProposalPhase) => {
    switch (phase) {
      case "presentation":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "discussion":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "voting":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPhaseLabel = (phase: ProposalPhase) => {
    switch (phase) {
      case "presentation":
        return "Presentation";
      case "discussion":
        return "Discussion";
      case "voting":
        return "Voting";
      case "completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="bg-white border-border/30 hover:border-border/70 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Posted by {author} • {formatDate(createdAt)}
            </p>
          </div>
          <Badge className={`${getPhaseColor(phase)} ml-2 px-2 py-1 h-auto`}>
            {getPhaseLabel(phase)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm line-clamp-3 mb-3">{description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>

          {phase !== "completed" && remainingTime && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {remainingTime}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-3 flex justify-between">
        <div className="flex space-x-3 text-xs text-muted-foreground">
          {phase !== "presentation" && (
            <span className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              {argumentsCount} arguments
            </span>
          )}
          {phase === "voting" || phase === "completed" ? (
            <span className="flex items-center">
              <ThumbsUp className="h-3 w-3 mr-1" />
              {votesCount} votes
            </span>
          ) : null}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-primary/80 hover:text-primary"
          onClick={() => navigate(`/proposals/${id}`)}
        >
          View Proposal
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProposalCard;
