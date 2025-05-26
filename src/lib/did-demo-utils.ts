
import { didManager, SimpleDID, SimpleCredential } from './did-simple-mock';
import { CommunityValidator, CommunityValidation } from '../types/did-demo';

// Mock validators
const mockValidators: CommunityValidator[] = [
  { id: 'val1', name: 'Validator Alice' },
  { id: 'val2', name: 'Validator Bob' },
  { id: 'val3', name: 'Validator Charlie' },
  { id: 'val4', name: 'Validator Diana' },
];

export async function createDIDWithValidation(
  minValidations: number = 3
): Promise<{ identity: SimpleDID; credential?: SimpleCredential; validations: CommunityValidation[] }> {
  
  console.log('Creating new DID identity...');
  const identity = await didManager.createIdentity();
  console.log('DID created:', identity.did);
  
  // Simulate community validations
  console.log('Requesting community validations...');
  const validations: CommunityValidation[] = [];
  
  for (let i = 0; i < Math.min(minValidations, mockValidators.length); i++) {
    const validator = mockValidators[i];
    const validation: CommunityValidation = {
      validatorId: validator.id,
      timestamp: Date.now() - (i * 1000), // Stagger timestamps
    };
    validations.push(validation);
    console.log(`Validation received from ${validator.name}`);
  }
  
  let credential: SimpleCredential | undefined;
  
  if (validations.length >= minValidations) {
    console.log('Minimum validations reached. Issuing credential...');
    credential = await didManager.createCredential(
      identity.did,
      identity.did,
      ['VerifiableCredential', 'ProofOfHumanity']
    );
    console.log('Credential issued:', credential.id);
  } else {
    console.log('Insufficient validations. No credential issued.');
  }
  
  return { identity, credential, validations };
}

export async function validateIdentityWithCommunity(
  subjectDID: string,
  validatorIds: string[]
): Promise<{ credential?: SimpleCredential; validations: CommunityValidation[] }> {
  
  console.log(`Validating identity: ${subjectDID}`);
  const validations: CommunityValidation[] = [];
  
  for (const validatorId of validatorIds) {
    const validator = mockValidators.find(v => v.id === validatorId);
    if (validator) {
      const validation: CommunityValidation = {
        validatorId: validator.id,
        timestamp: Date.now(),
      };
      validations.push(validation);
      console.log(`Identity validated by ${validator.name}`);
    }
  }
  
  let credential: SimpleCredential | undefined;
  
  if (validations.length >= 3) {
    credential = await didManager.createCredential(
      subjectDID,
      subjectDID,
      ['VerifiableCredential', 'CommunityValidated']
    );
    console.log('Community validation credential issued');
  }
  
  return { credential, validations };
}

export async function createProofOfHumanityCredential(
  subjectDID: string,
  validations: CommunityValidation[]
): Promise<SimpleCredential> {
  
  console.log('Creating Proof of Humanity credential...');
  
  if (validations.length < 3) {
    throw new Error('Insufficient validations for Proof of Humanity');
  }
  
  const credential = await didManager.createCredential(
    subjectDID,
    subjectDID,
    ['VerifiableCredential', 'ProofOfHumanity', 'CommunityValidated']
  );
  
  console.log('Proof of Humanity credential created:', credential.id);
  return credential;
}

export function getMockValidators(): CommunityValidator[] {
  return mockValidators;
}

export async function simulateFullDIDFlow(): Promise<void> {
  console.log('=== Starting DID Community Validation Demo ===');
  
  try {
    // Create identity and get validations
    const result = await createDIDWithValidation(3);
    
    console.log('\n=== Results ===');
    console.log('Identity DID:', result.identity.did);
    console.log('Validations received:', result.validations.length);
    console.log('Credential issued:', result.credential ? 'Yes' : 'No');
    
    if (result.credential) {
      console.log('Credential ID:', result.credential.id);
      console.log('Credential types:', result.credential.type.join(', '));
    }
    
    // Show current state
    const allCredentials = await didManager.getCredentials();
    const allIdentities = await didManager.getIdentities();
    
    console.log('\n=== System State ===');
    console.log('Total identities:', allIdentities.length);
    console.log('Total credentials:', allCredentials.length);
    
  } catch (error) {
    console.error('Demo failed:', error);
  }
}
