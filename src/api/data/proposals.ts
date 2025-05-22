// Almacenamiento en memoria para propuestas
export interface Proposal {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

export const proposals: Proposal[] = [
  {
    id: '1',
    title: 'Propuesta de ejemplo',
    description: 'Descripción de la propuesta de ejemplo',
    createdBy: 'user1',
    createdAt: new Date().toISOString(),
  },
];

// Almacenamiento en memoria para votos
export interface Vote {
  proposalId: string;
  userId: string;
  value: 'yes' | 'no';
}

export const votes: Vote[] = [];

export function getProposalResults(proposalId: string) {
  const proposalVotes = votes.filter(v => v.proposalId === proposalId);
  const yes = proposalVotes.filter(v => v.value === 'yes').length;
  const no = proposalVotes.filter(v => v.value === 'no').length;
  return { yes, no, total: proposalVotes.length };
}
