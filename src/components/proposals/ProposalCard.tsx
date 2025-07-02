
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import ProposalHeader from "./ProposalHeader";
import ProposalMeta from "./ProposalMeta";
import ProposalStats from "./ProposalStats";
import ProposalVoting from "./ProposalVoting";
import ProposalActions from "./ProposalActions";

export type ProposalPhase = "presentation" | "discussion" | "voting" | "completed";

export interface ProposalCardProps {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  phase: ProposalPhase;
  category: string;
  tags?: string[];
  votes?: {
    for: number;
    against: number;
    abstain: number;
  };
  comments?: number;
  views?: number;
  consensusLevel?: number;
  currentUser?: any; // Para control de edición
}

const phaseConfig = {
  presentation: {
    description: "Being presented to the community"
  },
  discussion: {
    description: "Open for community discussion"
  },
  voting: {
    description: "Community voting in progress"
  },
  completed: {
    description: "Voting completed"
  }
};

const ProposalCard: React.FC<ProposalCardProps> = ({
  id,
  title,
  description,
  author,
  createdAt,
  updatedAt,
  phase,
  category,
  tags = [],
  votes = { for: 0, against: 0, abstain: 0 },
  comments = 0,
  views = 0,
  consensusLevel = 0,
  currentUser
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const config = phaseConfig[phase];
  const isAuthor = currentUser && (currentUser.id === author || currentUser.username === author);
  const totalVotes = votes.for + votes.against + votes.abstain;

  const handleViewDetail = () => {
    // TODO: Implementar vista de detalle de propuesta
    // navigate(`/proposals/${id}`);
    toast({
      title: "Vista de detalle",
      description: `Vista detallada de "${title}" estará disponible próximamente`,
      variant: "default"
    });
  };

  const handleEdit = () => {
    if (!isAuthenticated) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para editar propuestas",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    if (!isAuthor) {
      toast({
        title: "Sin permisos",
        description: "Solo el autor puede editar esta propuesta",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implementar edición de propuesta
    toast({
      title: "Editar propuesta",
      description: "Editor de propuestas estará disponible próximamente",
      variant: "default"
    });
  };

  const handleDelete = () => {
    if (!isAuthenticated) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para eliminar propuestas",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    if (!isAuthor) {
      toast({
        title: "Sin permisos",
        description: "Solo el autor puede eliminar esta propuesta",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implementar confirmación y eliminación
    toast({
      title: "Eliminar propuesta",
      description: "Funcionalidad de eliminación estará disponible próximamente",
      variant: "default"
    });
  };

  const handleVote = (voteType: 'for' | 'against' | 'abstain') => {
    if (!isAuthenticated) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para votar",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    if (phase !== 'voting') {
      toast({
        title: "Votación no disponible",
        description: "Esta propuesta no está en fase de votación",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implementar sistema de votación real
    toast({
      title: "Voto registrado",
      description: `Tu voto "${voteType}" ha sido registrado`,
      variant: "default"
    });
  };


  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <ProposalHeader
            title={title}
            category={category}
            phase={phase}
            consensusLevel={consensusLevel}
            onViewDetail={handleViewDetail}
          />
          
          <ProposalActions
            isAuthor={isAuthor}
            phase={phase}
            phaseDescription={config.description}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetail={handleViewDetail}
          />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {description}
        </p>
        
        <ProposalMeta
          author={author}
          createdAt={createdAt}
          updatedAt={updatedAt}
          tags={tags}
        />
        
        <ProposalStats
          comments={comments}
          views={views}
          totalVotes={totalVotes}
        />
        
        <ProposalVoting
          phase={phase}
          votes={votes}
          isAuthenticated={isAuthenticated}
          onVote={handleVote}
        />
      </CardContent>
    </Card>
  );
};

export default ProposalCard;
