/**
 * Base error class for custom errors
 * @extends Error
 */
class AppError extends Error {
  /**
   * Create a new AppError
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {Array} errors - Array of error details
   * @param {string} code - Error code
   */
  constructor(message, statusCode = 500, errors = [], code = '') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert error to JSON
   * @returns {Object} JSON representation of the error
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      ...(this.errors.length > 0 && { errors: this.errors })
    };
  }
}

/**
 * 400 Bad Request Error
 * @extends AppError
 */
class BadRequestError extends AppError {
  constructor(message = 'Bad Request', errors = []) {
    super(message, 400, errors, 'BAD_REQUEST');
  }
}

/**
 * 401 Unauthorized Error
 * @extends AppError
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', errors = []) {
    super(message, 401, errors, 'UNAUTHORIZED');
  }
}

/**
 * 403 Forbidden Error
 * @extends AppError
 */
class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', errors = []) {
    super(message, 403, errors, 'FORBIDDEN');
  }
}

/**
 * 404 Not Found Error
 * @extends AppError
 */
class NotFoundError extends AppError {
  constructor(message = 'Not Found', errors = []) {
    super(message, 404, errors, 'NOT_FOUND');
  }
}

/**
 * 409 Conflict Error
 * @extends AppError
 */
class ConflictError extends AppError {
  constructor(message = 'Conflict', errors = []) {
    super(message, 409, errors, 'CONFLICT');
  }
}

/**
 * 422 Unprocessable Entity Error
 * @extends AppError
 */
class ValidationError extends AppError {
  constructor(message = 'Validation Error', errors = []) {
    super(message, 422, errors, 'VALIDATION_ERROR');
  }
}

/**
 * 429 Too Many Requests Error
 * @extends AppError
 */
class RateLimitError extends AppError {
  constructor(message = 'Too Many Requests', errors = []) {
    super(message, 429, errors, 'RATE_LIMIT_EXCEEDED');
  }
}

/**
 * 500 Internal Server Error
 * @extends AppError
 */
class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error', errors = []) {
    super(message, 500, errors, 'INTERNAL_SERVER_ERROR');
  }
}

export {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitError,
  InternalServerError
};
