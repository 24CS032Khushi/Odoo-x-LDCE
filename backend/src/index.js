import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth/auth.routes.js';
import userRoutes from './users/users.routes.js';
import { errorHandler, AppError } from './shared/error-handler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman) or matching frontend
      if (!origin || origin === FRONTEND_URL || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for hackathon local dev
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

// API Prefix
const API_PREFIX = '/api/v1';

// Health check endpoint
app.get(`${API_PREFIX}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      app: 'GlobeTrotter Smart API',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  });
});

// Mount Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);

// Handle unknown routes
app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found on this server.`, 404, 'NOT_FOUND'));
});

// Shared Error Handler Middleware
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test' && !process.argv[1]?.includes('verify-api.js')) {
  app.listen(PORT, () => {
    console.log(`[GlobeTrotter API] Server running on http://localhost:${PORT}`);
    console.log(`[GlobeTrotter API] Prefix: ${API_PREFIX}`);
  });
}

export default app;
