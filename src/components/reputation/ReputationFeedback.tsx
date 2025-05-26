
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Award, Trophy } from 'lucide-react';

export interface ReputationFeedbackProps {
  type: 'tip' | 'reply' | 'moderation' | 'other';
  text: string;
  points: number;
}

const ReputationFeedback: React.FC<ReputationFeedbackProps> = ({ type, text, points }) => {
  const getIcon = () => {
    switch (type) {
      case 'tip':
        return <Star className="h-4 w-4" />;
      case 'reply':
        return <CheckCircle className="h-4 w-4" />;
      case 'moderation':
        return <Award className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
      {getIcon()}
      <span className="text-sm text-green-800">{text}</span>
      <Badge variant="secondary" className="ml-auto">
        +{points} puntos
      </Badge>
    </div>
  );
};

export default ReputationFeedback;
