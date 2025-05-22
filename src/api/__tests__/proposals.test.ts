import request from 'supertest';
import app from '../index';

describe('GET /api/proposals', () => {
  it('requiere autenticación', async () => {
    const res = await request(app).get('/api/proposals');
    expect(res.status).toBe(401);
  });

  it('devuelve propuestas si el JWT es válido', async () => {
    // Simula un JWT válido (en producción usar la clave pública de Supabase)
    const token = require('jsonwebtoken').sign({ sub: 'user1' }, 'dev-secret');
    const res = await request(app)
      .get('/api/proposals')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('POST /api/proposals', () => {
  const token = require('jsonwebtoken').sign({ sub: 'user2' }, 'dev-secret');
  it('requiere autenticación', async () => {
    const res = await request(app).post('/api/proposals').send({ title: 't', description: 'd' });
    expect(res.status).toBe(401);
  });
  it('valida campos requeridos', async () => {
    const res = await request(app)
      .post('/api/proposals')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' });
    expect(res.status).toBe(400);
  });
  it('crea una propuesta', async () => {
    const res = await request(app)
      .post('/api/proposals')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Nueva', description: 'Desc' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Nueva');
  });
});

describe('POST /api/proposals/:id/vote', () => {
  const token = require('jsonwebtoken').sign({ sub: 'user3' }, 'dev-secret');
  let proposalId: string;
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/proposals')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Votable', description: 'Desc' });
    proposalId = res.body.id;
  });
  it('requiere autenticación', async () => {
    const res = await request(app).post(`/api/proposals/${proposalId}/vote`).send({ value: 'yes' });
    expect(res.status).toBe(401);
  });
  it('valida valor de voto', async () => {
    const res = await request(app)
      .post(`/api/proposals/${proposalId}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 'maybe' });
    expect(res.status).toBe(400);
  });
  it('registra un voto', async () => {
    const res = await request(app)
      .post(`/api/proposals/${proposalId}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 'yes' });
    expect(res.status).toBe(201);
  });
  it('no permite votar dos veces', async () => {
    await request(app)
      .post(`/api/proposals/${proposalId}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 'no' });
    const res = await request(app)
      .post(`/api/proposals/${proposalId}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 'yes' });
    expect(res.status).toBe(409);
  });
});

describe('GET /api/proposals/:id/results', () => {
  const token = require('jsonwebtoken').sign({ sub: 'user4' }, 'dev-secret');
  let proposalId: string;
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/proposals')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Resultados', description: 'Desc' });
    proposalId = res.body.id;
    await request(app)
      .post(`/api/proposals/${proposalId}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 'yes' });
  });
  it('requiere autenticación', async () => {
    const res = await request(app).get(`/api/proposals/${proposalId}/results`);
    expect(res.status).toBe(401);
  });
  it('devuelve resultados', async () => {
    const res = await request(app)
      .get(`/api/proposals/${proposalId}/results`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('yes');
    expect(res.body).toHaveProperty('no');
    expect(res.body).toHaveProperty('total');
  });
});

describe('GET /api/proposals paginación y filtrado', () => {
  const token = require('jsonwebtoken').sign({ sub: 'user5' }, 'dev-secret');
  beforeAll(async () => {
    // Crear varias propuestas para probar paginación y filtrado
    for (let i = 1; i <= 15; i++) {
      await request(app)
        .post('/api/proposals')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: `FiltroTest${i}`, description: `Desc${i}` });
    }
  });
  it('devuelve la primera página con el límite especificado', async () => {
    const res = await request(app)
      .get('/api/proposals?page=1&limit=5')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(5);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(5);
    expect(res.body.total).toBeGreaterThanOrEqual(15);
    expect(res.body.totalPages).toBeGreaterThanOrEqual(3);
  });
  it('devuelve la segunda página correctamente', async () => {
    const res = await request(app)
      .get('/api/proposals?page=2&limit=5')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.data.length).toBe(5);
  });
  it('filtra por título', async () => {
    const res = await request(app)
      .get('/api/proposals?title=FiltroTest1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].title).toContain('FiltroTest1');
  });
  it('ordena por fecha de creación descendente', async () => {
    const res = await request(app)
      .get('/api/proposals?sort=createdAt&order=desc&limit=2')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    const fechas = res.body.data.map((p: any) => new Date(p.createdAt).getTime());
    expect(fechas[0]).toBeGreaterThanOrEqual(fechas[1]);
  });
  it('ordena por fecha de creación ascendente', async () => {
    const res = await request(app)
      .get('/api/proposals?sort=createdAt&order=asc&limit=2')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    const fechas = res.body.data.map((p: any) => new Date(p.createdAt).getTime());
    expect(fechas[0]).toBeLessThanOrEqual(fechas[1]);
  });
});
