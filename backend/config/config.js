const dotenv = require('dotenv');

dotenv.config();

// Server configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS Configuration
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const CORS_OPTIONS = {
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600, // 10 minutes
  optionsSuccessStatus: 200
};

// Rate limiting
const RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || 100; // 100 requests per window

// API Versioning
const API_VERSION = process.env.API_VERSION || 'v1';

module.exports = {
  PORT,
  NODE_ENV,
  CORS_ORIGIN,
  CORS_OPTIONS,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX,
  API_VERSION
};

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

// MongoDB Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/farmchain';

// IPFS Configuration (Pinata)
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

// Add all exports to the module.exports object
Object.assign(module.exports, {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  MONGODB_URI,
  PINATA_API_KEY,
  PINATA_SECRET_API_KEY
});

// Google AI Configuration
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

// File Upload Configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

// Logging Configuration
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Add remaining exports to module.exports
Object.assign(module.exports, {
  GOOGLE_AI_API_KEY,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  LOG_LEVEL
});

// Validation
if (NODE_ENV === 'production') {
  if (!JWT_SECRET || JWT_SECRET === 'your-secret-key') {
    throw new Error('JWT_SECRET must be set in production environment');
  }
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI must be set in production environment');
  }
  if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
    console.warn('PINATA_API_KEY and PINATA_SECRET_API_KEY are required for file uploads');
  }
  if (!GOOGLE_AI_API_KEY) {
    console.warn('GOOGLE_AI_API_KEY is required for document processing');
  }
}
