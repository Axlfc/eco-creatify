// Modelos base para el sistema de tesorería DAO
// Definición de tipos y estructuras principales

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
  assetAddress?: string; // Dirección del token si aplica
  tokenId?: string; // Para ERC-721
  from: string; // Wallet origen
  to: string; // Wallet destino
  timestamp: Date;
  description?: string;
  budgetId?: string;
  // TODO: Agregar hash de transacción y firma digital
}

export interface Budget {
  id: string;
  name: string;
  description?: string;
  amount: string;
  asset: AssetType;
  assetAddress?: string;
  createdBy: string;
  createdAt: Date;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  executed: boolean;
  executedAt?: Date;
  // TODO: Flujos de aprobación y ejecución
}

export interface AuditLog {
  id: string;
  action: string;
  entity: 'TRANSACTION' | 'BUDGET' | 'WALLET';
  entityId: string;
  performedBy: string;
  timestamp: Date;
  details?: string;
  // TODO: Incluir hash de auditoría y trazabilidad
}

// TODO: Agregar validaciones y utilidades para los modelos
