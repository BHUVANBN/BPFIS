// Import crypto module
const { randomInt } = require('crypto');

// OTP configuration
const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY: 5 * 60 * 1000, // 5 minutes
  MAX_ATTEMPTS: 5,
  RESEND_COOLDOWN: 60 * 1000, // 1 minute
};

// In-memory storage (replace with Redis in production)
const otpStore = new Map();
const rateLimitStore = new Map();

// Generate a cryptographically secure OTP
const generateOTP = () => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < OTP_CONFIG.LENGTH; i++) {
    const randomIndex = randomInt(0, digits.length);
    otp += digits[randomIndex];
  }
  
  return otp;
};

// Check if OTP request is rate limited
const isRateLimited = (phone) => {
  const now = Date.now();
  const record = rateLimitStore.get(phone) || { count: 0, lastAttempt: 0 };
  
  // Reset counter if last attempt was long ago
  if (now - record.lastAttempt > OTP_CONFIG.RESEND_COOLDOWN * 5) {
    record.count = 0;
  }
  
  // Check if rate limited
  if (record.count >= OTP_CONFIG.MAX_ATTEMPTS) {
    const timeLeft = Math.ceil((record.lastAttempt + OTP_CONFIG.RESEND_COOLDOWN - now) / 1000);
    return {
      limited: true,
      message: `Too many attempts. Please try again in ${timeLeft} seconds.`,
      timeLeft
    };
  }
  
  return { limited: false };
};

// Store OTP with expiration and rate limiting
const storeOTP = (phone, otp) => {
  const now = Date.now();
  const rateLimit = rateLimitStore.get(phone) || { count: 0, lastAttempt: 0 };
  
  // Update rate limiting
  rateLimit.count++;
  rateLimit.lastAttempt = now;
  rateLimitStore.set(phone, rateLimit);
  
  // Store OTP
  const expiresAt = now + OTP_CONFIG.EXPIRY;
  otpStore.set(phone, { 
    otp, 
    expiresAt,
    attempts: 0,
    createdAt: now
  });
  
  // Clear old rate limits
  setTimeout(() => {
    rateLimitStore.delete(phone);
  }, OTP_CONFIG.RESEND_COOLDOWN * 6);
  
  return otp;
};

// Verify OTP with rate limiting
const verifyOTP = (phone, otp) => {
  const now = Date.now();
  const stored = otpStore.get(phone);
  
  // Check if OTP exists
  if (!stored) {
    return { 
      valid: false, 
      message: 'OTP not found or expired. Please request a new one.' 
    };
  }
  
  // Check if OTP is expired
  if (now > stored.expiresAt) {
    otpStore.delete(phone);
    return { 
      valid: false, 
      message: 'OTP has expired. Please request a new one.' 
    };
  }
  
  // Increment attempt counter
  stored.attempts++;
  
  // Check max attempts
  if (stored.attempts > OTP_CONFIG.MAX_ATTEMPTS) {
    otpStore.delete(phone);
    return { 
      valid: false, 
      message: 'Maximum attempts reached. Please request a new OTP.' 
    };
  }
  
  // Verify OTP
  const isValid = stored.otp === otp;
  
  if (isValid) {
    // Clear OTP on successful verification
    otpStore.delete(phone);
    return { 
      valid: true, 
      message: 'OTP verified successfully' 
    };
  }
  
  // Update store with new attempt count
  otpStore.set(phone, stored);
  
  return { 
    valid: false, 
    message: `Invalid OTP. ${OTP_CONFIG.MAX_ATTEMPTS - stored.attempts} attempts remaining.`,
    attemptsLeft: OTP_CONFIG.MAX_ATTEMPTS - stored.attempts
  };
};

// Check if phone number is rate limited
const checkRateLimit = (phone) => {
  return isRateLimited(phone);
};

module.exports = { 
  generateOTP, 
  storeOTP, 
  verifyOTP, 
  checkRateLimit,
  OTP_CONFIG 
};
