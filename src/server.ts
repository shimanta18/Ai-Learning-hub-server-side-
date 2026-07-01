import dotenv from 'dotenv';
// Load environment configurations before any other imports
dotenv.config();

// Core Initialization: Boot Firebase Admin SDK instantly
import './config/firebase';

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDatabase } from './config/db';
import { authRoutes } from './routes/auth.routes';
import aiRoutes from './routes/ai.routes';
import courseRoutes from './routes/courseRoutes';
import adminRoutes from './routes/admin.routes';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// 1. Security Hardening & Middleware
app.use(helmet());
app.use(express.json());

// 2. Dynamic CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or local server-to-server tools)
        if (!origin) return callback(null, true);

        // Check if the incoming origin exists in our allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// 3. Application API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/admin', adminRoutes);

// 4. Base System Monitoring (Health Check)
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        status: 'ONLINE',
        system: 'AI Learning Hub Gateway Active',
        timestamp: new Date().toISOString()
    });
});

// 5. Database Connection & Server Boot
connectDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`📡 Antigravity Core Server actively operating on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Critical failure initializing application gateway:', error);
        process.exit(1);
    });