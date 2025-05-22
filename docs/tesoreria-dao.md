# Especificación Técnica: Tesorería DAO

## Modelos principales
- **Wallet**: Representa una billetera digital (EOA o contrato).
- **Transaction**: Registro de ingresos/egresos, con soporte para activos ERC20/ERC721/Nativos.
- **Budget**: Flujo de asignación, aprobación y ejecución de presupuestos.
- **AuditLog**: Trazabilidad y auditoría de todas las acciones relevantes.

## Endpoints (Express + Swagger)
- `/api/treasury/transactions` (GET, POST)
- `/api/treasury/transactions/:id` (GET)
- `/api/treasury/budgets` (GET, POST)
- `/api/treasury/budgets/:id` (GET)
- `/api/treasury/budgets/:id/approve` (POST)
- `/api/treasury/budgets/:id/execute` (POST)
- `/api/treasury/audits` (GET, POST)
- `/api/treasury/audits/:id` (GET)

## Seguridad
- Todas las rutas protegidas con JWT de Supabase (`authenticateJWT`).
- Roles y logs de auditoría para trazabilidad.

## Integración Blockchain (Real y Mock)
- Si la variable de entorno `USE_BLOCKCHAIN` es `true`, las transacciones y presupuestos se registran en el contrato `TreasuryDAO.sol` usando ethers.js.
- El hash de la transacción blockchain se almacena en el registro.
- Si `USE_BLOCKCHAIN` es `false`, se usa el mock (solo base de datos).
- El contrato debe estar desplegado y la clave privada configurada en las variables de entorno.

## Variables de entorno requeridas
- `USE_BLOCKCHAIN`: "true" para activar integración real, "false" para mock.
- `BLOCKCHAIN_RPC_URL`: URL del nodo Ethereum (testnet, mainnet o sidechain).
- `TREASURY_CONTRACT_ADDRESS`: Dirección del contrato `TreasuryDAO` desplegado.
- `TREASURY_SIGNER_KEY`: Clave privada del firmante autorizado.

## Ejemplo de flujo real
1. El usuario crea una transacción vía API.
2. El backend registra la transacción en el contrato (si está activo el modo blockchain).
3. El hash de la transacción blockchain se almacena y audita.
4. Si hay error en blockchain, se retorna el error al usuario.

## Ejemplo de respuesta con integración blockchain

### Crear presupuesto (POST /api/treasury/budgets)
```json
{
  "id": "uuid",
  "name": "Presupuesto ejemplo",
  "amount": "1000",
  "asset": "ERC20",
  "asset_address": "0x...",
  "created_by": "user-id",
  "created_at": "2025-05-22T12:00:00Z",
  "approved": false,
  "executed": false,
  "blockchain_hash": "0xHASHBLOCKCHAIN..."
}
```

### Aprobar presupuesto (POST /api/treasury/budgets/:id/approve)
```json
{
  "id": "uuid",
  "name": "Presupuesto ejemplo",
  "amount": "1000",
  "asset": "ERC20",
  "asset_address": "0x...",
  "created_by": "user-id",
  "created_at": "2025-05-22T12:00:00Z",
  "approved": true,
  "approved_by": "user-id",
  "approved_at": "2025-05-22T12:10:00Z",
  "executed": false,
  "blockchain_hash": "0xHASHBLOCKCHAIN_APPROVE..."
}
```

### Ejecutar presupuesto (POST /api/treasury/budgets/:id/execute)
```json
{
  "id": "uuid",
  "name": "Presupuesto ejemplo",
  "amount": "1000",
  "asset": "ERC20",
  "asset_address": "0x...",
  "created_by": "user-id",
  "created_at": "2025-05-22T12:00:00Z",
  "approved": true,
  "approved_by": "user-id",
  "approved_at": "2025-05-22T12:10:00Z",
  "executed": true,
  "executed_at": "2025-05-22T12:20:00Z",
  "blockchain_hash": "0xHASHBLOCKCHAIN_EXECUTE..."
}
```

### Consultar estado on-chain de una transacción
`GET /api/treasury/transactions/{id}/onchain`
```json
{
  "blockchain_hash": "0xHASH...",
  "confirmed": true,
  "explorer_url": "https://sepolia.etherscan.io/tx/0xHASH...",
  "receipt": { /* datos del receipt */ }
}
```

### Consultar estado on-chain de un presupuesto
`GET /api/treasury/budgets/{id}/onchain`
```json
{
  "blockchain_hash": "0xHASH...",
  "explorer_url": "https://sepolia.etherscan.io/tx/0xHASH...",
  "approved": true,
  "executed": false,
  "onchain": { /* datos del contrato */ }
}
```

---

**Actualizado:** 2025-05-22
