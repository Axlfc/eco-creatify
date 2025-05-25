/**
 * lib/api/proposals.ts
 *
 * Funciones para interactuar con la API backend de propuestas.
 */

export interface ProposalHistory {
  id: string; // UUID del cambio
  proposalId: string;
  editedAt: string; // ISO date
  editedBy: string; // userId
  changeSummary: string; // Breve descripción del cambio
  diff?: string; // Opcional: diff textual o JSON
}

export interface ProposalApi {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  authorId: string;
  history?: ProposalHistory[];
}

/**
 * Obtiene una propuesta por su ID desde la API backend.
 * @param id string
 * @returns Promise<ProposalApi>
 * @throws Error si no se encuentra o hay error de red
 */
export async function fetchProposal(id: string): Promise<ProposalApi> {
  try {
    const res = await fetch(`/api/proposals/${id}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error('NOT_FOUND');
      throw new Error('NETWORK_ERROR');
    }
    const data = await res.json();
    // Asegura el mapeo de campos esperados
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      tags: data.tags || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      authorId: data.authorId,
    };
  } catch (err: any) {
    if (err.message === 'NOT_FOUND') throw new Error('Propuesta no encontrada');
    throw new Error('Error al obtener la propuesta');
  }
}

/**
 * Obtiene el historial de cambios de una propuesta
 * @param id string
 * @returns Promise<ProposalHistory[]>
 */
export async function fetchProposalHistory(id: string): Promise<ProposalHistory[]> {
  const res = await fetch(`/api/proposals/${id}/history`);
  if (!res.ok) throw new Error('No se pudo obtener el historial');
  return await res.json();
}
