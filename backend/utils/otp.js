import crypto from 'crypto';

// Mock OTP storage (in production, use Redis with TTL)
const otpStore = new Map();

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP with expiration (5 minutes)
const storeOTP = (phone, otp) => {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore.set(phone, { otp, expiresAt });
  return otp;
};

// Verify OTP
const verifyOTP = (phone, otp) => {
  const stored = otpStore.get(phone);
  if (!stored) return { valid: false, message: 'OTP not found or expired' };
  
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phone);
    return { valid: false, message: 'OTP expired' };
  }
  
  const isValid = stored.otp === otp;
  if (isValid) otpStore.delete(phone);
  
  return { 
    valid: isValid, 
    message: isValid ? 'OTP verified' : 'Invalid OTP' 
  };
};

export { generateOTP, storeOTP, verifyOTP };
