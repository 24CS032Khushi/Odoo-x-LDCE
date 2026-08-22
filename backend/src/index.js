import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth/auth.routes.js';
import userRoutes from './users/users.routes.js';
import cityRoutes from './cities/cities.routes.js';
import activityRoutes from './activities/activities.routes.js';
import tripRoutes from './trips/trips.routes.js';
import savedDestinationRoutes from './saved-destinations/saved-destinations.routes.js';
import shareRoutes from './share/share.routes.js';
import adminRoutes from './admin/admin.routes.js';
import { errorHandler, AppError } from './shared/error-handler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true); // Permissive for local dev & hackathon testing
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
      version: '4.0.0',
      timestamp: new Date().toISOString()
    }
  });
});

// Mount Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/cities`, cityRoutes);
app.use(`${API_PREFIX}/activities`, activityRoutes);
app.use(`${API_PREFIX}/trips`, tripRoutes);
app.use(`${API_PREFIX}/saved-destinations`, savedDestinationRoutes);
app.use(`${API_PREFIX}/share`, shareRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);

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
