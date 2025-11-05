import dotenv from 'dotenv';

dotenv.config();

// Server configuration
export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || 'development';

// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

// MongoDB Configuration
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/farmchain';

// IPFS Configuration (Pinata)
export const PINATA_API_KEY = process.env.PINATA_API_KEY;
export const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

// Google AI Configuration
export const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

// File Upload Configuration
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

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

// CORS Configuration
export const CORS_OPTIONS = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Rate Limiting Configuration
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX = 100; // limit each IP to 100 requests per windowMs

// Logging Configuration
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// API Versioning
export const API_VERSION = 'v1';
