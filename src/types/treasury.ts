
// Modelos base para el sistema de tesorería DAO
// Definición de tipos y estructuras principales
import { Json } from '../integrations/supabase/types';

export type WalletType = 'EOA' | 'Contract';

export interface Wallet {
  id: string; // Identificador único
  address: string; // Dirección pública
  type: WalletType;
  owner: string; // Usuario o entidad propietaria
  createdAt: Date;
  // TODO: Agregar campos para integración con wallets y firmas digitales
}

export type TransactionType = 'INCOME' | 'EXPENSE';
export type AssetType = 'ERC20' | 'ERC721' | 'NATIVE';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: string; // Usar string para precisión en activos
  asset: AssetType;
  asset_address?: string; // Dirección del token si aplica
  token_id?: string; // Para ERC-721
  from_address: string; // Wallet origen
  to_address: string; // Wallet destino
  timestamp: Date;
  description?: string;
  budget_id?: string;
  created_at: Date;
  created_by?: string;
  // TODO: Agregar hash de transacción y firma digital
}

export interface Budget {
  id: string;
  name: string;
  description?: string;
  amount: string;
  asset: AssetType;
  asset_address?: string;
  created_by: string;
  created_at: Date;
  approved: boolean;
  approved_by?: string;
  approved_at?: Date;
  executed: boolean;
  executed_at?: Date;
  // TODO: Flujos de aprobación y ejecución
}

export interface AuditLog {
  id: string;
  action: string;
  entity: 'TRANSACTION' | 'BUDGET' | 'WALLET';
  entity_id: string;
  performed_by: string;
  timestamp: Date;
  details?: Json;
  // TODO: Incluir hash de auditoría y trazabilidad
}

// TODO: Agregar validaciones y utilidades para los modelos
