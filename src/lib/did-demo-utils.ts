
import { didManager, SimpleDID, SimpleCredential } from './did-simple-mock';

export interface DemoParticipant {
  id: string;
  name: string;
  role: 'user' | 'moderator' | 'auditor';
  did: SimpleDID;
  credentials: SimpleCredential[];
}

export interface DemoScenario {
  name: string;
  description: string;
  participants: DemoParticipant[];
  steps: DemoStep[];
}

export interface DemoStep {
  stepNumber: number;
  actor: string;
  action: string;
  description: string;
  expectedResult: string;
  evidence?: SimpleCredential;
}

export class DIDDemoUtils {
  private participants: Map<string, DemoParticipant> = new Map();

  async createParticipant(name: string, role: 'user' | 'moderator' | 'auditor'): Promise<DemoParticipant> {
    console.log(`Creating participant: ${name} with role: ${role}`);
    
    const did = await didManager.createDID();
    
    const participant: DemoParticipant = {
      id: did.id,
      name,
      role,
      did,
      credentials: []
    };

    // Create initial identity credential
    const identityCredential = await didManager.createCredential(
      did.did,
      {
        id: did.id,
        name,
        role
      },
      ['VerifiableCredential', 'IdentityCredential']
    );

    participant.credentials.push(identityCredential);
    this.participants.set(participant.id, participant);
    
    console.log(`✅ Created participant ${name} with DID: ${did.did}`);
    return participant;
  }

  async issueParticipationCredential(issuer: DemoParticipant, recipient: DemoParticipant, activity: string): Promise<SimpleCredential> {
    console.log(`${issuer.name} issuing participation credential to ${recipient.name} for: ${activity}`);
    
    const credential = await didManager.createCredential(
      issuer.did.did,
      {
        id: recipient.did.id,
        participantName: recipient.name,
        activity,
        timestamp: new Date().toISOString(),
        issuer: issuer.name
      },
      ['VerifiableCredential', 'ParticipationCredential']
    );

    recipient.credentials.push(credential);
    
    console.log(`✅ Issued participation credential for ${activity}`);
    return credential;
  }

  async auditParticipant(auditor: DemoParticipant, participant: DemoParticipant): Promise<{ verified: boolean; report: string }> {
    console.log(`${auditor.name} auditing ${participant.name}'s credentials...`);
    
    const auditResults = [];
    let allVerified = true;

    for (const credential of participant.credentials) {
      const verification = await didManager.verifyCredential(credential);
      auditResults.push({
        credentialId: credential.id,
        type: credential.type,
        verified: verification.verified,
        error: verification.error
      });
      
      if (!verification.verified) {
        allVerified = false;
      }
    }

    const auditCredential = await didManager.createCredential(
      auditor.did.did,
      {
        auditedParticipant: participant.name,
        auditedDID: participant.did.did,
        auditTimestamp: new Date().toISOString(),
        credentialsVerified: auditResults.length,
        allCredentialsValid: allVerified,
        auditResults
      },
      ['VerifiableCredential', 'AuditCredential']
    );

    auditor.credentials.push(auditCredential);

    const report = `Audit Report for ${participant.name}:\n` +
                  `- Credentials verified: ${auditResults.length}\n` +
                  `- All valid: ${allVerified ? 'Yes' : 'No'}\n` +
                  `- Audit performed by: ${auditor.name}\n` +
                  `- Audit DID: ${auditor.did.did}`;

    console.log(`✅ Audit completed. All credentials valid: ${allVerified}`);
    return { verified: allVerified, report };
  }

  getParticipant(id: string): DemoParticipant | undefined {
    return this.participants.get(id);
  }

  getAllParticipants(): DemoParticipant[] {
    return Array.from(this.participants.values());
  }

  exportAuditTrail(): any {
    return {
      timestamp: new Date().toISOString(),
      participants: this.getAllParticipants().map(p => ({
        name: p.name,
        role: p.role,
        did: p.did.did,
        credentialCount: p.credentials.length,
        credentials: p.credentials.map(c => ({
          id: c.id,
          type: c.type,
          issuer: c.issuer,
          issuanceDate: c.issuanceDate,
          verified: true // Since we're using mocks, assume all are verified
        }))
      })),
      totalCredentials: didManager.getCredentials().length,
      totalIdentities: didManager.getIdentities().length
    };
  }
}

export const demoUtils = new DIDDemoUtils();
