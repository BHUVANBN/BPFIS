require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PORT, NODE_ENV, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX, API_VERSION } = require('./config/config');
const { initializeConnections } = require('./config/db');
const { errorHandler, notFoundHandler } = require('./middleware/validateRequest');
const { initializeModels } = require('./models/User');
const { initializeLandModel } = require('./models/Land');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const { CORS_OPTIONS } = require('./config/config');

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', CORS_OPTIONS.origin);
  res.header('Access-Control-Allow-Methods', CORS_OPTIONS.methods.join(','));
  res.header('Access-Control-Allow-Headers', CORS_OPTIONS.allowedHeaders.join(','));
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Rate limiting - ensure values are numbers
const limiter = rateLimit({
  windowMs: Number(RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes default
  max: Number(RATE_LIMIT_MAX) || 100, // 100 requests per window
  message: { 
    success: false,
    message: 'Too many requests, please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to all API routes
app.use(`/api/${API_VERSION}`, limiter);

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging
if (NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: API_VERSION
  });
});

// Connect to databases and start server
const startServer = async () => {
  try {
    // 1. Initialize database connections first
    await initializeConnections();
    
    // 2. Initialize models in the correct order
    await initializeModels();
    await initializeLandModel();
    
    console.log('All models initialized successfully');
    console.log('Connected to databases');
    
    // 3. Now that models are initialized, import routes that depend on them
    const authRoutes = require('./routes/authRoutes');
    const userRoutes = require('./routes/userRoutes');
    const landRoutes = require('./routes/landRoutes');
    const documentRoutes = require('./routes/documentRoutes');
    const productRoutes = require('./routes/productRoutes');
    const supplierRoutes = require('./routes/supplierRoutes');
    const farmerRoutes = require('./routes/farmerRoutes');
    const adminRoutes = require('./routes/adminRoutes');
    const messageRoutes = require('./routes/messageRoutes');
    const announcementRoutes = require('./routes/announcementRoutes');
    const sponsoredRoutes = require('./routes/sponsoredRoutes');
    const schemeRoutes = require('./routes/schemeRoutes');

    // 4. Set up routes
    app.use(`/api/${API_VERSION}/auth`, authRoutes);
    app.use(`/api/${API_VERSION}/users`, userRoutes);
    app.use(`/api/${API_VERSION}/lands`, landRoutes);
    app.use(`/api/${API_VERSION}/documents`, documentRoutes);
    app.use(`/api/${API_VERSION}/products`, productRoutes);
    app.use(`/api/${API_VERSION}/supplier`, supplierRoutes);
    app.use(`/api/${API_VERSION}/farmer`, farmerRoutes);
    app.use(`/api/${API_VERSION}/admin`, adminRoutes);
    app.use(`/api/${API_VERSION}/messages`, messageRoutes);
    app.use(`/api/${API_VERSION}/announcements`, announcementRoutes);
    app.use(`/api/${API_VERSION}/sponsor`, sponsoredRoutes);
    app.use(`/api/${API_VERSION}/schemes`, schemeRoutes);
    
    // 5. 404 handler (must be after all other routes)
    app.use(notFoundHandler);
    
    // 6. Error handling middleware (must be last)
    app.use(errorHandler);
    
    // 7. Start the server
    const server = app.listen(PORT, () => {
      console.log(`\n✅ Server running in ${NODE_ENV} mode on port ${PORT}`);
      console.log(`📄 API Documentation: http://localhost:${PORT}/api-docs`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      if (server) {
        server.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      if (server) {
        server.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });

    // Handle SIGTERM
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      if (server) {
        server.close(() => {
          console.log('💥 Process terminated!');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Start the server
startServer();
