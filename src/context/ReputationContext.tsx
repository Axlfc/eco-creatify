
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface ReputationFeedback {
  type: 'tip' | 'reply' | 'moderation' | 'other';
  message: string;
  points: number;
}

interface ReputationContextType {
  showFeedback: boolean;
  feedback: ReputationFeedback | null;
  triggerFeedback: (feedback: ReputationFeedback) => void;
}

const ReputationContext = createContext<ReputationContextType | null>(null);

interface ReputationProviderProps {
  children: ReactNode;
}

export const ReputationProvider: React.FC<ReputationProviderProps> = ({ children }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<ReputationFeedback | null>(null);

  const triggerFeedback = (newFeedback: ReputationFeedback) => {
    setFeedback(newFeedback);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);
  };

  return (
    <ReputationContext.Provider value={{ showFeedback, feedback, triggerFeedback }}>
      {children}
    </ReputationContext.Provider>
  );
};

export const useReputationContext = () => {
  const context = useContext(ReputationContext);
  return context; // Allow null context for optional usage
};
