/**
 * CommentForm.tsx
 *
 * Formulario para crear y responder comentarios en propuestas.
 * - Permite crear comentarios raíz o respuestas a otros comentarios (soporte anidado).
 * - Integra validación básica y feedback visual.
 * - Usa el hook useComments para manejar el submit y la lógica de guardado.
 * - Integra notificaciones y feedback de reputación (cuando estén disponibles).
 *
 * @param {string} proposalId - ID de la propuesta a la que pertenece el comentario.
 * @param {string} [parentId] - ID del comentario padre (si es respuesta).
 * @param {() => void} [onSuccess] - Callback tras guardar correctamente.
 *
 * @todo Integrar con backend real, Web3 y feedback de reputación.
 * @todo Migrar lógica legacy de comentarios a este componente y eliminar duplicidad progresivamente.
 */
import React, { useState, useContext } from 'react';
// TODO: Importar useComments cuando esté implementado
// import { useComments } from '../../hooks/useComments';
import { NotificationContext } from '../../context/NotificationContext';

interface CommentFormProps {
  proposalId: string;
  parentId?: string;
  onSuccess?: () => void;
}

const MIN_COMMENT = 5;
const MAX_COMMENT = 1000;

const CommentForm: React.FC<CommentFormProps> = ({ proposalId, parentId, onSuccess }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const { createComment } = useComments(); // TODO: Descomentar cuando esté implementado
  const notificationCtx = useContext(NotificationContext);

  const validate = () => {
    if (!content.trim()) return 'El comentario no puede estar vacío';
    if (content.length < MIN_COMMENT) return `Mínimo ${MIN_COMMENT} caracteres`;
    if (content.length > MAX_COMMENT) return `Máximo ${MAX_COMMENT} caracteres`;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsSubmitting(true);
    try {
      // TODO: Llamar a createComment({ proposalId, parentId, content })
      // await createComment({ proposalId, parentId, content });
      notificationCtx?.notify({ type: 'success', message: 'Comentario publicado (mock)' });
      setContent('');
      onSuccess?.();
      // TODO: Integrar feedback de reputación y notificaciones reales
    } catch (err) {
      setError('Error al publicar el comentario');
      notificationCtx?.notify({ type: 'error', message: 'Error al publicar el comentario' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-2">
      <textarea
        className="w-full border rounded px-2 py-1 min-h-[60px]"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Escribe tu comentario..."
        disabled={isSubmitting}
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : parentId ? 'Responder' : 'Comentar'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
// TODO: Migrar el legacy de formularios de comentarios a este componente y eliminar duplicidad progresivamente.
