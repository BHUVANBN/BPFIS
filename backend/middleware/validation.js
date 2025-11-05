import { body, validationResult } from 'express-validator';

// Validation rules for sending OTP
const validateSendOTP = [
  body('phone')
    .trim()
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Please provide a valid phone number'),
];

// Validation rules for verifying OTP and registering user
const validateVerifyOTP = [
  body('phone')
    .trim()
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('otp')
    .trim()
    .isLength({ min: 4, max: 6 })
    .withMessage('OTP must be 4-6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2-50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['farmer', 'supplier', 'admin'])
    .withMessage('Invalid role')
];

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  return res.status(400).json({
    success: false,
    errors: errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }))
  });
};

export { validateSendOTP, validateVerifyOTP, validate };
