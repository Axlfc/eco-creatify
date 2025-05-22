# Despliegue y Pruebas de Blockchain con Hardhat en Sepolia Testnet

## 1. Requisitos previos

- Node.js ≥ 18.x
- npm o yarn
- Cuenta en [Alchemy](https://alchemy.com/) o [Infura](https://infura.io/) para obtener un endpoint RPC de Sepolia
- Billetera Ethereum (por ejemplo, MetaMask) con fondos de testnet Sepolia ([faucet oficial](https://sepoliafaucet.com/))

## 2. Instalación de dependencias

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv
```

## 3. Configuración de Hardhat para Sepolia

1. Crea un archivo `.env` en la raíz del proyecto:

    ```
    SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<TU_INFURA_KEY>
    PRIVATE_KEY=0x<CLAVE_PRIVADA_SIN_0x>
    ```

    - **Nunca compartas tu clave privada. Usa una cuenta de testnet.**

2. Edita `hardhat.config.ts` para incluir la red Sepolia:

    ```ts
    import { HardhatUserConfig } from "hardhat/config";
    import "@nomicfoundation/hardhat-toolbox";
    import * as dotenv from "dotenv";
    dotenv.config();

    const config: HardhatUserConfig = {
      solidity: "0.8.20",
      networks: {
        sepolia: {
          url: process.env.SEPOLIA_RPC_URL || "",
          accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
      },
    };

    export default config;
    ```

## 4. Compilar y desplegar contratos

1. Compila los contratos:

    ```bash
    npx hardhat compile
    ```

2. Crea un script de despliegue en `scripts/deploy.ts`:

    ```ts
    import { ethers } from "hardhat";

    async function main() {
      const Contract = await ethers.getContractFactory("Governance");
      const contract = await Contract.deploy();
      await contract.deployed();
      console.log("Governance deployed to:", contract.address);
    }

    main().catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
    ```

3. Despliega a Sepolia:

    ```bash
    npx hardhat run scripts/deploy.ts --network sepolia
    ```

## 5. Prueba básica de interacción

Ejemplo de script para interactuar con el contrato:

```ts
import { ethers } from "hardhat";

async function main() {
  const contractAddress = "<DIRECCIÓN_DEL_CONTRATO>";
  const Governance = await ethers.getContractAt("Governance", contractAddress);

  // Ejemplo: llamar a una función pública
  const tx = await Governance.tuFuncion("argumento");
  await tx.wait();
  console.log("Transacción enviada:", tx.hash);

  // Leer un evento
  Governance.on("TuEvento", (arg1, arg2) => {
    console.log("Evento recibido:", arg1, arg2);
  });
}

main();
```

## 6. Conectar un nodo propio a Sepolia (opcional)

Puedes correr un nodo completo de Sepolia usando [geth](https://geth.ethereum.org/):

```bash
geth --sepolia --http --http.api eth,net,web3,personal --syncmode=light
```

- El nodo expondrá un endpoint local (`http://127.0.0.1:8545`).
- Para validadores, consulta la [documentación oficial de Ethereum PoS](https://ethereum.org/en/developers/docs/nodes-and-clients/).

## 7. Parámetros clave y unión de nuevos nodos

- **Consenso:** Proof of Stake (PoS)
- **Validadores:** Solo en mainnet, pero puedes correr nodos de solo lectura en testnet.
- **Fees:** Similares a mainnet, pero con ETH de testnet.
- **Unirse:** Solo necesitas el endpoint RPC y una cuenta de testnet.

## 8. Ejemplos de interacción básica

- **Enviar transacción:**

    ```ts
    const [signer] = await ethers.getSigners();
    const tx = await signer.sendTransaction({
      to: "<DIRECCIÓN_DESTINO>",
      value: ethers.utils.parseEther("0.01"),
    });
    await tx.wait();
    ```

- **Leer eventos:**

    ```ts
    contract.on("EventoImportante", (arg1, arg2) => {
      console.log("Evento:", arg1, arg2);
    });
    ```

## 9. Migración a mainnet o Polygon

- Cambia el endpoint y la clave privada en `.env` por los de mainnet o Polygon.
- Ajusta la configuración de la red en `hardhat.config.ts`:

    ```ts
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: [process.env.PRIVATE_KEY],
    }
    ```

- Asegúrate de tener fondos en la red correspondiente y revisa los límites de gas.

---

## 10. Preguntas frecuentes y resolución de problemas (FAQ/Troubleshooting)

### 1. Error: "insufficient funds for gas * price + value"
- **Causa:** La cuenta configurada en `.env` no tiene suficiente ETH de testnet.
- **Solución:** Solicita fondos en el [faucet de Sepolia](https://sepoliafaucet.com/) y verifica el balance antes de desplegar.

### 2. Error: "invalid sender" o "nonce too low"
- **Causa:** Clave privada incorrecta, formato inválido o problemas de sincronización de nonce.
- **Solución:** Verifica que la clave privada en `.env` sea válida y esté sin espacios. Si el error persiste, reinicia el nodo o espera unos minutos para que se actualicen los nonces.

### 3. Error: "could not detect network" o problemas de conexión RPC
- **Causa:** Endpoint RPC incorrecto, caído o mal configurado.
- **Solución:** Revisa que `SEPOLIA_RPC_URL` apunte a un endpoint válido de Infura o Alchemy. Prueba con otro proveedor si el problema continúa.

---

¿Dudas o problemas adicionales? Abre un issue en el repositorio o consulta la documentación oficial de Hardhat y Ethereum.
