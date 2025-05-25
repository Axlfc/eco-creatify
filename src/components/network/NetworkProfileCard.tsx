import React from "react";
import { ForumUserProfile } from "@/types/forum";

/**
 * Tarjeta de perfil para networking y ayuda.
 * Muestra reputación y acciones de conectar.
 * TODO: Integrar con sistema real de reputación y networking.
 */
const NetworkProfileCard: React.FC<{ profile: ForumUserProfile }> = ({ profile }) => {
  return (
    <div className="border rounded p-3 bg-white flex flex-col items-center">
      <div className="text-lg font-semibold mb-1">{profile.displayName}</div>
      <div className="text-sm text-muted-foreground mb-2">@{profile.username}</div>
      <div className="mb-2">Reputación: <span className="font-semibold">{profile.reputation}</span></div>
      {/* TODO: Acciones de conectar, badges, historial */}
    </div>
  );
};

export default NetworkProfileCard;
