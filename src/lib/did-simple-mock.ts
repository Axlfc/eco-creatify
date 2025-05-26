
export interface SimpleDID {
  did: string;
  document: DIDDocument;
}

export interface SimpleCredential {
  id: string;
  type: string[];
  issuer: string;
  subject: string;
  issuanceDate: string;
}

export interface DIDDocument {
  '@context': string[];
  id: string;
  verificationMethod: any[];
  authentication: string[];
  assertionMethod: string[];
  keyAgreement: string[];
  capabilityInvocation: string[];
  capabilityDelegation: string[];
}

export class SimpleDIDManager {
  private identities: SimpleDID[] = [];
  private credentials: SimpleCredential[] = [];

  async createIdentity(): Promise<SimpleDID> {
    const did = `did:key:${Math.random().toString(36).substring(2, 15)}`;
    const identity: SimpleDID = {
      did,
      document: {
        '@context': ['https://www.w3.org/ns/did/v1'],
        id: did,
        verificationMethod: [],
        authentication: [did + '#key-1'],
        assertionMethod: [did + '#key-1'],
        keyAgreement: [did + '#key-1'],
        capabilityInvocation: [did + '#key-1'],
        capabilityDelegation: [did + '#key-1'],
      }
    };
    this.identities.push(identity);
    return identity;
  }

  async createCredential(issuer: string, subject: string, type: string[]): Promise<SimpleCredential> {
    const credential: SimpleCredential = {
      id: `vc:${Math.random().toString(36).substring(2, 15)}`,
      type,
      issuer,
      subject,
      issuanceDate: new Date().toISOString(),
    };
    this.credentials.push(credential);
    return credential;
  }

  async getCredentials(): Promise<SimpleCredential[]> {
    return this.credentials;
  }

  async getIdentities(): Promise<SimpleDID[]> {
    return this.identities;
  }
}

export const didManager = new SimpleDIDManager();
