import { Proposal } from '@/components/proposals/ProposalForm';

// Validación reutilizable para frontend y backend (simulada)
export function validateProposal(proposal: Proposal) {
  const errors: { title?: string; description?: string; category?: string } = {};
  let isValid = true;
  if (!proposal.title || proposal.title.trim().length < 10) {
    errors.title = 'El título debe tener al menos 10 caracteres';
    isValid = false;
  }
  if (proposal.title && proposal.title.length > 120) {
    errors.title = 'El título no puede superar 120 caracteres';
    isValid = false;
  }
  if (!proposal.description || proposal.description.trim().length < 50) {
    errors.description = 'La descripción debe tener al menos 50 caracteres';
    isValid = false;
  }
  if (proposal.description && proposal.description.length > 2000) {
    errors.description = 'La descripción no puede superar 2000 caracteres';
    isValid = false;
  }
  if (!proposal.category) {
    errors.category = 'Selecciona una categoría';
    isValid = false;
  }
  return { isValid, errors };
}
