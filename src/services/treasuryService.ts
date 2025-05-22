
import { supabase } from '../integrations/supabase/client';
import { Transaction, Budget, AuditLog, TransactionType, AssetType } from '../types/treasury';

// Servicios para Transacciones
export const transactionService = {
  // Obtener todas las transacciones
  async getTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Obtener una transacción por ID
  async getTransactionById(id: string): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  // Crear nueva transacción
  async createTransaction(transaction: Omit<Transaction, 'id' | 'timestamp' | 'created_at'>): Promise<Transaction> {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...transaction,
        created_by: userId
      })
      .select('*')
      .single();
    
    if (error) throw error;
    
    // Registrar acción en audit_logs
    await auditService.createAudit({
      action: 'CREATE_TRANSACTION',
      entity: 'TRANSACTION',
      entity_id: data.id,
      performed_by: userId || transaction.from_address,
      details: { transaction: data }
    });
    
    return data;
  },

  // Actualizar transacción
  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
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
  // Obtener todos los presupuestos
  async getBudgets(): Promise<Budget[]> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Obtener un presupuesto por ID
  async getBudgetById(id: string): Promise<Budget | null> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  // Crear nuevo presupuesto
  async createBudget(budget: Omit<Budget, 'id' | 'created_at' | 'approved' | 'executed' | 'approved_at' | 'executed_at' | 'approved_by'>): Promise<Budget> {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;

    if (!userId) throw new Error('Usuario no autenticado');

    const { data, error } = await supabase
      .from('budgets')
      .insert({
        ...budget,
        created_by: userId,
        approved: false,
        executed: false
      })
      .select('*')
      .single();
    
    if (error) throw error;
    
    // Registrar acción en audit_logs
    await auditService.createAudit({
      action: 'CREATE_BUDGET',
      entity: 'BUDGET',
      entity_id: data.id,
      performed_by: userId,
      details: { budget: data }
    });
    
    return data;
  },

  // Actualizar presupuesto
  async updateBudget(id: string, budget: Partial<Budget>): Promise<Budget> {
    const { data, error } = await supabase
      .from('budgets')
      .update(budget)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  // Aprobar presupuesto
  async approveBudget(id: string): Promise<Budget> {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;
    
    if (!userId) throw new Error('Usuario no autenticado');

    const { data, error } = await supabase
      .from('budgets')
      .update({
        approved: true,
        approved_by: userId,
        approved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    
    // Registrar acción en audit_logs
    await auditService.createAudit({
      action: 'APPROVE_BUDGET',
      entity: 'BUDGET',
      entity_id: id,
      performed_by: userId,
      details: { budget: data }
    });
    
    return data;
  },

  // Ejecutar presupuesto
  async executeBudget(id: string): Promise<Budget> {
    const { data: budget, error: getBudgetError } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (getBudgetError) throw getBudgetError;
    
    if (!budget.approved) {
      throw new Error('El presupuesto debe estar aprobado antes de ejecutarse');
    }

    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;
    
    if (!userId) throw new Error('Usuario no autenticado');
    
    const { data, error } = await supabase
      .from('budgets')
      .update({
        executed: true,
        executed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    
    // Registrar acción en audit_logs
    await auditService.createAudit({
      action: 'EXECUTE_BUDGET',
      entity: 'BUDGET',
      entity_id: id,
      performed_by: userId,
      details: { budget: data }
    });
    
    return data;
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
  // Obtener todos los logs de auditoría
  async getAudits(): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Obtener un log de auditoría por ID
  async getAuditById(id: string): Promise<AuditLog | null> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  // Crear nuevo log de auditoría
  async createAudit(audit: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert(audit)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
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
    return data || [];
  }
};

export default {
  transactions: transactionService,
  budgets: budgetService,
  audits: auditService
};
