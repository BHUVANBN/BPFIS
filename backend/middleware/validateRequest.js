const { validationResult } = require('express-validator');
const { BadRequestError } = require('../utils/errors');

/**
 * Middleware to validate request using express-validator
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value,
      location: error.location
    }));
    
    throw new BadRequestError('Validation failed', errorMessages);
  }
  
  next();
};

/**
 * Async handler to wrap route handlers for better error handling
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped route handler with error handling
 */
const asyncHandler = function(fn) {
  return function(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Error handling middleware
 * @param {Error} err - Error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
const errorHandler = function(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      ...(err.errors && { errors: err.errors })
    },
    body: req.body,
    params: req.params,
    query: req.query,
    user: req.user ? { id: req.user._id, role: req.user.role } : undefined
  });

  // Default status code
  const statusCode = err.statusCode || 500;
  
  // Hide sensitive error details in production
  const errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      ...(err.errors && { errors: err.errors })
    })
  };

  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found middleware
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
const notFoundHandler = function(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
};

module.exports = {
  validateRequest,
  asyncHandler,
  errorHandler,
  notFoundHandler
};
