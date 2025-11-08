const jwt = require('jsonwebtoken');
const { getUserModel } = require('../models/User');

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      // Get token from header
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Get user from appropriate database
      const User = getUserModel(decoded.role);
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Check if user role is authorized
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this resource'
        });
      }

      // Add user and token to request object
      req.user = user;
      req.token = token;
      
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ 
        success: false, 
        message: 'Please authenticate' 
      });
    }
  };
};

module.exports = auth;
