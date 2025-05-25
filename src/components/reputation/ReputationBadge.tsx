/**
 * ReputationBadge.tsx
 *
 * Muestra la puntuación de reputación y los badges del usuario.
 * Integra el contexto/hook global de reputación (mock por ahora).
 * Puede usarse en perfiles, tarjetas de usuario y listados de propuestas/comentarios.
 *
 * @param {string} userId - ID del usuario a mostrar reputación.
 *
 * @todo Integrar con API real de reputación y Web3.
 * @todo Migrar lógica legacy de visualización de reputación a este componente y eliminar duplicidad progresivamente.
 */
import React from 'react';
// TODO: Importar useReputation o ReputationContext cuando esté implementado

// Mock temporal de reputación
const mockReputation = {
  score: 120,
  badges: ['Colaborador', 'Moderador'],
};

interface ReputationBadgeProps {
  userId: string;
}

const ReputationBadge: React.FC<ReputationBadgeProps> = ({ userId }) => {
  // const { reputation } = useReputation(userId); // TODO: Descomentar cuando esté implementado
  const reputation = mockReputation;

  return (
    <div className="flex items-center gap-2">
      <span className="text-blue-700 font-bold">{reputation.score}</span>
      {reputation.badges.map((badge) => (
        <span key={badge} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
          {badge}
        </span>
      ))}
    </div>
  );
};

export default ReputationBadge;
// TODO: Usar este componente en UserProfilePage, NetworkProfileCard y listados de propuestas/comentarios.
// TODO: Migrar lógica legacy de reputación a este componente y eliminar duplicidad progresivamente.
