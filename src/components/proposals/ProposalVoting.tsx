import React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { ProposalPhase } from "./ProposalCard";

interface ProposalVotingProps {
  phase: ProposalPhase;
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
  isAuthenticated: boolean;
  onVote: (voteType: 'for' | 'against' | 'abstain') => void;
}

const ProposalVoting: React.FC<ProposalVotingProps> = ({
  phase,
  votes,
  isAuthenticated,
  onVote
}) => {
  const totalVotes = votes.for + votes.against + votes.abstain;

  if (phase === 'voting') {
    return (
      <div className="flex items-center gap-2 mb-4 p-3 bg-muted/30 rounded-md">
        <span className="text-sm font-medium mr-2">Vote:</span>
        <Button
          size="sm"
          variant="outline"
          className="text-green-600 hover:bg-green-50"
          onClick={() => onVote('for')}
          disabled={!isAuthenticated}
          title={!isAuthenticated ? "Inicia sesión para votar" : "Votar a favor"}
        >
          <ThumbsUp className="h-3 w-3 mr-1" />
          For ({votes.for})
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 hover:bg-red-50"
          onClick={() => onVote('against')}
          disabled={!isAuthenticated}
          title={!isAuthenticated ? "Inicia sesión para votar" : "Votar en contra"}
        >
          <ThumbsDown className="h-3 w-3 mr-1" />
          Against ({votes.against})
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onVote('abstain')}
          disabled={!isAuthenticated}
          title={!isAuthenticated ? "Inicia sesión para votar" : "Abstención"}
        >
          Abstain ({votes.abstain})
        </Button>
      </div>
    );
  }

  if (phase === 'completed' && totalVotes > 0) {
    return (
      <div className="mb-4 p-3 bg-muted/30 rounded-md">
        <div className="text-sm font-medium mb-2">Final Results:</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-semibold text-green-600">{votes.for}</div>
            <div className="text-muted-foreground">For</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-red-600">{votes.against}</div>
            <div className="text-muted-foreground">Against</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-600">{votes.abstain}</div>
            <div className="text-muted-foreground">Abstain</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ProposalVoting;