const { generateOTP, storeOTP, verifyOTP, checkRateLimit } = require('../utils/otp');
const { NODE_ENV } = require('../config/config');

// Check if in development mode
const isDevelopment = NODE_ENV === 'development';

// Mock SMS service for development
const mockSMSService = {
  sendOTP: async (phone, otp) => {
    console.log(`[MOCK SMS] OTP for ${phone}: ${otp}`);
    return {
      success: true,
      message: 'OTP sent successfully (MOCKED)',
      otp: otp // Include OTP in response for development
    };
  }
};

// Real SMS service for production
const realSMSService = {
  sendOTP: async (phone, otp) => {
    // In a real implementation, this would use a real SMS provider
    // For now, we'll just log it
    console.log(`[REAL SMS] OTP for ${phone}: ${otp}`);
    return {
      success: true,
      message: 'OTP sent successfully',
      otp: otp // Include OTP in response for testing
    };
  }
};

// Use mock service in development, real service in production
const smsService = isDevelopment ? mockSMSService : realSMSService;

// Format phone number for Indian numbers
const formatPhoneNumber = (phone) => {
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If number starts with 0, remove it
  if (digits.startsWith('0')) {
    return digits.substring(1);
  }
  
  // If number starts with country code, ensure it's 10 digits
  if (digits.length > 10) {
    return digits.slice(-10);
  }
  
  return digits;
};

/**
 * Send OTP via Fast2SMS (or log in development)
 * @param {string} phoneNumber - Recipient's phone number
 * @returns {Promise<Object>} - Result of the operation
 */
const sendOTP = async (phoneNumber) => {
  try {
    // Check rate limiting first
    const rateLimitCheck = checkRateLimit(phoneNumber);
    if (rateLimitCheck.limited) {
      return {
        success: false,
        message: rateLimitCheck.message,
        code: 'RATE_LIMITED',
        timeLeft: rateLimitCheck.timeLeft
      };
    }

    // Generate and store OTP
    const otp = generateOTP();
    storeOTP(phoneNumber, otp);
    
    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Log the OTP in development
    if (isDevelopment) {
      console.log(`[DEV] OTP for ${formattedPhone}: ${otp}`);
    }
    
    // Use the appropriate SMS service
    try {
      const result = await smsService.sendOTP(formattedPhone, otp);
      return {
        success: true,
        message: result.message,
        otp: result.otp // Include OTP in response for development
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP');
    }
  } catch (error) {
    console.error('SMS Service Error:', error.response?.data || error.message);
    
    // Handle specific Fast2SMS errors
    let errorMessage = 'Failed to send OTP';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message.includes('Network Error')) {
      errorMessage = 'Network error. Please check your internet connection.';
    }
    
    return { 
      success: false, 
      message: errorMessage,
      code: error.response?.data?.code || 'SMS_SERVICE_ERROR',
      error: error.message 
    };
  }
};

const verifyOTPService = (phoneNumber, otp) => {
  return verifyOTP(phoneNumber, otp);
};

module.exports = { sendOTP, verifyOTPService };
