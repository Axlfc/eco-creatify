import express from 'express';
import { authenticateJWT } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

// Modelo básico de comentario anidado
export interface Comment {
  id: string;
  proposalId: string;
  parentId: string | null;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isBlocked: boolean;
}

// Almacenamiento en memoria (reemplazar por DB/Supabase en producción)
export const comments: Comment[] = [];

const router = express.Router();

// Obtener comentarios anidados de una propuesta
router.get('/proposal/:proposalId', authenticateJWT, (req, res) => {
  const { proposalId } = req.params;
  const proposalComments = comments.filter(c => c.proposalId === proposalId);
  res.json({ data: proposalComments });
});

// Crear comentario o respuesta
router.post('/', authenticateJWT, (req, res) => {
  const { proposalId, parentId = null, content } = req.body;
  if (!proposalId || !content) {
    return res.status(400).json({ message: 'proposalId y content requeridos' });
  }
  const authorId = (req as any).user?.sub || 'unknown';
  const now = new Date().toISOString();
  const newComment: Comment = {
    id: uuidv4(),
    proposalId,
    parentId,
    authorId,
    content,
    createdAt: now,
    updatedAt: now,
    isBlocked: false,
  };
  comments.push(newComment);
  res.status(201).json(newComment);
});

// Editar comentario propio
router.put('/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const authorId = (req as any).user?.sub || 'unknown';
  const comment = comments.find(c => c.id === id);
  if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });
  if (comment.authorId !== authorId) return res.status(403).json({ message: 'Solo el autor puede editar' });
  comment.content = content;
  comment.updatedAt = new Date().toISOString();
  res.json(comment);
});

// Eliminar comentario propio
router.delete('/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  const authorId = (req as any).user?.sub || 'unknown';
  const idx = comments.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Comentario no encontrado' });
  if (comments[idx].authorId !== authorId) return res.status(403).json({ message: 'Solo el autor puede eliminar' });
  comments.splice(idx, 1);
  res.status(204).send();
});

export default router;
