import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/config.js';
import { connectToDatabases } from './config/db.js';
import { errorHandler, notFoundHandler } from './middleware/validateRequest.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import landRoutes from './routes/landRoutes.js';
import documentRoutes from './routes/documentRoutes.js';

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors(config.CORS_OPTIONS));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  message: { 
    success: false,
    message: 'Too many requests, please try again later.' 
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging
if (config.NODE_ENV === 'development') {
  const morgan = await import('morgan');
  app.use(morgan.default('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    version: config.API_VERSION
  });
});

// API routes
app.use(`/api/${config.API_VERSION}/auth`, authRoutes);
app.use(`/api/${config.API_VERSION}/users`, userRoutes);
app.use(`/api/${config.API_VERSION}/lands`, landRoutes);
app.use(`/api/${config.API_VERSION}/lands`, documentRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Connect to databases and start server
const startServer = async () => {
  try {
    await connectToDatabases();
    console.log('Connected to databases');
    
    const server = app.listen(config.PORT, () => {
      console.log(`\n✅ Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
      console.log(`📄 API Documentation: http://localhost:${config.PORT}/api-docs`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err);
      server.close(() => process.exit(1));
    });

    // Handle SIGTERM
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        console.log('💥 Process terminated!');
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Start the server
startServer();
