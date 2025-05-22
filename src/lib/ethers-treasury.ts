import { ethers } from 'ethers';
import TreasuryDAOArtifact from '../../../artifacts/contracts/TreasuryDAO.sol/TreasuryDAO.json';

// Configuración de red y contrato (ajustar para mainnet/testnet/sidechain)
const NETWORK_URL = process.env.BLOCKCHAIN_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY';
const TREASURY_CONTRACT_ADDRESS = process.env.TREASURY_CONTRACT_ADDRESS || '0x...';
const PRIVATE_KEY = process.env.TREASURY_SIGNER_KEY || '';

// Provider y signer
const provider = new ethers.JsonRpcProvider(NETWORK_URL);
const signer = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : undefined;

// Instancia del contrato
const treasuryContract = new ethers.Contract(
  TREASURY_CONTRACT_ADDRESS,
  TreasuryDAOArtifact.abi,
  signer || provider
);

export { provider, signer, treasuryContract };
