import React from "react";
import { useParams } from "react-router-dom";
import { useUserProfile } from "@/hooks/useForumThreads";
import ReputationBadge from "../components/reputation/ReputationBadge";
import ReputationFeedback from "../components/reputation/ReputationFeedback";
import { useReputationContext } from '@/context/ReputationContext';

/**
 * Página de perfil público de usuario.
 * Muestra reputación, historial y red.
 * TODO: Integrar con sistema real de reputación y notificaciones.
 */
const UserProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { data: profile, isLoading } = useUserProfile(username || "");
  const reputationState = useReputationContext();
  const [showFeedback, setShowFeedback] = React.useState(false);

  React.useEffect(() => {
    if (reputationState?.showFeedback) {
      setShowFeedback(true);
      const timer = setTimeout(() => setShowFeedback(false), 3500); // 3.5s
      return () => clearTimeout(timer);
    }
  }, [reputationState?.showFeedback]);

  if (isLoading) return <div>Cargando perfil...</div>;
  if (!profile) return <div>Perfil no encontrado</div>;

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
        Perfil de {profile.displayName}
        <ReputationBadge userId={profile.username} />
      </h1>
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
      <div className="mb-4">
        Reputación:{" "}
        <span className="font-semibold">{profile.reputation}</span>
      </div>
      {/* TODO: Mostrar historial de ayuda, respuestas y propinas */}
      {/* TODO: Integrar notificaciones de cambios de reputación */}
      {/* TODO: Mostrar red de contactos y badges */}
    </div>
  );
};

export default UserProfilePage;
