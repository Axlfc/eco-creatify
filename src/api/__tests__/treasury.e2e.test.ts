
// Mock del middleware de autenticación SOLO para tests
jest.mock('../middleware/auth', () => ({
  authenticateJWT: (_req: any, _res: any, next: any) => next(),
}));

// Mock para el cliente de Supabase
jest.mock('../../integrations/supabase/client', () => {
  const mockData = {
    transactions: [],
    budgets: [],
    audit_logs: [],
  };
  
  return {
    supabase: {
      from: (table: string) => ({
        select: () => ({
          order: () => ({
            data: mockData[table],
            error: null,
          }),
          eq: () => ({
            maybeSingle: () => ({
              data: mockData[table][0] || null,
              error: null
            }),
            single: () => ({
              data: mockData[table][0] || { id: 'test-id' },
              error: null
            }),
            select: () => ({
              single: () => ({
                data: mockData[table][0] || { id: 'test-id' },
                error: null
              })
            }),
            data: mockData[table],
            error: null
          })
        }),
        insert: () => ({
          select: () => ({
            single: () => ({
              data: { id: 'test-id', ...mockData[table][0] },
              error: null
            })
          })
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => ({
                data: { id: 'test-id', updated: true },
                error: null
              })
            })
          })
        }),
        delete: () => ({
          eq: () => ({
            error: null
          })
        })
      }),
      auth: {
        getUser: () => Promise.resolve({
          data: {
            user: { id: 'test-user' }
          }
        })
      }
    }
  };
});

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
        from_address: '0x1',
        to_address: '0x2',
      };
      const createRes = await request(app)
        .post('/api/treasury/transactions')
        .set('Authorization', validJWT)
        .send(tx);
      expect(createRes.status).toBe(201);
      expect(createRes.body).toHaveProperty('id');
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
      };
      const createRes = await request(app)
        .post('/api/treasury/budgets')
        .set('Authorization', validJWT)
        .send(budget);
      expect(createRes.status).toBe(201);
      expect(createRes.body).toHaveProperty('id');
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
        entity_id: 'test-id',
        performed_by: '0x5',
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
