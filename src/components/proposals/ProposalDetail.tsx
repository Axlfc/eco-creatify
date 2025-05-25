/**
 * ProposalDetail.tsx
 *
 * Vista de detalle de una propuesta, muestra información completa, historial y debate.
 * Integra el sistema de comentarios anidados y el historial de cambios.
 *
 * @todo Integrar feedback de reputación, historial real y acciones de moderación.
 * @todo Migrar lógica legacy de detalle de propuestas a este componente y eliminar duplicidad progresivamente.
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Info,
  AlertTriangle,
  CheckCircle,
  User,
  MessageSquare,
} from "lucide-react";
import CommentThread from '../comments/CommentThread';
import { fetchProposalHistory, ProposalHistory } from '@/lib/api/proposals';

// TODO: Importar useProposals y useComments cuando estén implementados
// import { useProposals } from '../../hooks/useProposals';
// import { useComments } from '../../hooks/useComments';
// TODO: Importar tipo Proposal desde types/proposal cuando esté disponible
import { useParams } from 'react-router-dom';
// Mock temporal para propuesta
const mockProposal = {
  id: "1",
  title: "Implementar jardín comunitario en el distrito central",
  author: "GreenInitiative",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  content: "Esta propuesta sugiere crear un jardín comunitario...",
};

const ProposalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const { getProposalById, loading, error } = useProposals(); // TODO: Descomentar cuando useProposals esté listo
  // const proposal = getProposalById(id);
  // Mock temporal
  const proposal = mockProposal;
  const loading = false;
  const error = null;

  // --- HISTORIAL DE CAMBIOS ---
  const [history, setHistory] = useState<ProposalHistory[]>([]);
  useEffect(() => {
    if (!proposal?.id) return;
    fetchProposalHistory(proposal.id)
      .then(setHistory)
      .catch(() => setHistory([]));
  }, [proposal?.id]);

  if (loading) return <div>Cargando propuesta...</div>;
  if (error || !proposal) return <div className="text-red-600">Propuesta no encontrada.</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{proposal.title}</h1>
      <div className="text-gray-600 text-sm">
        Por: {proposal.author} | {new Date(proposal.createdAt).toLocaleString()}
      </div>
      <div className="prose max-w-none">{proposal.content}</div>
      {/* TODO: Mostrar historial de cambios, reputación del autor, tags, estado, etc. */}
      <section>
        <h2 className="text-xl font-semibold mt-8 mb-2">Debate y comentarios</h2>
        <CommentThread proposalId={proposal.id} />
        {/* TODO: Eliminar renderizado legacy de comentarios cuando la migración esté completa */}
      </section>
      {/* Sección de historial de cambios */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Historial de ediciones</h2>
        {history.length === 0 ? (
          <div className="text-gray-500 text-sm">Sin ediciones registradas.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {history.map(h => (
              <li key={h.id} className="py-2 text-sm flex flex-col md:flex-row md:items-center md:gap-4">
                <span className="font-mono text-xs text-gray-400">{new Date(h.editedAt).toLocaleString()}</span>
                <span className="text-gray-700">{h.changeSummary}</span>
                <span className="text-gray-500 ml-auto">por {h.editedBy}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      {/* TODO: Acciones de moderación (reportar, bloquear, etc.) */}
    </div>
  );
};

export default ProposalDetail;
// TODO: Migrar el legacy de detalle de propuestas a este componente y eliminar duplicidad progresivamente.
// TODO: Llamar a fetchProposalHistory tras cada edición exitosa para refrescar el historial.
// TODO: Validar permisos de visualización del historial si es necesario.
