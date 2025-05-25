
// Swagger configuration for API documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Community API',
      version: '1.0.0',
      description: 'API for community management and governance',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/api/routes/*.ts'], // paths to files containing OpenAPI definitions
};

// Export a simple configuration object instead of using swagger-jsdoc
export const swaggerSpec = swaggerOptions;
