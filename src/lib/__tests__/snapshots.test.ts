import { createSnapshot, getSnapshots, Vote, VoteSnapshot } from '../snapshots';

describe('VoteSnapshot chain', () => {
  it('debe crear una cadena de snapshots consistente y auditable', () => {
    const id = 'votacion-1';
    const votos: Vote[] = [];
    // Snapshot inicial
    const s1 = createSnapshot({
      id,
      state: 'open',
      votes: [...votos],
      event: 'created',
      prevSnapshotHash: null,
    });
    // Primer voto
    votos.push({ voterHash: 'hash1', option: 'A', voteTimestamp: Date.now() });
    const s2 = createSnapshot({
      id,
      state: 'open',
      votes: [...votos],
      event: 'vote',
      prevSnapshotHash: s1.hash,
    });
    // Segundo voto
    votos.push({ voterHash: 'hash2', option: 'B', voteTimestamp: Date.now() });
    const s3 = createSnapshot({
      id,
      state: 'open',
      votes: [...votos],
      event: 'vote',
      prevSnapshotHash: s2.hash,
    });
    // Cierre
    const s4 = createSnapshot({
      id,
      state: 'closed',
      votes: [...votos],
      event: 'closed',
      prevSnapshotHash: s3.hash,
    });
    // Verifica la cadena de hashes
    expect(s2.prevSnapshotHash).toBe(s1.hash);
    expect(s3.prevSnapshotHash).toBe(s2.hash);
    expect(s4.prevSnapshotHash).toBe(s3.hash);
    // Verifica unicidad de hashes
    const hashes = [s1.hash, s2.hash, s3.hash, s4.hash];
    expect(new Set(hashes).size).toBe(4);
  });

  it('permite comparar el snapshot final con el histórico de eventos', () => {
    const id = 'votacion-2';
    const votos: Vote[] = [];
    const eventos: string[] = [];
    // Creación
    const s1 = createSnapshot({
      id,
      state: 'open',
      votes: [...votos],
      event: 'created',
      prevSnapshotHash: null,
    });
    eventos.push('created');
    // Voto
    votos.push({ voterHash: 'hash1', option: 'A', voteTimestamp: Date.now() });
    const s2 = createSnapshot({
      id,
      state: 'open',
      votes: [...votos],
      event: 'vote',
      prevSnapshotHash: s1.hash,
    });
    eventos.push('vote');
    // Cierre
    const s3 = createSnapshot({
      id,
      state: 'closed',
      votes: [...votos],
      event: 'closed',
      prevSnapshotHash: s2.hash,
    });
    eventos.push('closed');
    // El snapshot final debe reflejar todos los eventos
    expect(s3.votes.length).toBe(1);
    expect(eventos).toEqual(['created', 'vote', 'closed']);
    expect(s3.state).toBe('closed');
  });
});
