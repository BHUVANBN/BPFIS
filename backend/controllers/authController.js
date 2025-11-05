import userModel from '../models/User.js';
import { generateOTP, storeOTP, verifyOTP } from '../utils/otp.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      phone: user.phone
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );
};

// Generate and send OTP
const sendOTP = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phone } = req.body;
  
  try {
    // In production: Integrate with SMS service like Twilio
    const otp = generateOTP();
    storeOTP(phone, otp);
    
    console.log(`OTP for ${phone}: ${otp}`); // Remove in production
    
    res.status(200).json({ 
      success: true, 
      message: 'OTP sent successfully' 
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending OTP' 
    });
  }
};

// Verify OTP and register/login user
const verifyUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phone, otp, name, email, role = 'farmer' } = req.body;
  
  try {
    // Verify OTP
    const { valid, message } = verifyOTP(phone, otp);
    if (!valid) {
      return res.status(400).json({ 
        success: false, 
        message 
      });
    }

    // Get the appropriate model based on role
    const User = userModel.getUserModel(role || 'farmer');
    
    // Find or create user
    let user = await User.findOne({ phone });
    
    if (!user) {
      // New user registration
      user = new User({
        phone,
        phoneVerified: true,
        name,
        role: role || 'farmer',
        ...(email && { email })
      });
      
      // Add supplier-specific fields if applicable
      if (role === 'supplier' && req.body.company) {
        user.company = req.body.company;
      }
      
      await user.save();
    } else if (!user.phoneVerified) {
      // Existing user, verify phone
      user.phoneVerified = true;
      if (name) user.name = name;
      if (email) user.email = email;
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user);
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Prepare user response
    const userResponse = {
      _id: user._id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneVerified: user.phoneVerified,
      emailVerified: user.emailVerified,
      ...(user.role === 'supplier' && {
        company: user.company
      })
    };

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying OTP' 
    });
  }
};

export { sendOTP, verifyUser };
