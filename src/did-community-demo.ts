// Prototipo base de sistema DID con validación comunitaria
// --------------------------------------------------------
// Este ejemplo usa Veramo para generar un DID, simula validaciones comunitarias
// (como si fueran de BrightID/Proof of Humanity) y emite una credencial verificable
// cuando se alcanza el umbral de validaciones.

import { createAgent, ICredentialIssuer, IDIDManager, IKeyManager } from '@veramo/core'
import { DIDManager } from '@veramo/did-manager'
import { KeyManager } from '@veramo/key-manager'
import { KeyManagementSystem, MemoryPrivateKeyStore } from '@veramo/key-manager'
import { DIDProvider } from '@veramo/did-provider-key'
import { CredentialIssuer } from '@veramo/credential-w3c'
import { MemoryDIDStore } from '@veramo/did-manager'
import { MemoryKeyStore } from '@veramo/key-manager'
import { getMockValidators, mockCommunityValidation } from './lib/did-demo-utils'
import { CommunityValidation } from './types/did-demo'

// Parámetros de la demo
const VALIDATION_THRESHOLD = 3 // Número de validaciones necesarias

// Simulación de validadores comunitarios (mock)
const communityValidators = getMockValidators()

// Estado de validaciones comunitarias
const communityValidations: CommunityValidation[] = []

// Inicializa el agente Veramo con almacenamiento en memoria
const agent = createAgent<IDIDManager & IKeyManager & ICredentialIssuer>({
  plugins: [
    new KeyManager({
      store: new MemoryKeyStore(),
      kms: { local: new KeyManagementSystem(new MemoryPrivateKeyStore()) },
    }),
    new DIDManager({
      store: new MemoryDIDStore(),
      defaultProvider: 'did:key',
      providers: {
        'did:key': new DIDProvider({ defaultKms: 'local' }),
      },
    }),
    new CredentialIssuer(),
  ],
})

async function main() {
  // 1. Generar un DID para el usuario
  console.log('Generando DID para el usuario...')
  const identifier = await agent.didManagerCreate()
  console.log('DID generado:', identifier.did)

  // 2. Simular solicitudes de validación comunitaria
  for (let i = 0; i < VALIDATION_THRESHOLD; i++) {
    const validator = communityValidators[i]
    // Simula la "aprobación" de un validador
    communityValidations.push(mockCommunityValidation(validator))
    console.log(`Validación recibida de ${validator.name}`)
  }

  // 3. Emitir credencial verificable si se alcanza el umbral
  if (communityValidations.length >= VALIDATION_THRESHOLD) {
    console.log('\nUmbral de validaciones alcanzado. Emisión de credencial verificable...')
    const credential = await agent.createVerifiableCredential({
      credential: {
        issuer: { id: identifier.did },
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'ProofOfHumanity'],
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          id: identifier.did,
          proofOfHumanity: true,
          validations: communityValidations.map(v => v.validatorId),
        },
      },
      proofFormat: 'jwt',
    })
    console.log('Credencial emitida (JWT):')
    console.log(credential.proof.jwt)
  } else {
    console.log('No se alcanzó el umbral de validaciones.')
  }
}

main().catch(console.error)
