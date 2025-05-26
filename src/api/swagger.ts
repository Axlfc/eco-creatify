
import { OpenAPIV3 } from 'openapi-types';

export const swaggerSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Citizen Platform API',
    version: '1.0.0',
    description: 'API for citizen proposals and participation platform',
  },
  servers: [
    {
      url: '/api',
      description: 'Development server',
    },
  ],
  paths: {
    '/proposals': {
      get: {
        summary: 'Get all proposals',
        tags: ['Proposals'],
        responses: {
          '200': {
            description: 'List of proposals',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Proposal'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a new proposal',
        tags: ['Proposals'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProposalInput'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Proposal created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Proposal'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Proposal: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          createdBy: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      ProposalInput: {
        type: 'object',
        required: ['title', 'description'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' }
        }
      }
    }
  }
};

export default swaggerSpec;
