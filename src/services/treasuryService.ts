import { supabase } from '../integrations/supabase/client';
import { Transaction, Budget, AuditLog, TransactionType, AssetType } from '../types/treasury';
import { treasuryContract } from '../lib/ethers-treasury';
import { ethers } from 'ethers';

const useBlockchain = process.env.USE_BLOCKCHAIN === 'true';

export const transactionService = {
  // Utilidad para mapear datos de la base a los tipos estrictos
  mapTransactionFromDb(dbTx: any): Transaction {
    return {
      ...dbTx,
      type: dbTx.type as TransactionType,
      asset: dbTx.asset as AssetType,
      timestamp: new Date(dbTx.timestamp),
      created_at: new Date(dbTx.created_at),
      blockchain_hash: dbTx.blockchain_hash ?? null,
    };
  },

  // Obtener todas las transacciones
  async getTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(this.mapTransactionFromDb);
  },

  // Obtener una transacción por ID
  async getTransactionById(id: string): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ? this.mapTransactionFromDb(data) : null;
  },

  // Crear nueva transacción
  async createTransaction(transaction: Omit<Transaction, 'id' | 'timestamp' | 'created_at'>): Promise<Transaction> {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;

    let blockchainTxHash: string | undefined;
    if (useBlockchain && treasuryContract && treasuryContract.registerTransaction) {
      // Lógica real: registrar en contrato TreasuryDAO
      const tx = await treasuryContract.registerTransaction(
        transaction.type === 'INCOME' ? 0 : 1,
        transaction.asset === 'ERC20' ? 0 : transaction.asset === 'ERC721' ? 1 : 2,
        transaction.asset_address || ethers.ZeroAddress,
        ethers.parseUnits(transaction.amount, 18),
        transaction.token_id ? BigInt(transaction.token_id) : 0n,
        transaction.from_address,
        transaction.to_address,
        transaction.description || '',
        transaction.budget_id ? BigInt(transaction.budget_id) : 0n
      );
      const receipt = await tx.wait();
      blockchainTxHash = receipt.hash;
    }

    // Fallback: mock (registro en base de datos)
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...transaction,
        created_by: userId,
        blockchain_hash: blockchainTxHash,
        type: transaction.type,
        asset: transaction.asset,
        created_at: new Date().toISOString(),
        timestamp: new Date().toISOString()
      })
      .select('*')
      .single();
    if (error) throw error;

    await auditService.createAudit({
      action: 'CREATE_TRANSACTION',
      entity: 'TRANSACTION',
      entity_id: data.id,
      performed_by: userId || transaction.from_address,
      details: { transaction: data, blockchainTxHash }
    });
    return this.mapTransactionFromDb(data);
  },

  // Actualizar transacción
  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    // Convertir fechas a string si existen
    const updateData: any = { ...transaction };
    if (updateData.created_at instanceof Date) updateData.created_at = updateData.created_at.toISOString();
    if (updateData.timestamp instanceof Date) updateData.timestamp = updateData.timestamp.toISOString();
    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return this.mapTransactionFromDb(data);
  },

  // Eliminar transacción
  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Servicios para Presupuestos
export const budgetService = {
  // Utilidad para mapear presupuestos de la base a los tipos estrictos
  mapBudgetFromDb(dbBudget: any): Budget {
    return {
      ...dbBudget,
      asset: dbBudget.asset as AssetType,
      created_at: new Date(dbBudget.created_at),
      approved_at: dbBudget.approved_at ? new Date(dbBudget.approved_at) : undefined,
      executed_at: dbBudget.executed_at ? new Date(dbBudget.executed_at) : undefined,
      blockchain_hash: dbBudget.blockchain_hash ?? null,
    };
  },

  // Obtener todos los presupuestos
  async getBudgets(): Promise<Budget[]> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(this.mapBudgetFromDb);
  },

  // Obtener un presupuesto por ID
  async getBudgetById(id: string): Promise<Budget | null> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data ? this.mapBudgetFromDb(data) : null;
  },

  // Crear nuevo presupuesto
  async createBudget(budget: Omit<Budget, 'id' | 'created_at' | 'approved' | 'executed' | 'approved_at' | 'executed_at' | 'approved_by'>): Promise<Budget> {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;
    if (!userId) throw new Error('Usuario no autenticado');

    let blockchainTxHash: string | undefined;
    if (useBlockchain && treasuryContract && treasuryContract.createBudget) {
      // Lógica real: registrar presupuesto en contrato TreasuryDAO
      const tx = await treasuryContract.createBudget(
        budget.name,
        budget.description || '',
        ethers.parseUnits(budget.amount, 18),
        budget.asset === 'ERC20' ? 0 : budget.asset === 'ERC721' ? 1 : 2,
        budget.asset_address || ethers.ZeroAddress
      );
      const receipt = await tx.wait();
      blockchainTxHash = receipt.hash;
    }

    // Fallback: mock (registro en base de datos)
    const { data, error } = await supabase
      .from('budgets')
      .insert({
        ...budget,
        created_by: userId,
        approved: false,
        executed: false,
        asset: budget.asset,
        created_at: new Date().toISOString(),
        blockchain_hash: blockchainTxHash
      })
      .select('*')
      .single();
    if (error) throw error;
    await auditService.createAudit({
      action: 'CREATE_BUDGET',
      entity: 'BUDGET',
      entity_id: data.id,
      performed_by: userId,
      details: { budget: data, blockchainTxHash }
    });
    return this.mapBudgetFromDb(data);
  },

  // Actualizar presupuesto
  async updateBudget(id: string, budget: Partial<Budget>): Promise<Budget> {
    // Convertir fechas a string si existen
    const updateData: any = { ...budget };
    if (updateData.created_at instanceof Date) updateData.created_at = updateData.created_at.toISOString();
    if (updateData.approved_at instanceof Date) updateData.approved_at = updateData.approved_at.toISOString();
    if (updateData.executed_at instanceof Date) updateData.executed_at = updateData.executed_at.toISOString();
    const { data, error } = await supabase
      .from('budgets')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    return this.mapBudgetFromDb(data);
  },

  // Aprobar presupuesto
  async approveBudget(id: string): Promise<Budget> {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;
    if (!userId) throw new Error('Usuario no autenticado');

    let blockchainTxHash: string | undefined;
    if (useBlockchain && treasuryContract && treasuryContract.approveBudget) {
      // Lógica real: aprobar presupuesto en contrato TreasuryDAO
      const tx = await treasuryContract.approveBudget(BigInt(id));
      const receipt = await tx.wait();
      blockchainTxHash = receipt.hash;
    }

    const { data, error } = await supabase
      .from('budgets')
      .update({
        approved: true,
        approved_by: userId,
        approved_at: new Date().toISOString(),
        blockchain_hash: blockchainTxHash
      })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    await auditService.createAudit({
      action: 'APPROVE_BUDGET',
      entity: 'BUDGET',
      entity_id: id,
      performed_by: userId,
      details: { budget: data, blockchainTxHash }
    });
    return this.mapBudgetFromDb(data);
  },

  // Ejecutar presupuesto
  async executeBudget(id: string): Promise<Budget> {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;
    if (!userId) throw new Error('Usuario no autenticado');

    let blockchainTxHash: string | undefined;
    if (useBlockchain && treasuryContract && treasuryContract.executeBudget) {
      // Lógica real: ejecutar presupuesto en contrato TreasuryDAO
      const tx = await treasuryContract.executeBudget(BigInt(id));
      const receipt = await tx.wait();
      blockchainTxHash = receipt.hash;
    }

    const { data, error } = await supabase
      .from('budgets')
      .update({
        executed: true,
        executed_at: new Date().toISOString(),
        blockchain_hash: blockchainTxHash
      })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    await auditService.createAudit({
      action: 'EXECUTE_BUDGET',
      entity: 'BUDGET',
      entity_id: id,
      performed_by: userId,
      details: { budget: data, blockchainTxHash }
    });
    return this.mapBudgetFromDb(data);
  },

  // Eliminar presupuesto
  async deleteBudget(id: string): Promise<void> {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Servicios para Auditoría
export const auditService = {
  // Utilidad para mapear logs de auditoría de la base a los tipos estrictos
  mapAuditLogFromDb(dbLog: any): AuditLog {
    return {
      ...dbLog,
      entity: dbLog.entity as 'TRANSACTION' | 'BUDGET' | 'WALLET',
      timestamp: new Date(dbLog.timestamp),
    };
  },

  // Obtener todos los logs de auditoría
  async getAudits(): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(this.mapAuditLogFromDb);
  },

  // Obtener un log de auditoría por ID
  async getAuditById(id: string): Promise<AuditLog | null> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data ? this.mapAuditLogFromDb(data) : null;
  },

  // Crear nuevo log de auditoría
  async createAudit(audit: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        ...audit,
        entity: audit.entity,
        timestamp: new Date().toISOString()
      })
      .select('*')
      .single();
    
    if (error) throw error;
    return this.mapAuditLogFromDb(data);
  },

  // Obtener logs de auditoría filtrados por entidad y ID
  async getAuditsByEntity(entity: 'TRANSACTION' | 'BUDGET' | 'WALLET', entityId: string): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('entity', entity)
      .eq('entity_id', entityId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(this.mapAuditLogFromDb);
  }
};

export default {
  transactions: transactionService,
  budgets: budgetService,
  audits: auditService
};
