/**
 * ProposalHistory - Representa un cambio en una propuesta
 */
export interface ProposalHistory {
  id: string; // UUID del cambio
  proposalId: string;
  editedAt: string; // ISO date
  editedBy: string; // userId
  changeSummary: string; // Breve descripción del cambio
  diff?: string; // Opcional: diff textual o JSON
}

/**
 * Proposal extendida con historial
 */
export interface Proposal {
  id: string;
  title: string;
  description: string;
  category?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  history?: ProposalHistory[];
}
