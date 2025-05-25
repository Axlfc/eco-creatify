import React from "react";
import { useParams } from "react-router-dom";
import { useUserProfile } from "@/hooks/useForumThreads";

/**
 * Página de perfil público de usuario.
 * Muestra reputación, historial y red.
 * TODO: Integrar con sistema real de reputación y notificaciones.
 */
const UserProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { data: profile, isLoading } = useUserProfile(username || "");

  if (isLoading) return <div>Cargando perfil...</div>;
  if (!profile) return <div>Perfil no encontrado</div>;

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-2">Perfil de {profile.displayName}</h1>
      <div className="mb-4">Reputación: <span className="font-semibold">{profile.reputation}</span></div>
      {/* TODO: Mostrar historial de ayuda, respuestas y propinas */}
      {/* TODO: Integrar notificaciones de cambios de reputación */}
      {/* TODO: Mostrar red de contactos y badges */}
    </div>
  );
};

export default UserProfilePage;
