import dotenv from 'dotenv';
import { sendOTP, verifyOTPService } from '../services/sms.service.js';

// Load environment variables
dotenv.config();

// Test phone number (replace with a valid Indian mobile number)
const TEST_PHONE = '9876543210'; // Replace with a valid Indian mobile number

async function testSMSFlow() {
  try {
    console.log('=== Testing SMS OTP Flow with Fast2SMS ===');
    console.log('Using API Key:', process.env.FAST2SMS_API_KEY ? '✅ Set' : '❌ Not set');
    
    // 1. Test sending OTP
    console.log('\n1. Sending OTP...');
    const sendResult = await sendOTP(TEST_PHONE);
    
    console.log('Send OTP Result:', {
      success: sendResult.success,
      message: sendResult.message,
      requestId: sendResult.requestId || 'N/A',
      otp: sendResult.otp || 'Not shown in production'
    });

    if (!sendResult.success) {
      console.error('Failed to send OTP:', sendResult.message);
      if (sendResult.code === 'RATE_LIMITED') {
        console.log(`Please wait ${sendResult.timeLeft} seconds before trying again.`);
      }
      return;
    }

    // 2. In development, we can test verification since we have the OTP
    if (process.env.NODE_ENV === 'development' && sendResult.otp) {
      console.log('\n2. Verifying OTP...');
      console.log('Using OTP:', sendResult.otp);
      
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
testSMSFlow();
