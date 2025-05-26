
import type { Request, Response, NextFunction } from 'express';

// Extend Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware para validar JWT emitido por Supabase
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ message: 'Token requerido' });
    return;
  }
  
  // Mock authentication for development
  // En producción, usar la clave pública de Supabase para verificar la firma
  try {
    req.user = { sub: 'mock-user-id', email: 'mock@example.com' };
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token inválido' });
    return;
  }
};
