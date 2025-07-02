import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";

interface ProposalMetaProps {
  author: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

const ProposalMeta: React.FC<ProposalMetaProps> = ({
  author,
  createdAt,
  updatedAt,
  tags = []
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
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
    </>
  );
};

export default ProposalMeta;