import React from "react";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { ProposalPhase } from "./ProposalCard";

interface ProposalHeaderProps {
  title: string;
  category: string;
  phase: ProposalPhase;
  consensusLevel?: number;
  onViewDetail: () => void;
}

const phaseConfig = {
  presentation: {
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "Presentation"
  },
  discussion: {
    color: "text-orange-600",
    bg: "bg-orange-50",
    label: "Discussion"
  },
  voting: {
    color: "text-purple-600",
    bg: "bg-purple-50",
    label: "Voting"
  },
  completed: {
    color: "text-green-600",
    bg: "bg-green-50",
    label: "Completed"
  }
};

const getConsensusColor = (level: number) => {
  if (level >= 80) return "text-green-600";
  if (level >= 60) return "text-blue-600";
  if (level >= 40) return "text-amber-600";
  return "text-red-600";
};

const ProposalHeader: React.FC<ProposalHeaderProps> = ({
  title,
  category,
  phase,
  consensusLevel = 0,
  onViewDetail
}) => {
  const config = phaseConfig[phase];

  return (
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline">{category}</Badge>
        <Badge className={`${config.bg} ${config.color} border-0`}>
          {config.label}
        </Badge>
        {phase === 'voting' && consensusLevel > 0 && (
          <Badge variant="outline" className={getConsensusColor(consensusLevel)}>
            {consensusLevel}% consensus
          </Badge>
        )}
      </div>
      <CardTitle 
        className="text-lg line-clamp-2 hover:text-primary cursor-pointer" 
        onClick={onViewDetail}
      >
        {title}
      </CardTitle>
    </div>
  );
};

export default ProposalHeader;