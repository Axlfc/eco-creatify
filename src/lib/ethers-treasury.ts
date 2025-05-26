
import { ethers } from 'ethers';
import { TreasuryDAOMock } from './treasury-mock';

// Configuración de red y contrato (ajustar para mainnet/testnet/sidechain)
const NETWORK_URL = process.env.BLOCKCHAIN_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY';
const TREASURY_CONTRACT_ADDRESS = process.env.TREASURY_CONTRACT_ADDRESS || '0x742d35Cc6634C0532925a3b8D82C6CE8D3D5C77F';
const PRIVATE_KEY = process.env.TREASURY_SIGNER_KEY || '';

// Provider y signer
const provider = new ethers.JsonRpcProvider(NETWORK_URL);
const signer = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : undefined;

// Instancia del contrato usando mock ABI
const treasuryContract = new ethers.Contract(
  TREASURY_CONTRACT_ADDRESS,
  TreasuryDAOMock.abi,
  signer || provider
);

export { provider, signer, treasuryContract };
