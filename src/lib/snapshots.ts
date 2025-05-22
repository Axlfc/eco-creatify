import crypto from 'crypto';

export interface Vote {
  voterHash: string;
  option: string;
  voteTimestamp: number;
}

export type SnapshotEvent = 'created' | 'vote' | 'closed' | string;

export interface VoteSnapshot {
  id: string;
  timestamp: number;
  state: string;
  votes: Vote[];
  event: SnapshotEvent;
  prevSnapshotHash: string | null;
  hash: string;
}

/**
 * Serializa un snapshot a JSON canónico (ordenando claves).
 */
export function serializeSnapshot(snapshot: Omit<VoteSnapshot, 'hash'>): string {
  // Ordena las claves para asegurar consistencia en el hash
  const ordered = {
    id: snapshot.id,
    timestamp: snapshot.timestamp,
    state: snapshot.state,
    votes: snapshot.votes.map(v => ({
      voterHash: v.voterHash,
      option: v.option,
      voteTimestamp: v.voteTimestamp,
    })),
    event: snapshot.event,
    prevSnapshotHash: snapshot.prevSnapshotHash,
  };
  return JSON.stringify(ordered);
}

/**
 * Calcula el hash SHA256 del snapshot serializado.
 */
export function calculateSnapshotHash(snapshot: Omit<VoteSnapshot, 'hash'>): string {
  const serialized = serializeSnapshot(snapshot);
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

/**
 * Crea un nuevo snapshot, calculando su hash y encadenándolo al anterior.
 */
export function createSnapshot(params: {
  id: string;
  state: string;
  votes: Vote[];
  event: SnapshotEvent;
  prevSnapshotHash: string | null;
}): VoteSnapshot {
  const timestamp = Date.now();
  const base = {
    id: params.id,
    timestamp,
    state: params.state,
    votes: params.votes,
    event: params.event,
    prevSnapshotHash: params.prevSnapshotHash,
  };
  const hash = calculateSnapshotHash(base);
  return { ...base, hash };
}

/**
 * Deserializa un snapshot desde JSON.
 */
export function deserializeSnapshot(json: string): VoteSnapshot {
  const obj = JSON.parse(json);
  return obj;
}

// Almacenamiento modular (por defecto: en memoria)
const snapshotStore: VoteSnapshot[] = [];

export function saveSnapshot(snapshot: VoteSnapshot) {
  snapshotStore.push(snapshot);
  // TODO: Integrar con IPFS/blockchain
}

export function getSnapshots(): VoteSnapshot[] {
  return [...snapshotStore];
}

// TODO: Implementar almacenamiento en archivo JSON o base de datos
// TODO: Integración con IPFS/blockchain para almacenamiento inmutable
