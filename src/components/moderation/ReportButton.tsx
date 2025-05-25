/**
 * ReportButton.tsx
 *
 * Botón para reportar comentarios, propuestas o contenido del foro.
 * Integra el hook/contexto de moderación (useModeration o ModerationContext).
 * Permite al usuario reportar contenido por motivo, con feedback visual.
 *
 * @param {string} targetId - ID del contenido a reportar (comentario, propuesta, etc.).
 * @param {"comment"|"proposal"|"thread"} targetType - Tipo de contenido a reportar.
 *
 * @todo Integrar con API real de moderación y AutoMod.
 * @todo Migrar lógica legacy de reportes a este componente y eliminar duplicidad progresivamente.
 */
import React, { useState, useContext } from 'react';
// TODO: Importar useModeration o ModerationContext cuando esté implementado
// import { useModeration } from '../../hooks/useModeration';

interface ReportButtonProps {
  targetId: string;
  targetType: 'comment' | 'proposal' | 'thread';
}

const ReportButton: React.FC<ReportButtonProps> = ({ targetId, targetType }) => {
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  // const { reportContent } = useModeration(); // TODO: Descomentar cuando esté implementado

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: Llamar a reportContent({ targetId, targetType, reason })
      // await reportContent({ targetId, targetType, reason });
      setFeedback('Reporte enviado (mock)');
      setShowForm(false);
      setReason('');
      // TODO: Integrar feedback real y notificaciones
    } catch (err) {
      setFeedback('Error al enviar el reporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="inline-block ml-2">
      <button
        className="text-xs text-red-600 underline hover:text-red-800"
        onClick={() => setShowForm(!showForm)}
        type="button"
      >
        Reportar
      </button>
      {showForm && (
        <form onSubmit={handleReport} className="bg-white border rounded p-2 mt-2 shadow-md z-10">
          <label className="block text-xs mb-1">Motivo del reporte:</label>
          <textarea
            className="w-full border rounded px-2 py-1 text-xs"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Describe el motivo..."
            required
            minLength={5}
          />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="bg-red-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
            <button
              type="button"
              className="text-xs text-gray-500 underline"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
      {feedback && <div className="text-xs text-green-600 mt-1">{feedback}</div>}
    </div>
  );
};

export default ReportButton;
// TODO: Integrar este botón en comentarios, propuestas y foro.
// TODO: Migrar lógica legacy de reportes a este componente y eliminar duplicidad progresivamente.
