import { OpenAPIV3 } from 'openapi-types';

const swaggerSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'API de Propuestas y Votaciones',
    version: '1.0.0',
    description: 'Documentación de la API para gestión de propuestas y votaciones',
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
    },
  },
};

export default swaggerSpec;
