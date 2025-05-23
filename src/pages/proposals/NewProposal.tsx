/**
 * Página de creación de propuestas ciudadanas
 * - Usa ProposalForm en modo creación
 * - Redirige y notifica al crear correctamente
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProposalForm, { Proposal } from '@/components/proposals/ProposalForm';
import { useToast } from '@/hooks/use-toast';

const NewProposalPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Al crear con éxito, redirige y notifica
  const handleSuccess = (proposal: Proposal) => {
    toast({
      title: 'Propuesta creada correctamente',
      description: 'Tu propuesta ha sido registrada.',
    });
    navigate(`/proposals/${proposal.id}`);
  };

  return (
    <div className="py-8">
      <ProposalForm onSuccess={handleSuccess} />
    </div>
  );
};

export default NewProposalPage;
