
export interface MockProposal {
  id: string;
  title: string;
  description: string;
  category: string;
  phase: string;
  created_at: string;
  created_by: string;
  user_id: string;
}

export const mockProposals: MockProposal[] = [
  {
    id: '1',
    title: 'Implementar jardín comunitario en el distrito central',
    description: 'Esta propuesta sugiere crear un jardín comunitario...',
    category: 'Environment',
    phase: 'discussion',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    created_by: 'user1',
    user_id: 'user1',
  },
  {
    id: '2',
    title: 'Programa de mentoría tecnológica para jóvenes',
    description: 'Esta propuesta busca establecer un programa de mentoría...',
    category: 'Education',
    phase: 'voting',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    created_by: 'user2',
    user_id: 'user2',
  },
];

export const fetchMockProposals = async ({
  page,
  limit,
  search,
  category,
  phase,
}: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  phase?: string;
}) => {
  let filtered = mockProposals;

  if (search && search.trim()) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category && category !== 'All Categories') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (phase && phase !== 'all') {
    filtered = filtered.filter(p => p.phase === phase);
  }

  const from = (page - 1) * limit;
  const to = from + limit;
  const data = filtered.slice(from, to);

  return { data, count: filtered.length };
};
