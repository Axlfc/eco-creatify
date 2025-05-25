/**
 * CommentThread.tsx
 *
 * Renderiza el árbol de comentarios anidados para una propuesta.
 * - Usa el hook useComments para obtener y mutar comentarios.
 * - Permite respuestas en múltiples niveles (soporte anidado).
 * - Integra feedback visual y soporte para acciones de moderación (futuro).
 *
 * @param {string} proposalId - ID de la propuesta cuyos comentarios se muestran.
 *
 * @todo Integrar con backend real, Web3 y feedback de reputación.
 * @todo Migrar lógica legacy de renderizado de comentarios a este componente y eliminar duplicidad progresivamente.
 */
import React, { useState } from 'react';
// TODO: Importar useComments cuando esté implementado
// import { useComments } from '../../hooks/useComments';
import CommentForm from './CommentForm';
import ReputationBadge from "../reputation/ReputationBadge";
import ReputationFeedback from "../reputation/ReputationFeedback";
import { useReputationContext } from '@/context/ReputationContext';

// Mock temporal de comentarios anidados
const mockComments = [
  {
    id: 'c1',
    author: 'Usuario1',
    content: '¡Gran propuesta! ¿Cómo se financiaría?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    children: [
      {
        id: 'c2',
        author: 'Proponente',
        content: 'Gracias, la idea es buscar fondos municipales y donaciones.',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        children: [],
      },
    ],
  },
  {
    id: 'c3',
    author: 'Usuario2',
    content: '¿Se ha considerado el mantenimiento a largo plazo?',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    children: [],
  },
];

interface CommentThreadProps {
  proposalId: string;
}

const CommentThread: React.FC<CommentThreadProps> = ({ proposalId }) => {
  // const { comments, loading, error } = useComments(proposalId); // TODO: Descomentar cuando esté implementado
  // Mock temporal
  const [comments, setComments] = useState(mockComments);
  const loading = false;
  const error = null;

  const reputationState = useReputationContext();
  const [showFeedback, setShowFeedback] = React.useState(false);

  React.useEffect(() => {
    if (reputationState?.showFeedback) {
      setShowFeedback(true);
      const timer = setTimeout(() => setShowFeedback(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [reputationState?.showFeedback]);

  // Renderiza un comentario y sus hijos recursivamente
  const renderComment = (comment: any, level = 0) => (
    <div key={comment.id} className={`ml-${level * 4} mb-4`}>
      <div className="border rounded p-2 bg-white">
        <div className="text-sm font-semibold flex items-center gap-2">
          {comment.author}
          {/* Badge de reputación junto al autor */}
          <ReputationBadge userId={comment.author} />
        </div>
        <div className="text-gray-800 mb-1">{comment.content}</div>
        <div className="text-xs text-gray-500 mb-1">{new Date(comment.createdAt).toLocaleString()}</div>
        {/* Feedback reputacional tras interacción positiva (mock) */}
        {/* TODO: Mostrar ReputationFeedback tras acciones reales (responder, votar, etc.) */}
        {/* <ReputationFeedback type="reply" amount={1} /> Ejemplo de uso */}
        {/* TODO: Integrar feedback de reputación, acciones de moderación, etc. */}
        <CommentForm proposalId={proposalId} parentId={comment.id} onSuccess={() => { /* TODO: Refrescar comentarios */ }} />
      </div>
      {comment.children && comment.children.length > 0 && (
        <div className="ml-4">
          {comment.children.map((child: any) => renderComment(child, level + 1))}
        </div>
      )}
    </div>
  );

  if (loading) return <div>Cargando comentarios...</div>;
  if (error) return <div className="text-red-600">Error al cargar comentarios.</div>;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-2">Comentarios</h3>
      {/* Feedback reputacional tras acción positiva */}
      {showFeedback && reputationState?.feedback && (
        <div className="transition-opacity duration-500 animate-fade-in-out mb-2">
          <ReputationFeedback
            type={reputationState.feedback.type}
            message={reputationState.feedback.message}
            points={reputationState.feedback.points}
          />
        </div>
      )}
      <CommentForm proposalId={proposalId} onSuccess={() => { /* TODO: Refrescar comentarios */ }} />
      <div className="mt-4">
        {comments.length === 0 ? (
          <div>No hay comentarios aún. ¡Sé el primero en opinar!</div>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  );
};

export default CommentThread;
// TODO: Migrar el legacy de renderizado de comentarios a este componente y eliminar duplicidad progresivamente.
