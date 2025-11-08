import twilio from 'twilio';
import { generateOTP, storeOTP, verifyOTP, checkRateLimit } from '../utils/otp.js';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

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
    
    // Format phone number (ensure it's in E.164 format)
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+91${phoneNumber}`; // Default to Indian numbers if no country code
    
    // In development, log the OTP instead of sending SMS
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] OTP for ${formattedPhone}: ${otp}`);
      return { 
        success: true, 
        message: 'OTP generated successfully (development mode)',
        otp, // Only include in development
        sid: 'dev-otp-simulated'
      };
    }
    
    // In production, send actual SMS via Twilio
    const message = await client.messages.create({
      body: `Your FarmChain verification code is: ${otp}. Valid for 5 minutes.`,
      from: twilioPhoneNumber,
      to: formattedPhone
    });
    
    return { 
      success: true, 
      message: 'OTP sent successfully',
      sid: message.sid 
    };
  } catch (error) {
    console.error('Twilio error:', error);
    
    // Handle specific Twilio errors
    let errorMessage = 'Failed to send OTP';
    if (error.code === 21211) {
      errorMessage = 'Invalid phone number format';
    } else if (error.code === 21614) {
      errorMessage = 'Cannot send SMS to this number';
    }
    
    return { 
      success: false, 
      message: errorMessage,
      code: error.code || 'TWILIO_ERROR',
      error: error.message 
    };
  }
};

const verifyOTPService = (phoneNumber, otp) => {
  return verifyOTP(phoneNumber, otp);
};

export { sendOTP, verifyOTPService };
