import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Insignia Wallet API',
      version: '1.0.0',
      description: 'API documentation for the Insignia Crypto Wallet application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server (direct)',
      },
      {
        url: 'http://localhost:5173/api',
        description: 'Development server (via Vite proxy)',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
