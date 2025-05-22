// Integración de endpoints de tesorería al backend principal Express
// Se protege con middleware JWT existente
import express from 'express';
import treasuryRouter from '../treasury';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// Aplica el middleware de autenticación a todas las rutas de tesorería
router.use(authenticateJWT);
router.use('/', treasuryRouter);

export default router;
