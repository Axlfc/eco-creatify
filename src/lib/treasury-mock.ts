
// Mock TreasuryDAO artifact for development
export const TreasuryDAOMock = {
  abi: [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "budgetId",
          "type": "uint256"
        }
      ],
      "name": "budgets",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "executed",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "createdBy",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
};
