/**
 * Página de edición de propuestas ciudadanas
 * - Usa ProposalForm en modo edición
 * - Carga la propuesta desde la API/Supabase
 * - Muestra feedback de carga/error
 * - Redirige y notifica al editar correctamente
 */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProposalForm, { Proposal } from '@/components/proposals/ProposalForm';
import { useToast } from '@/hooks/use-toast';

const EditProposalPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Carga inicial de la propuesta
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    // TODO: Reemplazar por llamada real a Supabase/API
    fetch(`/api/proposals/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('No se pudo cargar la propuesta');
        const data = await res.json();
        setProposal(data);
      })
      .catch(() => setError('No se pudo cargar la propuesta'))
      .finally(() => setLoading(false));
  }, [id]);

  // Al editar con éxito, redirige y notifica
  const handleSuccess = (updated: Proposal) => {
    toast({
      title: 'Propuesta editada correctamente',
      description: 'Los cambios han sido guardados.',
    });
    navigate(`/proposals/${updated.id}`);
  };

  if (loading) return <div className="py-8 text-center">Cargando propuesta...</div>;
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;
  if (!proposal) return null;

  return (
    <div className="py-8">
      <ProposalForm proposal={proposal} onSuccess={handleSuccess} />
    </div>
  );
};

export default EditProposalPage;
