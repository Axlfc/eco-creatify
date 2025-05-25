/**
 * ReputationFeedback.tsx
 *
 * Muestra feedback inmediato al usuario cuando gana reputación por acciones positivas.
 * Integra el contexto/hook global de reputación (mock por ahora).
 * Puede usarse tras ayudar, recibir propinas, responder, moderar, etc.
 *
 * @param {string} type - Tipo de acción que genera feedback ("tip", "reply", "moderation", etc.).
 * @param {number} amount - Cantidad de reputación ganada.
 *
 * @todo Integrar con API real de reputación y feedback externo.
 * @todo Migrar lógica legacy de feedback reputacional a este componente y eliminar duplicidad progresivamente.
 */
import React from 'react';

interface ReputationFeedbackProps {
  type: 'tip' | 'reply' | 'moderation' | 'other';
  amount: number;
}

const typeMessages: Record<string, string> = {
  tip: '¡Has recibido una propina! 🎉',
  reply: '¡Tu respuesta ha sido valorada! 💬',
  moderation: '¡Gracias por moderar la comunidad! 🛡️',
  other: '¡Has ganado reputación! ⭐',
};

const ReputationFeedback: React.FC<ReputationFeedbackProps> = ({ type, amount }) => {
  if (!amount) return null;
  return (
    <div className="bg-green-100 border border-green-300 text-green-800 px-3 py-2 rounded mb-2 text-sm flex items-center gap-2">
      <span className="font-bold">+{amount}</span>
      <span>{typeMessages[type] || typeMessages.other}</span>
    </div>
  );
};

export default ReputationFeedback;
// TODO: Usar este componente tras acciones positivas en comentarios, propuestas, moderación, etc.
// TODO: Migrar lógica legacy de feedback reputacional a este componente y eliminar duplicidad progresivamente.
