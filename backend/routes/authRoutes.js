import express from 'express';
import { sendOTP, verifyUser } from '../controllers/authController.js';
import { validateSendOTP, validateVerifyOTP, validate } from '../middleware/validation.js';

const router = express.Router();

// @route   POST /api/auth/send-otp
// @desc    Send OTP to user's phone
// @access  Public
router.post('/send-otp', validateSendOTP, validate, sendOTP);

// @route   POST /api/auth/verify
// @desc    Verify OTP and register/login user
// @access  Public
router.post('/verify', validateVerifyOTP, validate, verifyUser);

export default router;
