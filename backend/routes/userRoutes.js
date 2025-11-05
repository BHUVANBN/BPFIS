import express from 'express';
import auth from '../middleware/auth.js';
import { getCurrentUser, updateProfile } from '../controllers/userController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth());

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', getCurrentUser);

// @route   PUT /api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', updateProfile);

export default router;
