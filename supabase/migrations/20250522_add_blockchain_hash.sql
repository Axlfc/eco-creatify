-- Migración: Añadir blockchain_hash a transactions y budgets
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS blockchain_hash TEXT;
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS blockchain_hash TEXT;
