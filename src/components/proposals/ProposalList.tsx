/**
 * ProposalList.tsx
 *
 * Listado de propuestas ciudadanas con búsqueda y filtros básicos.
 * Integra el hook useProposals para obtener los datos.
 * Prepara la navegación al detalle de cada propuesta.
 *
 * @todo Integrar paginación, filtros avanzados y búsqueda real.
 * @todo Migrar lógica legacy de listados de propuestas a este componente y eliminar duplicidad progresivamente.
 */
import React from "react";
// TODO: Importar tipo Proposal desde types/proposal cuando esté disponible
// TODO: Importar useProposals cuando esté implementado
// import { useProposals } from '../../hooks/useProposals';
import { Link } from "react-router-dom";
import ReputationBadge from "../reputation/ReputationBadge";
import ReputationFeedback from "../reputation/ReputationFeedback";
import { useReputationContext } from '@/context/ReputationContext';

const mockProposals = [
  {
    id: "1",
    title: "Implementar jardín comunitario en el distrito central",
    author: "GreenInitiative",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    content: "Esta propuesta sugiere crear un jardín comunitario...",
  },
  {
    id: "2",
    title: "Programa de mentoría tecnológica para jóvenes",
    author: "TechForAll",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    content: "Esta propuesta busca establecer un programa de mentoría...",
  },
];

const ProposalList: React.FC = () => {
  // const { proposals, loading, error } = useProposals(); // TODO: Descomentar cuando useProposals esté listo
  // Mock temporal
  const proposals = mockProposals;
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

  if (loading) return <div>Cargando propuestas...</div>;
  if (error) return <div className="text-red-600">Error al cargar propuestas.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Propuestas ciudadanas</h2>
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
      {proposals.length === 0 ? (
        <div>No hay propuestas aún.</div>
      ) : (
        <ul className="divide-y">
          {proposals.map((proposal) => (
            <li key={proposal.id} className="py-3">
              <Link
                to={`/proposals/${proposal.id}`}
                className="text-lg font-semibold hover:underline"
              >
                {proposal.title}
              </Link>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                Por: {proposal.author}
                {/* Badge de reputación junto al autor */}
                <ReputationBadge userId={proposal.author} />
                | {new Date(proposal.createdAt).toLocaleDateString()}
              </div>
              <div className="line-clamp-2 text-gray-800">{proposal.content}</div>
              {/* TODO: Mostrar tags, estado, reputación del autor, etc. */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProposalList;
// TODO: Migrar el legacy de listados de propuestas a este componente y eliminar duplicidad progresivamente.
