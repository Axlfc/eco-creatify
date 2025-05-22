import { execSync } from 'child_process'

/**
 * Script de utilidad para ejecutar el prototipo DID demo desde Node.js
 * Uso: npx ts-node scripts/run-did-demo.ts
 */

try {
  execSync('npx ts-node src/did-community-demo.ts', { stdio: 'inherit' })
} catch (e) {
  process.exit(1)
}
