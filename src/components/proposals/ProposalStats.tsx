import React from "react";
import { MessageSquare, Eye, Vote } from "lucide-react";

interface ProposalStatsProps {
  comments: number;
  views: number;
  totalVotes: number;
}

const ProposalStats: React.FC<ProposalStatsProps> = ({
  comments,
  views,
  totalVotes
}) => {
  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          {comments} comments
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {views} views
        </span>
        {totalVotes > 0 && (
          <span className="flex items-center gap-1">
            <Vote className="h-3 w-3" />
            {totalVotes} votes
          </span>
        )}
      </div>
    </div>
  );
};

export default ProposalStats;