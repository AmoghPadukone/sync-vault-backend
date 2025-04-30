import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerComponents } from '../swagger';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SyncVault API',
            version: '1.0.0',
            description: 'Backend API documentation for the SyncVault platform',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local dev server',
            },
        ],
        components: swaggerComponents,
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
