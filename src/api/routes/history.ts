
import express from 'express';
import { authenticateJWT } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

// Modelo de historial de cambios de propuestas
export interface ProposalHistory {
  id: string;
  proposalId: string;
  editorId: string;
  changes: string;
  createdAt: string;
}

export const proposalHistory: ProposalHistory[] = [];

const router = express.Router();

// Registrar cambio en propuesta
router.post('/', authenticateJWT, (req, res) => {
  const { proposalId, changes } = req.body;
  if (!proposalId || !changes) {
    return res.status(400).json({ message: 'proposalId y changes requeridos' });
  }
  const editorId = (req as any).user?.sub || 'unknown';
  const entry: ProposalHistory = {
    id: uuidv4(),
    proposalId,
    editorId,
    changes,
    createdAt: new Date().toISOString(),
  };
  proposalHistory.push(entry);
  res.status(201).json(entry);
});

// Consultar historial de una propuesta
router.get('/:proposalId', authenticateJWT, (req, res) => {
  const { proposalId } = req.params;
  const history = proposalHistory.filter(h => h.proposalId === proposalId);
  res.json({ data: history });
});

export default router;
