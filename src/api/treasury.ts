
import express from 'express';
import { transactionService, budgetService, auditService } from '../services/treasuryService';

const router = express.Router();

// --- Transacciones ---
router.post('/transactions', async (req, res) => {
  try {
    // Validación básica
    const { type, amount, asset, assetAddress, tokenId, from_address, to_address, description, budget_id } = req.body;
    if (!type || !amount || !asset || !from_address || !to_address) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    
    const tx = await transactionService.createTransaction({
      type,
      amount,
      asset,
      asset_address: assetAddress,
      token_id: tokenId,
      from_address,
      to_address,
      description,
      budget_id
    });
    
    res.status(201).json(tx);
  } catch (error) {
    console.error('Error al crear transacción:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// Consultar transacciones
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await transactionService.getTransactions();
    res.json({ data: transactions });
  } catch (error) {
    console.error('Error al consultar transacciones:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.get('/transactions/:id', async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }
    res.json(transaction);
  } catch (error) {
    console.error('Error al consultar transacción:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// --- Presupuestos ---
router.post('/budgets', async (req, res) => {
  try {
    const { name, amount, asset, asset_address, description } = req.body;
    if (!name || !amount || !asset) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    
    const budget = await budgetService.createBudget({
      name,
      amount,
      asset,
      asset_address,
      description
    });
    
    res.status(201).json(budget);
  } catch (error) {
    console.error('Error al crear presupuesto:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// Consultar presupuestos
router.get('/budgets', async (req, res) => {
  try {
    const budgets = await budgetService.getBudgets();
    res.json({ data: budgets });
  } catch (error) {
    console.error('Error al consultar presupuestos:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.get('/budgets/:id', async (req, res) => {
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

router.post('/budgets/:id/approve', async (req, res) => {
  try {
    const budget = await budgetService.approveBudget(req.params.id);
    res.json(budget);
  } catch (error) {
    console.error('Error al aprobar presupuesto:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.post('/budgets/:id/execute', async (req, res) => {
  try {
    const budget = await budgetService.executeBudget(req.params.id);
    res.json(budget);
  } catch (error) {
    console.error('Error al ejecutar presupuesto:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// --- Auditoría ---
router.get('/audits', async (req, res) => {
  try {
    const audits = await auditService.getAudits();
    res.json({ data: audits });
  } catch (error) {
    console.error('Error al consultar logs de auditoría:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.get('/audits/:id', async (req, res) => {
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

router.post('/audits', async (req, res) => {
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
