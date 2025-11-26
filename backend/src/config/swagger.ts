import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Request Management API',
            version: '1.0.0',
            description: 'API documentation for Request Management System',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
            {
                url: 'https://request-management.vercel.app',
                description: 'Production server',
            },
        ],
        components: {
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
    },
    // In production (Vercel), __dirname will be dist/config
    // So we need to go up one level and then into routes/controllers
    // Only use .js files since .ts files don't exist in production
    apis: [
        path.join(__dirname, '..', 'routes', '*.js'),
        path.join(__dirname, '..', 'controllers', '*.js'),
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;


