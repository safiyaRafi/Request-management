import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import requestRoutes from './routes/request.routes';
import logger from './utils/logger';

dotenv.config();

const app = express();

// Configure helmet - skip for api-docs to allow Swagger UI
app.use((req, res, next) => {
    if (req.path.startsWith('/api-docs')) {
        // Skip helmet for Swagger UI
        next();
    } else {
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    fontSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'"],
                },
            },
        })(req, res, next);
    }
});
// CORS configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://request-management.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        // Check exact match first
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        // Allow any vercel.app subdomain for flexibility (with or without protocol)
        if (origin && (origin.includes('.vercel.app') || origin.includes('vercel.app'))) {
            return callback(null, true);
        }

        // Log for debugging (remove in production if needed)
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(morgan('dev'));
app.use(json());

// Swagger documentation - serve JSON spec
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Serve Swagger UI static files explicitly
const swaggerUiPath = require('swagger-ui-dist').absolutePath();
app.use('/api-docs', express.static(swaggerUiPath));

// Swagger UI - serve custom HTML that loads our spec
app.get('/api-docs', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Request Management API Docs</title>
    <link rel="stylesheet" type="text/css" href="/api-docs/swagger-ui.css" />
    <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin:0; background: #fafafa; }
        .swagger-ui .topbar { display: none }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="/api-docs/swagger-ui-bundle.js"></script>
    <script src="/api-docs/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            window.ui = SwaggerUIBundle({
                url: "/api-docs.json",
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                persistAuthorization: true,
                displayRequestDuration: true
            });
        };
    </script>
</body>
</html>
    `);
});

app.get('/', (req, res) => {
    // Check for forwarded protocol (Vercel uses x-forwarded-proto)
    const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
    const host = req.get('host') || req.get('x-forwarded-host') || 'localhost:3000';
    const docsUrl = `${protocol}://${host}/api-docs`;
    res.json({
        message: 'Request Management API',
        documentation: docsUrl
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
