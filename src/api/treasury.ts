import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, Budget, AuditLog } from '../types/treasury';

const router = express.Router();

// --- Almacenamiento en memoria ---
const transactions: Transaction[] = [];
const budgets: Budget[] = [];
const audits: AuditLog[] = [];

// --- Transacciones ---
router.post('/transactions', (req, res) => {
  // Validación básica
  const { type, amount, asset, assetAddress, tokenId, from, to, description, budgetId } = req.body;
  if (!type || !amount || !asset || !from || !to) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }
  const tx: Transaction = {
    id: uuidv4(),
    type,
    amount,
    asset,
    assetAddress,
    tokenId,
    from,
    to,
    timestamp: new Date(),
    description,
    budgetId,
  };
  transactions.push(tx);
  // Registrar auditoría
  audits.push({
    id: uuidv4(),
    action: 'CREATE_TRANSACTION',
    entity: 'TRANSACTION',
    entityId: tx.id,
    performedBy: from,
    timestamp: new Date(),
    details: JSON.stringify(tx),
  });
  res.status(201).json(tx);
});

// Consultar transacciones
router.get('/transactions', (req, res) => {
  // TODO: Filtros y paginación
  res.json({ data: transactions });
});

// --- Presupuestos ---
router.post('/budgets', (req, res) => {
  const { name, amount, asset, assetAddress, createdBy, description } = req.body;
  if (!name || !amount || !asset || !createdBy) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }
  const budget: Budget = {
    id: uuidv4(),
    name,
    description,
    amount,
    asset,
    assetAddress,
    createdBy,
    createdAt: new Date(),
    approved: false,
    executed: false,
  };
  budgets.push(budget);
  audits.push({
    id: uuidv4(),
    action: 'CREATE_BUDGET',
    entity: 'BUDGET',
    entityId: budget.id,
    performedBy: createdBy,
    timestamp: new Date(),
    details: JSON.stringify(budget),
  });
  res.status(201).json(budget);
});

// Consultar presupuestos
router.get('/budgets', (req, res) => {
  res.json({ data: budgets });
});

// --- Auditoría ---
router.post('/audits', (req, res) => {
  const { action, entity, entityId, performedBy, details } = req.body;
  if (!action || !entity || !entityId || !performedBy) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }
  const audit: AuditLog = {
    id: uuidv4(),
    action,
    entity,
    entityId,
    performedBy,
    timestamp: new Date(),
    details,
  };
  audits.push(audit);
  res.status(201).json(audit);
});

// Consultar logs de auditoría
router.get('/audits', (req, res) => {
  res.json({ data: audits });
});

// TODO: Endpoints para integración con wallets y firmas digitales

export default router;
