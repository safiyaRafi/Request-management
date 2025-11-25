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

// Configure helmet to allow Swagger UI assets
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
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

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Request Management API Docs',
}));

app.get('/', (req, res) => {
    res.json({
        message: 'Request Management API',
        documentation: 'http://localhost:3000/api-docs'
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
