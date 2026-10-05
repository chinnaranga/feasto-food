import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Feasto Backend API V2',
      version: '2.0.0',
      description:
        'Enterprise-grade multi-tenant REST & Realtime API powering Customer App, Restaurant Portal, Rider App, and Admin Platform.',
      contact: {
        name: 'Feasto Platform Engineering',
        email: 'engineering@feasto.app',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'V1 API Gateway',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token to authenticate',
        },
      },
      schemas: {
        StandardSuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed successfully' },
            data: { type: 'object' },
            timestamp: { type: 'string', example: '2026-07-28T19:00:00.000Z' },
          },
        },
        StandardErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'BAD_REQUEST' },
                message: { type: 'string', example: 'Invalid request parameters' },
                details: { type: 'object', nullable: true },
              },
            },
            timestamp: { type: 'string', example: '2026-07-28T19:00:00.000Z' },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.ts', './src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
