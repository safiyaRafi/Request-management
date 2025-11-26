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
    // Use absolute paths that work in both dev and production
    apis: [
        path.join(__dirname, '../routes/*.ts'),
        path.join(__dirname, '../routes/*.js'),
        path.join(__dirname, '../controllers/*.ts'),
        path.join(__dirname, '../controllers/*.js'),
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

