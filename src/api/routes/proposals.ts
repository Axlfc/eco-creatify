import express from 'express';
import { authenticateJWT } from '../middleware/auth';
import { proposals, votes, getProposalResults, Proposal, Vote } from '../data/proposals';
import { v4 as uuidv4 } from 'uuid';
import { createSnapshot, saveSnapshot, getSnapshots, VoteSnapshot } from '../../lib/snapshots';
import { ProposalHistory } from '../../types/proposal';

// --- HISTORIAL DE CAMBIOS DE PROPUESTAS ---

/**
 * Almacén en memoria para historial de cambios de propuestas
 * Cada entrada representa una edición relevante
 */
export const proposalHistory: ProposalHistory[] = [];

/**
 * Registra un cambio en una propuesta
 * @param proposalId string
 * @param editedBy string (userId)
 * @param changeSummary string
 * @param diff string (opcional)
 */
export function addProposalHistory(proposalId: string, editedBy: string, changeSummary: string, diff?: string) {
  proposalHistory.push({
    id: uuidv4(),
    proposalId,
    editedAt: new Date().toISOString(),
    editedBy,
    changeSummary,
    diff,
  });
}

/**
 * Devuelve el historial de una propuesta
 * @param proposalId string
 * @returns ProposalHistory[]
 */
export function getProposalHistory(proposalId: string): ProposalHistory[] {
  return proposalHistory.filter(h => h.proposalId === proposalId);
}

const router = express.Router();

// Utilidad para obtener el último snapshot de una propuesta
function getLastSnapshot(proposalId: string): VoteSnapshot | null {
  const chain = getSnapshots().filter(s => s.id === proposalId);
  if (chain.length === 0) return null;
  // Ordenar por timestamp ascendente
  return chain.sort((a, b) => a.timestamp - b.timestamp)[chain.length - 1];
}

// Utilidad para obtener el estado y votos actuales de una propuesta
function getProposalStateAndVotes(proposalId: string) {
  const proposal = proposals.find(p => p.id === proposalId);
  if (!proposal) return null;
  const votos = votes.filter(v => v.proposalId === proposalId);
  return { proposal, votos };
}

// GET /api/proposals (protegido, con paginación y filtrado)
router.get('/', authenticateJWT, (req, res) => {
  let { page = '1', limit = '10', sort = 'createdAt', order = 'desc', title } = req.query as Record<string, string>;
  let filtered = proposals;
  if (title) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(title.toLowerCase()));
  }
  filtered = filtered.sort((a, b) => {
    if (sort === 'createdAt') {
      return order === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  const paginated = filtered.slice(start, end);
  res.json({
    data: paginated,
    page: pageNum,
    limit: limitNum,
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / limitNum),
  });
});

// POST /api/proposals (protegido)
router.post('/', authenticateJWT, (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    res.status(400).json({ message: 'Título y descripción requeridos' });
    return;
  }
  const userId = (req as any).user?.sub || 'unknown';
  const newProposal: Proposal = {
    id: uuidv4(),
    title,
    description,
    createdBy: userId,
    createdAt: new Date().toISOString(),
  };
  proposals.push(newProposal);
  // Generar snapshot inicial
  const snapshot = createSnapshot({
    id: newProposal.id,
    state: 'open',
    votes: [],
    event: 'created',
    prevSnapshotHash: null,
  });
  saveSnapshot(snapshot);
  res.status(201).json(newProposal);
});

// POST /api/proposals/:id/vote (protegido)
router.post('/:id/vote', authenticateJWT, (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  if (value !== 'yes' && value !== 'no') {
    res.status(400).json({ message: 'El voto debe ser "yes" o "no"' });
    return;
  }
  const userId = (req as any).user?.sub || 'unknown';
  if (!proposals.find(p => p.id === id)) {
    res.status(404).json({ message: 'Propuesta no encontrada' });
    return;
  }
  if (votes.find(v => v.proposalId === id && v.userId === userId)) {
    res.status(409).json({ message: 'Ya has votado en esta propuesta' });
    return;
  }
  const vote: Vote = { proposalId: id, userId, value };
  votes.push(vote);
  // Generar snapshot tras el voto
  const prev = getLastSnapshot(id);
  const votosActuales = votes.filter(v => v.proposalId === id).map(v => ({
    voterHash: v.userId, // Hash simplificado para demo
    option: v.value,
    voteTimestamp: Date.now(),
  }));
  const snapshot = createSnapshot({
    id,
    state: 'open',
    votes: votosActuales,
    event: 'vote',
    prevSnapshotHash: prev ? prev.hash : null,
  });
  saveSnapshot(snapshot);
  res.status(201).json({ message: 'Voto registrado' });
});

// GET /api/proposals/:id/results (protegido)
router.get('/:id/results', authenticateJWT, (req, res) => {
  const { id } = req.params;
  if (!proposals.find(p => p.id === id)) {
    res.status(404).json({ message: 'Propuesta no encontrada' });
    return;
  }
  const results = getProposalResults(id);
  res.json(results);
});

// GET /api/proposals/:id/snapshots (protegido)
router.get('/:id/snapshots', authenticateJWT, function (req, res) {
  const { id } = req.params;
  if (!proposals.find(p => p.id === id)) {
    res.status(404).json({ message: 'Propuesta no encontrada' });
    return;
  }
  const chain = getSnapshots().filter(s => s.id === id);
  res.json({ snapshots: chain });
  // TODO: Exportar a IPFS/blockchain si se requiere persistencia extra
});

// --- ENDPOINT: GET /api/proposals/:id/history ---
router.get('/:id/history', authenticateJWT, (req, res) => {
  const { id } = req.params;
  if (!proposals.find(p => p.id === id)) {
    res.status(404).json({ message: 'Propuesta no encontrada' });
    return;
  }
  res.json(getProposalHistory(id));
});

// --- Marcar aquí donde debe llamarse addProposalHistory tras cada edición ---
// TODO: Llamar a addProposalHistory en el endpoint PUT /api/proposals/:id tras editar
// Ejemplo: addProposalHistory(id, userId, 'Título actualizado', diff)

export default router;
