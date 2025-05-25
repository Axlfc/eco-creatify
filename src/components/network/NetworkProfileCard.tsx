import React from "react";
import { ForumUserProfile } from "@/types/forum";
import ReputationBadge from "../reputation/ReputationBadge";
import ReputationFeedback from "../reputation/ReputationFeedback";
import { useReputationContext } from '@/context/ReputationContext';

/**
 * Tarjeta de perfil para networking y ayuda.
 * Muestra reputación y acciones de conectar.
 * TODO: Integrar con sistema real de reputación y networking.
 */
const NetworkProfileCard: React.FC<{ profile: ForumUserProfile }> = ({ profile }) => {
  const reputationState = useReputationContext();
  const [showFeedback, setShowFeedback] = React.useState(false);

  React.useEffect(() => {
    if (reputationState?.showFeedback) {
      setShowFeedback(true);
      const timer = setTimeout(() => setShowFeedback(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [reputationState?.showFeedback]);

  return (
    <div className="border rounded p-3 bg-white flex flex-col items-center">
      <div className="text-lg font-semibold mb-1 flex items-center gap-2">
        {profile.displayName}
        {/* Badge de reputación junto al nombre */}
        <ReputationBadge userId={profile.username} />
      </div>
      {/* Feedback reputacional tras acción positiva */}
      {showFeedback && reputationState?.feedback && (
        <div className="transition-opacity duration-500 animate-fade-in-out">
          <ReputationFeedback
            type={reputationState.feedback.type}
            message={reputationState.feedback.message}
            points={reputationState.feedback.points}
          />
        </div>
      )}
      <div className="text-sm text-muted-foreground mb-2">@{profile.username}</div>
      <div className="mb-2">Reputación: <span className="font-semibold">{profile.reputation}</span></div>
      {/* TODO: Acciones de conectar, badges, historial */}
    </div>
  );
};

export default NetworkProfileCard;
