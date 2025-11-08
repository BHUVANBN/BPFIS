import dotenv from 'dotenv';
import { sendOTP, verifyOTPService } from '../services/twilio.service.js';

// Load environment variables
dotenv.config();

// Test phone number (replace with your test number)
const TEST_PHONE = '+1234567890'; // Replace with a valid test number

async function testOTPFlow() {
  try {
    console.log('=== Testing OTP Flow ===');
    
    // 1. Test sending OTP
    console.log('\n1. Sending OTP...');
    const sendResult = await sendOTP(TEST_PHONE);
    console.log('Send OTP Result:', {
      success: sendResult.success,
      message: sendResult.message,
      sid: sendResult.sid,
      otp: sendResult.otp || 'Not shown in production'
    });

    if (!sendResult.success) {
      console.error('Failed to send OTP:', sendResult.message);
      return;
    }

    // 2. Test verifying OTP (in development, we have the OTP in the response)
    if (process.env.NODE_ENV === 'development' && sendResult.otp) {
      console.log('\n2. Verifying OTP...');
      const verifyResult = verifyOTPService(TEST_PHONE, sendResult.otp);
      console.log('Verify OTP Result:', verifyResult);

      if (verifyResult.valid) {
        console.log('✅ OTP verification successful!');
      } else {
        console.error('❌ OTP verification failed:', verifyResult.message);
      }

      // 3. Test with wrong OTP
      console.log('\n3. Testing with wrong OTP...');
      const wrongOTP = '000000';
      const wrongOTPResult = verifyOTPService(TEST_PHONE, wrongOTP);
      console.log('Wrong OTP Result:', wrongOTPResult);

      // 4. Test rate limiting
      console.log('\n4. Testing rate limiting...');
      console.log('Sending multiple OTPs to test rate limiting...');
      
      for (let i = 1; i <= 6; i++) {
        const result = await sendOTP(TEST_PHONE);
        console.log(`Attempt ${i}:`, {
          success: result.success,
          message: result.message,
          code: result.code || 'N/A',
          timeLeft: result.timeLeft || 'N/A'
        });
        
        if (result.code === 'RATE_LIMITED') {
          console.log('✅ Rate limiting works as expected');
          break;
        }
      }
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testOTPFlow();
