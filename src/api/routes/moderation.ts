import express from 'express';
import { authenticateJWT } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

// Modelo de reporte de contenido
export interface Report {
  id: string;
  itemId: string;
  itemType: 'proposal' | 'comment';
  reporterId: string;
  reason: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'blocked';
}

export const reports: Report[] = [];

const router = express.Router();

// Reportar contenido
router.post('/report', authenticateJWT, (req, res) => {
  const { itemId, itemType, reason } = req.body;
  if (!itemId || !itemType || !reason) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }
  const reporterId = (req as any).user?.sub || 'unknown';
  const report: Report = {
    id: uuidv4(),
    itemId,
    itemType,
    reporterId,
    reason,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  reports.push(report);
  res.status(201).json(report);
});

// Listar reportes (solo moderadores, aquí simplificado)
router.get('/reports', authenticateJWT, (req, res) => {
  res.json({ data: reports });
});

// Bloquear contenido reportado (moderador)
router.post('/block', authenticateJWT, (req, res) => {
  const { reportId } = req.body;
  const report = reports.find(r => r.id === reportId);
  if (!report) return res.status(404).json({ message: 'Reporte no encontrado' });
  report.status = 'blocked';
  res.json(report);
});

export default router;
