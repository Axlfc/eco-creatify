
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar,
  Clock,
  User,
  MessageSquare,
  Vote,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

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
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "Presentation",
    description: "Being presented to the community"
  },
  discussion: {
    color: "text-orange-600",
    bg: "bg-orange-50",
    label: "Discussion",
    description: "Open for community discussion"
  },
  voting: {
    color: "text-purple-600",
    bg: "bg-purple-50",
    label: "Voting",
    description: "Community voting in progress"
  },
  completed: {
    color: "text-green-600",
    bg: "bg-green-50",
    label: "Completed",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getConsensusColor = (level: number) => {
    if (level >= 80) return "text-green-600";
    if (level >= 60) return "text-blue-600";
    if (level >= 40) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
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
            <CardTitle className="text-lg line-clamp-2 hover:text-primary cursor-pointer" onClick={handleViewDetail}>
              {title}
            </CardTitle>
          </div>
          
          {isAuthor && (
            <div className="flex gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                title="Editar propuesta"
                disabled={phase === 'completed'}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                title="Eliminar propuesta"
                disabled={phase === 'voting' || phase === 'completed'}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {description}
        </p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(createdAt)}
            </span>
            {updatedAt !== createdAt && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Updated {formatDate(updatedAt)}
              </span>
            )}
          </div>
        </div>
        
        {/* Stats */}
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
        
        {/* Voting section for voting phase */}
        {phase === 'voting' && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-muted/30 rounded-md">
            <span className="text-sm font-medium mr-2">Vote:</span>
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 hover:bg-green-50"
              onClick={() => handleVote('for')}
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
              onClick={() => handleVote('against')}
              disabled={!isAuthenticated}
              title={!isAuthenticated ? "Inicia sesión para votar" : "Votar en contra"}
            >
              <ThumbsDown className="h-3 w-3 mr-1" />
              Against ({votes.against})
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleVote('abstain')}
              disabled={!isAuthenticated}
              title={!isAuthenticated ? "Inicia sesión para votar" : "Abstención"}
            >
              Abstain ({votes.abstain})
            </Button>
          </div>
        )}
        
        {/* Completed phase results */}
        {phase === 'completed' && totalVotes > 0 && (
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
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {config.description}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetail}
            className="flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            View Detail
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposalCard;
