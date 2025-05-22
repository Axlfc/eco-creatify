import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

// Middleware para validar JWT emitido por Supabase
export const authenticateJWT: RequestHandler = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Token requerido' });
    return;
  }
  // Validación básica. En producción, usar la clave pública de Supabase para verificar la firma
  jwt.verify(token, process.env.SUPABASE_JWT_SECRET || 'dev-secret', (err, user) => {
    if (err) {
      res.status(403).json({ message: 'Token inválido' });
      return;
    }
    (req as any).user = user;
    next();
  });
};
