import swaggerJSDoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API DAO',
    version,
    description: 'Endpoints para el sistema de gobernanza DAO',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Servidor de desarrollo',
    },
  ],
  components: {
    schemas: {
      Proposal: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Identificador único de la propuesta',
          },
          title: {
            type: 'string',
            description: 'Título de la propuesta',
          },
          description: {
            type: 'string',
            description: 'Descripción detallada de la propuesta',
          },
          createdBy: {
            type: 'string',
            description: 'ID del usuario que creó la propuesta',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación de la propuesta',
          },
        },
      },
      Vote: {
        type: 'object',
        properties: {
          proposalId: {
            type: 'string',
            format: 'uuid',
            description: 'Identificador de la propuesta',
          },
          userId: {
            type: 'string',
            description: 'ID del usuario que votó',
          },
          value: {
            type: 'string',
            enum: ['yes', 'no'],
            description: 'Valor del voto: sí o no',
          },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Identificador único de la transacción',
          },
          type: {
            type: 'string',
            enum: ['INCOME', 'EXPENSE'],
            description: 'Tipo de transacción: ingreso o gasto',
          },
          amount: {
            type: 'string',
            description: 'Monto de la transacción (string para mantener precisión)',
          },
          asset: {
            type: 'string',
            enum: ['ERC20', 'ERC721', 'NATIVE'],
            description: 'Tipo de activo de la transacción',
          },
          asset_address: {
            type: 'string',
            description: 'Dirección del contrato del token (si aplica)',
          },
          token_id: {
            type: 'string',
            description: 'ID del token (para NFTs)',
          },
          from_address: {
            type: 'string',
            description: 'Dirección de origen',
          },
          to_address: {
            type: 'string',
            description: 'Dirección de destino',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha y hora de la transacción',
          },
          description: {
            type: 'string',
            description: 'Descripción opcional de la transacción',
          },
          budget_id: {
            type: 'string',
            format: 'uuid',
            description: 'ID del presupuesto asociado (si aplica)',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación del registro',
          },
          created_by: {
            type: 'string',
            format: 'uuid',
            description: 'ID del usuario que creó el registro',
          },
          blockchain_hash: {
            type: 'string',
            description: 'Hash de la transacción en blockchain (si aplica, se actualiza en creación, aprobación o ejecución)',
          },
        },
        example: {
          id: 'uuid',
          type: 'INCOME',
          amount: '100',
          asset: 'ERC20',
          asset_address: '0x...',
          from_address: '0x1',
          to_address: '0x2',
          timestamp: '2025-05-22T12:00:00Z',
          description: 'Ingreso test',
          budget_id: 'budget-uuid',
          created_at: '2025-05-22T12:00:00Z',
          created_by: 'user-id',
          blockchain_hash: '0xHASHBLOCKCHAIN...',
        },
      },
      Budget: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Identificador único del presupuesto',
          },
          name: {
            type: 'string',
            description: 'Nombre del presupuesto',
          },
          description: {
            type: 'string',
            description: 'Descripción detallada del presupuesto',
          },
          amount: {
            type: 'string',
            description: 'Monto del presupuesto (string para mantener precisión)',
          },
          asset: {
            type: 'string',
            enum: ['ERC20', 'ERC721', 'NATIVE'],
            description: 'Tipo de activo del presupuesto',
          },
          asset_address: {
            type: 'string',
            description: 'Dirección del contrato del token (si aplica)',
          },
          created_by: {
            type: 'string',
            format: 'uuid',
            description: 'ID del usuario que creó el presupuesto',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación del presupuesto',
          },
          approved: {
            type: 'boolean',
            description: 'Indica si el presupuesto ha sido aprobado',
          },
          approved_by: {
            type: 'string',
            format: 'uuid',
            description: 'ID del usuario que aprobó el presupuesto',
          },
          approved_at: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de aprobación del presupuesto',
          },
          executed: {
            type: 'boolean',
            description: 'Indica si el presupuesto ha sido ejecutado',
          },
          executed_at: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de ejecución del presupuesto',
          },
          blockchain_hash: {
            type: 'string',
            description: 'Hash de la transacción en blockchain (si aplica, se actualiza en aprobación/ejecución)',
          },
        },
        example: {
          id: 'uuid',
          name: 'Presupuesto ejemplo',
          amount: '1000',
          asset: 'ERC20',
          asset_address: '0x...',
          created_by: 'user-id',
          created_at: '2025-05-22T12:00:00Z',
          approved: true,
          approved_by: 'user-id',
          approved_at: '2025-05-22T12:10:00Z',
          executed: true,
          executed_at: '2025-05-22T12:20:00Z',
          blockchain_hash: '0xHASHBLOCKCHAIN_EXECUTE...',
        },
      },
      AuditLog: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Identificador único del log de auditoría',
          },
          action: {
            type: 'string',
            description: 'Acción realizada',
          },
          entity: {
            type: 'string',
            enum: ['TRANSACTION', 'BUDGET', 'WALLET'],
            description: 'Entidad sobre la que se realiza la acción',
          },
          entity_id: {
            type: 'string',
            format: 'uuid',
            description: 'ID de la entidad sobre la que se realiza la acción',
          },
          performed_by: {
            type: 'string',
            description: 'ID o dirección de quien realizó la acción',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha y hora del evento',
          },
          details: {
            type: 'object',
            description: 'Detalles adicionales del evento en formato JSON',
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/api/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
