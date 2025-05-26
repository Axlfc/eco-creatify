
import { provider, treasuryContract } from '../lib/ethers-treasury';

const ETHERSCAN_URL = process.env.ETHERSCAN_URL || 'https://sepolia.etherscan.io/tx/';
const BLOCKSCOUT_URL = process.env.BLOCKSCOUT_URL;

export function getExplorerTxUrl(hash: string): string {
  if (BLOCKSCOUT_URL) return `${BLOCKSCOUT_URL}/tx/${hash}`;
  return `${ETHERSCAN_URL}${hash}`;
}

export async function getOnChainTransaction(txHash: string) {
  if (!txHash) return null;
  const receipt = await provider.getTransactionReceipt(txHash);
  const confirmations = receipt ? await receipt.confirmations() : 0;
  return {
    hash: txHash,
    confirmed: receipt && confirmations > 0,
    explorer_url: getExplorerTxUrl(txHash),
    ...receipt
  };
}

export async function getOnChainBudget(budgetId: string) {
  if (!treasuryContract) return null;
  try {
    const budget = await treasuryContract.budgets(BigInt(budgetId));
    // Se asume que el contrato expone los campos relevantes
    return {
      id: budget.id?.toString(),
      approved: budget.approved,
      executed: budget.executed,
      createdBy: budget.createdBy,
      explorer_url: getExplorerTxUrl(''),
      ...budget
    };
  } catch (error) {
    console.error('Error fetching budget:', error);
    return null;
  }
}
