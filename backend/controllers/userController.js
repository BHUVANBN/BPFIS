const { getUserModel } = require('../models/User');
const auth = require('../middleware/auth');

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    const User = getUserModel(req.user.role);
    const user = await User.findById(req.user._id)
      .select('-passwordHash -__v')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const User = getUserModel(req.user.role);
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'profilePic', 'company'];
    const isValidOperation = updates.every(update => 
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: 'Invalid updates!'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    updates.forEach(update => {
      user[update] = req.body[update];
    });

    await user.save();

    // Remove sensitive data before sending response
    const userObject = user.toObject();
    delete userObject.passwordHash;
    delete userObject.__v;

    res.status(200).json({
      success: true,
      data: userObject
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating profile'
    });
  }
};

module.exports = { getCurrentUser, updateProfile };
