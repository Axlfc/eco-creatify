/**
 * ReputationContext.tsx
 *
 * Contexto global para gestionar el feedback reputacional en la app.
 * Permite a cualquier componente disparar feedback reputacional visual y mensajes.
 *
 * @example
 * const { triggerFeedback } = useReputationContext();
 * triggerFeedback({ type: 'positive', message: '¡Has ganado reputación!', points: 10 });
 */
import React, { createContext, useContext, useState, useCallback } from 'react';

export type ReputationFeedbackType = 'positive' | 'neutral' | 'negative';

export interface ReputationFeedbackState {
  showFeedback: boolean;
  type: ReputationFeedbackType;
  message: string;
  points?: number;
}

export interface ReputationContextType {
  feedback: Omit<ReputationFeedbackState, 'showFeedback'> | null;
  showFeedback: boolean;
  triggerFeedback: (args: { type: ReputationFeedbackType; message: string; points?: number }) => void;
}

const ReputationContext = createContext<ReputationContextType | undefined>(undefined);

export const ReputationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ReputationFeedbackState>({
    showFeedback: false,
    type: 'positive',
    message: '',
    points: undefined,
  });

  const triggerFeedback = useCallback(({ type, message, points }: { type: ReputationFeedbackType; message: string; points?: number }) => {
    setState({ showFeedback: true, type, message, points });
    setTimeout(() => {
      setState((prev) => ({ ...prev, showFeedback: false }));
    }, 3500);
  }, []);

  return (
    <ReputationContext.Provider
      value={{
        feedback: state.showFeedback ? { type: state.type, message: state.message, points: state.points } : null,
        showFeedback: state.showFeedback,
        triggerFeedback,
      }}
    >
      {children}
    </ReputationContext.Provider>
  );
};

export function useReputationContext(): ReputationContextType {
  const ctx = useContext(ReputationContext);
  if (!ctx) throw new Error('useReputationContext debe usarse dentro de ReputationProvider');
  return ctx;
}
