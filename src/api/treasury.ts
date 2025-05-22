import express from 'express';
import { transactionService, budgetService, auditService } from '../services/treasuryService';
import { getOnChainTransaction, getOnChainBudget } from '../lib/treasury-explorer';
import { TransactionWithHash, BudgetWithHash } from '../types/treasury';

const router = express.Router();

// --- Transacciones ---
router.post('/transactions', async (req, res, next) => {
  try {
    const { type, amount, asset, assetAddress, tokenId, from_address, to_address, description, budget_id } = req.body;
    if (!type || !amount || !asset || !from_address || !to_address) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    // Obtener el usuario autenticado (asume req.user.id)
    const created_by = req.user?.id || 'system';
    const tx = await transactionService.createTransaction({
      type,
      amount,
      asset,
      asset_address: assetAddress,
      token_id: tokenId,
      from_address,
      to_address,
      description,
      budget_id,
      created_by
    });
    res.status(201).json(tx);
  } catch (error) {
    console.error('Error al crear transacción:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// Consultar transacciones
router.get('/transactions', async (req, res, next) => {
  try {
    const transactions = await transactionService.getTransactions();
    res.json({ data: transactions });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.get('/transactions/:id', async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.get('/transactions/:id/onchain', async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id) as TransactionWithHash;
    if (!transaction || !transaction.blockchain_hash) {
      return res.status(404).json({ message: 'Transacción o hash no encontrado' });
    }
    const onchain = await getOnChainTransaction(transaction.blockchain_hash);
    res.json({
      blockchain_hash: transaction.blockchain_hash,
      confirmed: onchain?.confirmed,
      explorer_url: onchain?.explorer_url,
      receipt: onchain
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar estado on-chain', error: error.message });
  }
});

// --- Presupuestos ---
router.post('/budgets', async (req, res, next) => {
  try {
    const { name, amount, asset, asset_address, description } = req.body;
    if (!name || !amount || !asset) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    // Obtener el usuario autenticado (asume req.user.id)
    const created_by = req.user?.id || 'system';
    const budget = await budgetService.createBudget({
      name,
      amount,
      asset,
      asset_address,
      description,
      created_by
    });
    res.status(201).json(budget);
  } catch (error) {
    console.error('Error al crear presupuesto:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// Consultar presupuestos
router.get('/budgets', async (req, res, next) => {
  try {
    const budgets = await budgetService.getBudgets();
    res.json({ data: budgets });
  } catch (error) {
    console.error('Error al consultar presupuestos:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.get('/budgets/:id', async (req, res, next) => {
  try {
    const budget = await budgetService.getBudgetById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Presupuesto no encontrado' });
    }
    res.json(budget);
  } catch (error) {
    console.error('Error al consultar presupuesto:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.post('/budgets/:id/approve', async (req, res, next) => {
  try {
    const budget = await budgetService.approveBudget(req.params.id);
    res.json(budget);
  } catch (error) {
    console.error('Error al aprobar presupuesto:', error);
    res.status 500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.post('/budgets/:id/execute', async (req, res, next) => {
  try {
    const budget = await budgetService.executeBudget(req.params.id);
    res.json(budget);
  } catch (error) {
    console.error('Error al ejecutar presupuesto:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.get('/budgets/:id/onchain', async (req, res, next) => {
  try {
    const budget = await budgetService.getBudgetById(req.params.id) as BudgetWithHash;
    if (!budget || !budget.blockchain_hash) {
      return res.status(404).json({ message: 'Presupuesto o hash no encontrado' });
    }
    const onchain = await getOnChainBudget(req.params.id);
    res.json({
      blockchain_hash: budget.blockchain_hash,
      explorer_url: onchain?.explorer_url,
      approved: onchain?.approved,
      executed: onchain?.executed,
      onchain
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar estado on-chain', error: error.message });
  }
});

// --- Auditoría ---
router.get('/audits', async (req, res, next) => {
  try {
    const audits = await auditService.getAudits();
    res.json({ data: audits });
  } catch (error) {
    console.error('Error al consultar logs de auditoría:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.get('/audits/:id', async (req, res, next) => {
  try {
    const audit = await auditService.getAuditById(req.params.id);
    if (!audit) {
      return res.status(404).json({ message: 'Log de auditoría no encontrado' });
    }
    res.json(audit);
  } catch (error) {
    console.error('Error al consultar log de auditoría:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.post('/audits', async (req, res, next) => {
  try {
    const { action, entity, entity_id, performed_by, details } = req.body;
    if (!action || !entity || !entity_id || !performed_by) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const audit = await auditService.createAudit({
      action,
      entity,
      entity_id,
      performed_by,
      details
    });
    res.status(201).json(audit);
  } catch (error) {
    console.error('Error al crear log de auditoría:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

export default router;
