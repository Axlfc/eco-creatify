// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Esqueleto de contrato de Tesorería DAO
// Soporte para registro de transacciones y presupuestos
// Compatible con ERC-20 y ERC-721

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface IERC721 {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

contract TreasuryDAO {
    // Estructuras básicas
    enum AssetType { ERC20, ERC721, NATIVE }
    enum TransactionType { INCOME, EXPENSE }

    struct Transaction {
        uint256 id;
        TransactionType txType;
        AssetType assetType;
        address assetAddress;
        uint256 amount;
        uint256 tokenId; // Solo para ERC721
        address from;
        address to;
        uint256 timestamp;
        string description;
        uint256 budgetId;
        // TODO: Agregar hash de tx y firma digital
    }

    struct Budget {
        uint256 id;
        string name;
        string description;
        uint256 amount;
        AssetType assetType;
        address assetAddress;
        address createdBy;
        uint256 createdAt;
        bool approved;
        address approvedBy;
        uint256 approvedAt;
        bool executed;
        uint256 executedAt;
        // TODO: Flujos de aprobación y ejecución
    }

    // Eventos
    event TransactionRegistered(uint256 indexed id, address indexed from, address indexed to);
    event BudgetCreated(uint256 indexed id, address indexed createdBy);
    // TODO: Eventos para auditoría y control

    // Almacenamiento
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => Budget) public budgets;
    uint256 public transactionCount;
    uint256 public budgetCount;

    // Funciones básicas
    function registerTransaction(/* params */) external {
        // TODO: Implementar registro de transacciones
    }

    function createBudget(/* params */) external {
        // TODO: Implementar creación de presupuestos
    }

    function approveBudget(uint256 budgetId) external {
        // TODO: Implementar aprobación de presupuestos
    }

    function executeBudget(uint256 budgetId) external {
        // TODO: Implementar ejecución de presupuestos
    }

    // TODO: Funciones para consulta, auditoría y trazabilidad
}
