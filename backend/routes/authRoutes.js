const express = require('express');
const { sendOTP, verifyUser } = require('../controllers/authController');
const { validateSendOTP, validateVerifyOTP, validate } = require('../middleware/validation');

const router = express.Router();

// Auth routes are public and don't require authentication

// @route   POST /api/auth/send-otp
// @desc    Send OTP to user's phone
// @access  Public
router.post('/send-otp', validateSendOTP, validate, sendOTP);

// @route   POST /api/auth/verify
// @desc    Verify OTP and register/login user
// @access  Public
router.post('/verify', validateVerifyOTP, validate, verifyUser);

module.exports = router;
