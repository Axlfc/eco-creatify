import { CommunityValidator, CommunityValidation } from '../types/did-demo'

/**
 * Simula la obtención de una lista de validadores comunitarios.
 */
export function getMockValidators(): CommunityValidator[] {
  return [
    { id: 'validator1', name: 'Alice' },
    { id: 'validator2', name: 'Bob' },
    { id: 'validator3', name: 'Carol' },
    { id: 'validator4', name: 'Dave' },
  ]
}

/**
 * Simula la validación comunitaria (mock, sin integración real).
 */
export function mockCommunityValidation(
  validator: CommunityValidator
): CommunityValidation {
  return {
    validatorId: validator.id,
    timestamp: Date.now(),
  }
}
