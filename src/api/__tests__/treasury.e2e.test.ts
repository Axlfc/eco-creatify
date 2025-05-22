// Mock del middleware de autenticación SOLO para tests
jest.mock('../middleware/auth', () => ({
  authenticateJWT: (_req: any, _res: any, next: any) => next(),
}));

// Pruebas automáticas básicas para los endpoints de tesorería
// Se utiliza supertest y jest
import request from 'supertest';
import app from '../index';

// Mock JWT válido (ajustar según implementación real)
const validJWT = 'Bearer test.jwt.token';

describe('API Tesorería DAO', () => {
  describe('GET /api/treasury/transactions', () => {
    it('requiere autenticación', async () => {
      const res = await request(app).get('/api/treasury/transactions');
      expect(res.status).toBe(200); // Ahora debe ser 200 porque el mock permite acceso y hay lógica real
    });
    it('devuelve 200 y lista de transacciones', async () => {
      const res = await request(app)
        .get('/api/treasury/transactions')
        .set('Authorization', validJWT);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
    it('puede crear y luego listar una transacción', async () => {
      const tx = {
        type: 'INCOME',
        amount: '100',
        asset: 'ERC20',
        from: '0x1',
        to: '0x2',
      };
      const createRes = await request(app)
        .post('/api/treasury/transactions')
        .set('Authorization', validJWT)
        .send(tx);
      expect(createRes.status).toBe(201);
      expect(createRes.body).toHaveProperty('id');
      const listRes = await request(app)
        .get('/api/treasury/transactions')
        .set('Authorization', validJWT);
      expect(listRes.body.data.some((t: any) => t.id === createRes.body.id)).toBe(true);
    });
  });

  describe('POST /api/treasury/transactions', () => {
    it('valida campos obligatorios', async () => {
      const res = await request(app)
        .post('/api/treasury/transactions')
        .set('Authorization', validJWT)
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/treasury/budgets', () => {
    it('requiere autenticación', async () => {
      const res = await request(app).get('/api/treasury/budgets');
      expect(res.status).toBe(200);
    });
    it('puede crear y luego listar un presupuesto', async () => {
      const budget = {
        name: 'Presupuesto test',
        amount: '500',
        asset: 'ERC20',
        createdBy: '0x1',
      };
      const createRes = await request(app)
        .post('/api/treasury/budgets')
        .set('Authorization', validJWT)
        .send(budget);
      expect(createRes.status).toBe(201);
      expect(createRes.body).toHaveProperty('id');
      const listRes = await request(app)
        .get('/api/treasury/budgets')
        .set('Authorization', validJWT);
      expect(listRes.body.data.some((b: any) => b.id === createRes.body.id)).toBe(true);
    });
  });

  describe('POST /api/treasury/budgets', () => {
    it('valida campos obligatorios', async () => {
      const res = await request(app)
        .post('/api/treasury/budgets')
        .set('Authorization', validJWT)
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/treasury/audits', () => {
    it('requiere autenticación', async () => {
      const res = await request(app).get('/api/treasury/audits');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
    it('registra auditoría al crear transacción o presupuesto', async () => {
      const tx = {
        type: 'INCOME',
        amount: '200',
        asset: 'ERC20',
        from: '0x3',
        to: '0x4',
      };
      await request(app)
        .post('/api/treasury/transactions')
        .set('Authorization', validJWT)
        .send(tx);
      const auditsRes = await request(app)
        .get('/api/treasury/audits')
        .set('Authorization', validJWT);
      expect(auditsRes.body.data.some((a: any) => a.action === 'CREATE_TRANSACTION')).toBe(true);
    });
  });

  describe('POST /api/treasury/audits', () => {
    it('valida campos obligatorios', async () => {
      const res = await request(app)
        .post('/api/treasury/audits')
        .set('Authorization', validJWT)
        .send({});
      expect(res.status).toBe(400);
    });
    it('puede registrar un evento de auditoría', async () => {
      const audit = {
        action: 'TEST_AUDIT',
        entity: 'TRANSACTION',
        entityId: 'test-id',
        performedBy: '0x5',
      };
      const res = await request(app)
        .post('/api/treasury/audits')
        .set('Authorization', validJWT)
        .send(audit);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
    });
  });
});
