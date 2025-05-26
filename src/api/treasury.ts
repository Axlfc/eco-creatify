
import express from 'express';

// Mock services for treasury functionality
const mockTransactionService = {
  createTransaction: async (data: any) => ({ id: 'mock-tx-id', ...data }),
  getTransactions: async () => [],
  getTransactionById: async (id: string) => ({ id, amount: '100', status: 'pending' })
};

const mockBudgetService = {
  createBudget: async (data: any) => ({ id: 'mock-budget-id', ...data }),
  getBudgets: async () => [],
  getBudgetById: async (id: string) => ({ id, amount: '1000', status: 'draft' }),
  approveBudget: async (id: string) => ({ id, status: 'approved' }),
  executeBudget: async (id: string) => ({ id, status: 'executed' })
};

const mockAuditService = {
  getAudits: async () => [],
  getAuditById: async (id: string) => ({ id, action: 'view', entity: 'transaction' }),
  createAudit: async (data: any) => ({ id: 'mock-audit-id', ...data })
};

const router = express.Router();

// --- Transacciones ---
router.post('/transactions', async (req, res) => {
  try {
    const { type, amount, asset, assetAddress, tokenId, from_address, to_address, description, budget_id } = req.body;
    if (!type || !amount || !asset || !from_address || !to_address) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    const created_by = 'mock-user-id';
    const tx = await mockTransactionService.createTransaction({
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
  } catch (error: any) {
    console.error('Error al crear transacción:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// Consultar transacciones
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await mockTransactionService.getTransactions();
    res.json({ data: transactions });
  } catch (error: any) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.get('/transactions/:id', async (req, res) => {
  try {
    const transaction = await mockTransactionService.getTransactionById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }
    res.json(transaction);
  } catch (error: any) {
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
    const created_by = 'mock-user-id';
    const budget = await mockBudgetService.createBudget({
      name,
      amount,
      asset,
      asset_address,
      description,
      created_by
    });
    res.status(201).json(budget);
  } catch (error: any) {
    console.error('Error al crear presupuesto:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// Consultar presupuestos
router.get('/budgets', async (req, res) => {
  try {
    const budgets = await mockBudgetService.getBudgets();
    res.json({ data: budgets });
  } catch (error: any) {
    console.error('Error al consultar presupuestos:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

router.get('/budgets/:id', async (req, res) => {
  try {
    const budget = await mockBudgetService.getBudgetById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Presupuesto no encontrado' });
    }
    res.json(budget);
  } catch (error: any) {
    console.error('Error al consultar presupuesto:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// --- Auditoría ---
router.get('/audits', async (req, res) => {
  try {
    const audits = await mockAuditService.getAudits();
    res.json({ data: audits });
  } catch (error: any) {
    console.error('Error al consultar logs de auditoría:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

export default router;
