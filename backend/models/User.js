const mongoose = require('mongoose');
const { farmerDB, supplierDB, adminDB } = require('../config/db');

// Common user schema
const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['farmer', 'supplier', 'admin'],
      required: true,
      default: 'farmer'
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      index: true,
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number']
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    passwordHash: {
      type: String,
      select: false
    },
    profilePic: {
      type: String,
      default: ''
    },
    lastLogin: {
      type: Date,
    },
    // Farmer-specific fields
    landIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Land'
    }],
    // Supplier-specific fields
    company: {
      name: String,
      gstNumber: {
        type: String,
        uppercase: true,
        match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please provide a valid GST number']
      },
      address: {
        street: String,
        city: String,
        state: String,
        pincode: String
      }
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    discriminatorKey: 'role',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Indexes
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ email: 1 }, { sparse: true });

// Middleware
userSchema.pre('save', function(next) {
  if (this.isModified('phone')) {
    this.phone = this.phone.replace(/[^0-9]/g, '');
  }
  next();
});

// Create models for each database
let Farmer, Supplier, Admin;

// Function to initialize models
const initializeModels = async () => {
  try {
    const [farmerConn, supplierConn, adminConn] = await Promise.all([
      farmerDB(),
      supplierDB(),
      adminDB()
    ]);
    
    Farmer = farmerConn.model('User', userSchema);
    Supplier = supplierConn.model('User', userSchema);
    Admin = adminConn.model('User', userSchema);
    
    return { Farmer, Supplier, Admin };
  } catch (error) {
    console.error('Error initializing models:', error);
    throw error;
  }
};

// Static methods
userSchema.statics.findByPhone = async function(phone) {
  return this.findOne({ phone });
};

userSchema.statics.findByEmail = async function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Export models
module.exports = {
  Farmer,
  Supplier,
  Admin,
  initializeModels,
  getUserModel: (role) => {
    switch (role) {
      case 'farmer':
        return Farmer;
      case 'supplier':
        return Supplier;
      case 'admin':
        return Admin;
      default:
        throw new Error(`Invalid role: ${role}`);
    }
  }
};
