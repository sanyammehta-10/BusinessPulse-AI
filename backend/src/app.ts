import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/error-handler.js';
import { apiLimiter } from './middleware/rate-limit.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import businessRoutes from './routes/business.routes.js';
import dataRoutes from './routes/data.routes.js';
import importRoutes from './modules/import/import.routes.js';
import pulseAiRoutes from './modules/pulse-ai/pulse-ai.routes.js';
import metricsRoutes from './modules/metrics/metrics.routes.js';
import dataQualityRoutes from './modules/data-quality/data-quality.routes.js';
import forecastingRoutes from './modules/forecasting/forecasting.routes.js';
import simulationsRoutes from './modules/simulations/simulations.routes.js';

const app = express();

// ─── GLOBAL MIDDLEWARE ────────────────────────────

app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

// Rate limiting
app.use('/api', apiLimiter);

// ─── HEALTH CHECK ─────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// ─── API ROUTES ───────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/businesses/:businessId/data', dataRoutes);
app.use('/api/businesses/:businessId/pulse', pulseAiRoutes);
app.use('/api/businesses/:businessId/metrics', metricsRoutes);
app.use('/api/businesses/:businessId/data-quality', dataQualityRoutes);
app.use('/api/businesses/:businessId/forecasts', forecastingRoutes);
app.use('/api/businesses/:businessId/simulations', simulationsRoutes);
app.use('/api/import', importRoutes);

// ─── 404 HANDLER ──────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    code: 'NOT_FOUND',
  });
});

// ─── ERROR HANDLER ────────────────────────────────

app.use(errorHandler);

export default app;
