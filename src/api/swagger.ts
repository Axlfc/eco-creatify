import { OpenAPIV3 } from 'openapi-types';

const swaggerSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'API de Propuestas y Votaciones',
    version: '1.0.0',
    description: `Documentación de la API para gestión de propuestas y votaciones.

# Autenticación con Supabase

Esta API utiliza **JWT emitidos por Supabase Auth** para autenticar y autorizar a los usuarios. No existen endpoints propios de registro/login: el flujo de autenticación debe realizarse en el frontend/web usando Supabase, y el JWT obtenido se debe enviar en la cabecera HTTP Authorization.

## ¿Cómo obtener el JWT de Supabase?

En el frontend, tras iniciar sesión con Supabase, puedes obtener el JWT así:

**JavaScript (Supabase JS v2):**
\`\`\`js
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
const jwt = data.session.access_token;
\`\`\`

## Uso de la cabecera Authorization

Incluye el JWT en cada petición protegida:

\`\`\`
Authorization: Bearer <JWT_SUPABASE>
\`\`\`

## Ejemplos prácticos

### curl
\`\`\`bash
curl -H "Authorization: Bearer <JWT_SUPABASE>" http://localhost:3001/api/proposals
\`\`\`

### Postman
- En la pestaña Authorization, selecciona tipo "Bearer Token" e ingresa el JWT de Supabase.

### JavaScript fetch
\`\`\`js
fetch('http://localhost:3001/api/proposals', {
  headers: { 'Authorization': 'Bearer ' + jwt }
})
  .then(r => r.json())
  .then(console.log);
\`\`\`

> **Nota:** Si el token es inválido o falta, la API responderá con 401/403.

# Interoperabilidad

- La API acepta cualquier JWT válido emitido por Supabase Auth.
- Puedes integrar clientes web, móviles o servidores externos que usen Supabase Auth.

Para más detalles, revisa los esquemas y ejemplos de cada endpoint abajo.
`,
  },
  servers: [
    { url: 'http://localhost:3001' },
  ],
  paths: {
    '/api/proposals': {
      get: {
        summary: 'Listar propuestas',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1, minimum: 1 },
            description: 'Número de página',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10, minimum: 1 },
            description: 'Cantidad de resultados por página',
          },
          {
            name: 'sort',
            in: 'query',
            schema: { type: 'string', enum: ['createdAt'], default: 'createdAt' },
            description: 'Campo por el que ordenar',
          },
          {
            name: 'order',
            in: 'query',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
            description: 'Dirección de ordenamiento',
          },
          {
            name: 'title',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filtrar por título (búsqueda parcial, insensible a mayúsculas)',
          },
        ],
        responses: {
          '200': {
            description: 'Lista de propuestas paginada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Proposal' },
                    },
                    page: { type: 'integer' },
                    limit: { type: 'integer' },
                    total: { type: 'integer' },
                    totalPages: { type: 'integer' },
                  },
                },
              },
            },
          },
          '401': { description: 'Token requerido' },
          '403': { description: 'Token inválido' },
        },
      },
      post: {
        summary: 'Crear propuesta',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                },
                required: ['title', 'description'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Propuesta creada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Proposal' },
              },
            },
          },
          '400': { description: 'Título y descripción requeridos' },
          '401': { description: 'Token requerido' },
        },
      },
    },
    '/api/proposals/{id}/vote': {
      post: {
        summary: 'Votar por una propuesta',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  value: { type: 'string', enum: ['yes', 'no'] },
                },
                required: ['value'],
              },
            },
          },
        },
        responses: {
          '201': { description: 'Voto registrado' },
          '400': { description: 'El voto debe ser "yes" o "no"' },
          '401': { description: 'Token requerido' },
          '404': { description: 'Propuesta no encontrada' },
          '409': { description: 'Ya has votado en esta propuesta' },
        },
      },
    },
    '/api/proposals/{id}/results': {
      get: {
        summary: 'Ver resultados de una propuesta',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Resultados de la propuesta',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    yes: { type: 'integer' },
                    no: { type: 'integer' },
                    total: { type: 'integer' },
                  },
                },
              },
            },
          },
          '401': { description: 'Token requerido' },
          '404': { description: 'Propuesta no encontrada' },
        },
      },
    },
    '/api/proposals/{id}/snapshots': {
      get: {
        summary: 'Obtener historial de snapshots de una propuesta',
        description: 'Devuelve la cadena de snapshots (auditoría de estado y votos) de una propuesta. Requiere autenticación JWT Supabase.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID de la propuesta',
          },
        ],
        responses: {
          '200': {
            description: 'Cadena de snapshots de la propuesta',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    snapshots: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/VoteSnapshot' },
                    },
                  },
                },
                examples: {
                  ejemplo: {
                    value: {
                      snapshots: [
                        {
                          id: '1',
                          timestamp: 1716400000000,
                          state: 'open',
                          votes: [],
                          event: 'created',
                          prevSnapshotHash: null,
                          hash: 'abc123...'
                        },
                        {
                          id: '1',
                          timestamp: 1716400010000,
                          state: 'open',
                          votes: [
                            { voterHash: 'hash1', option: 'yes', voteTimestamp: 1716400010000 }
                          ],
                          event: 'vote',
                          prevSnapshotHash: 'abc123...',
                          hash: 'def456...'
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          '401': { description: 'No autenticado' },
          '404': { description: 'Propuesta no encontrada' }
        }
      }
    },
    '/api/treasury/transactions': {
      get: {
        summary: 'Listar transacciones de tesorería',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de transacciones',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/TreasuryTransaction' },
                    },
                  },
                },
                examples: {
                  ejemplo: {
                    value: {
                      data: [
                        {
                          id: 'tx1',
                          type: 'INCOME',
                          amount: '1000',
                          asset: 'ERC20',
                          from: '0x...',
                          to: '0x...',
                          timestamp: '2025-05-22T12:00:00Z',
                          description: 'Ingreso inicial',
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Token requerido' },
        },
      },
      post: {
        summary: 'Registrar transacción de tesorería',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TreasuryTransaction' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Transacción registrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TreasuryTransaction' },
              },
            },
          },
          '400': { description: 'Datos inválidos' },
          '401': { description: 'Token requerido' },
        },
      },
    },
    '/api/treasury/budgets': {
      get: {
        summary: 'Listar presupuestos',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de presupuestos',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/TreasuryBudget' },
                    },
                  },
                },
                examples: {
                  ejemplo: {
                    value: {
                      data: [
                        {
                          id: 'b1',
                          name: 'Presupuesto 2025',
                          amount: '5000',
                          asset: 'ERC20',
                          createdBy: '0x...',
                          approved: false,
                          executed: false,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Token requerido' },
        },
      },
      post: {
        summary: 'Crear presupuesto',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TreasuryBudget' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Presupuesto creado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TreasuryBudget' },
              },
            },
          },
          '400': { description: 'Datos inválidos' },
          '401': { description: 'Token requerido' },
        },
      },
    },
    '/api/treasury/audits': {
      get: {
        summary: 'Listar logs de auditoría',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de logs de auditoría',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/TreasuryAudit' },
                    },
                  },
                },
                examples: {
                  ejemplo: {
                    value: {
                      data: [
                        {
                          id: 'a1',
                          action: 'CREATE_BUDGET',
                          entity: 'BUDGET',
                          entityId: 'b1',
                          performedBy: '0x...',
                          timestamp: '2025-05-22T12:00:00Z',
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Token requerido' },
        },
      },
      post: {
        summary: 'Registrar evento de auditoría',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TreasuryAudit' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Evento de auditoría registrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TreasuryAudit' },
              },
            },
          },
          '400': { description: 'Datos inválidos' },
          '401': { description: 'Token requerido' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Proposal: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          createdBy: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      VoteSnapshot: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          timestamp: { type: 'integer' },
          state: { type: 'string' },
          votes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                voterHash: { type: 'string' },
                option: { type: 'string' },
                voteTimestamp: { type: 'integer' },
              }
            }
          },
          event: { type: 'string' },
          prevSnapshotHash: { type: 'string', nullable: true },
          hash: { type: 'string' },
        }
      },
      TreasuryTransaction: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
          amount: { type: 'string' },
          asset: { type: 'string', enum: ['ERC20', 'ERC721', 'NATIVE'] },
          assetAddress: { type: 'string', nullable: true },
          tokenId: { type: 'string', nullable: true },
          from: { type: 'string' },
          to: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          description: { type: 'string', nullable: true },
          budgetId: { type: 'string', nullable: true },
        },
      },
      TreasuryBudget: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          amount: { type: 'string' },
          asset: { type: 'string', enum: ['ERC20', 'ERC721', 'NATIVE'] },
          assetAddress: { type: 'string', nullable: true },
          createdBy: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          approved: { type: 'boolean' },
          approvedBy: { type: 'string', nullable: true },
          approvedAt: { type: 'string', format: 'date-time', nullable: true },
          executed: { type: 'boolean' },
          executedAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      TreasuryAudit: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          action: { type: 'string' },
          entity: { type: 'string', enum: ['TRANSACTION', 'BUDGET', 'WALLET'] },
          entityId: { type: 'string' },
          performedBy: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          details: { type: 'string', nullable: true },
        },
      },
    },
  },
};

export default swaggerSpec;
