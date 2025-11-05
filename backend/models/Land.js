import mongoose from 'mongoose';
import { farmerDB } from '../config/db.js';

// Sub-schema for land documents
const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['RTC', 'AADHAAR', 'AGREEMENT', 'SURVEY', 'OTHER'],
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['image/jpeg', 'image/png', 'application/pdf'],
    required: true
  },
  fileName: String,
  fileSize: Number,
  ocrData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  verified: {
    type: Boolean,
    default: false
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { _id: false });

// Sub-schema for land location with GeoJSON support
const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
    required: true
  },
  coordinates: {
    type: [Number],  // [longitude, latitude]
    required: true,
    validate: {
      validator: function(v) {
        return v.length === 2 && 
               v[0] >= -180 && v[0] <= 180 && 
               v[1] >= -90 && v[1] <= 90;
      },
      message: props => `${props.value} is not a valid coordinate`
    }
  },
  address: {
    village: String,
    taluk: String,
    district: String,
    state: String,
    pincode: String,
    fullAddress: String
  }
}, { _id: false });

// Main Land schema
const landSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  surveyNumber: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    value: {
      type: Number,
      required: true,
      min: 0.01
    },
    unit: {
      type: String,
      enum: ['ACRE', 'HECTARE', 'SQM', 'CENTS', 'GROUND'],
      default: 'ACRE'
    }
  },
  location: {
    type: locationSchema,
    required: true
  },
  soilType: {
    type: String,
    enum: ['BLACK', 'RED', 'LATERITE', 'MOUNTAIN', 'DESERT', 'PEATY', 'OTHER'],
    required: true
  },
  irrigation: {
    type: String,
    enum: ['IRRIGATED', 'RAIN_FED', 'BOTH', 'NONE'],
    required: true
  },
  ownershipType: {
    type: String,
    enum: ['OWNED', 'LEASED', 'INHERITED', 'GOVT_ALLOTTED'],
    default: 'OWNED'
  },
  documents: [documentSchema],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationNotes: [{
    note: String,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
landSchema.index({ location: '2dsphere' });
landSchema.index({ 'location.address.district': 1 });
landSchema.index({ 'location.address.state': 1 });
landSchema.index({ surveyNumber: 1, 'location.address.district': 1 }, { unique: true });

// Virtual for area in acres (standard unit)
landSchema.virtual('areaInAcres').get(function() {
  const conversionRates = {
    ACRE: 1,
    HECTARE: 2.47105,
    SQM: 0.000247105,
    CENTS: 0.01,
    GROUND: 0.055
  };
  
  return this.area.value * (conversionRates[this.area.unit] || 1);
});

// Pre-save hook to update verification status
landSchema.pre('save', async function(next) {
  if (this.isModified('documents') || this.isModified('verificationNotes')) {
    const hasAllRequiredDocs = this.documents.some(doc => 
      ['RTC', 'AADHAAR'].includes(doc.type) && doc.verified
    );
    
    const allNotesApproved = this.verificationNotes.every(
      note => note.status === 'APPROVED'
    );
    
    this.isVerified = hasAllRequiredDocs && 
                     allNotesApproved && 
                     this.verificationNotes.length > 0;
  }
  next();
});

// Static method to find lands by location
landSchema.statics.findNearby = function(coordinates, maxDistance = 10000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates
        },
        $maxDistance: maxDistance // in meters
      }
    },
    isVerified: true,
    isActive: true
  });
};

// Create and export the model
const Land = farmerDB().model('Land', landSchema);

export default Land;
