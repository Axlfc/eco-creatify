import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { ProposalPhase } from "./ProposalCard";

interface ProposalActionsProps {
  isAuthor: boolean;
  phase: ProposalPhase;
  phaseDescription: string;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetail: () => void;
}

const ProposalActions: React.FC<ProposalActionsProps> = ({
  isAuthor,
  phase,
  phaseDescription,
  onEdit,
  onDelete,
  onViewDetail
}) => {
  return (
    <>
      {isAuthor && (
        <div className="flex gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            title="Editar propuesta"
            disabled={phase === 'completed'}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            title="Eliminar propuesta"
            disabled={phase === 'voting' || phase === 'completed'}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-muted-foreground">
          {phaseDescription}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetail}
          className="flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          View Detail
        </Button>
      </div>
    </>
  );
};

export default ProposalActions;