const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    district: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'IN' }
  },
  { _id: false }
)

const companySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    description: { type: String, trim: true },
    servicesOffered: { type: [String], default: [] },
    gstNumber: { type: String, uppercase: true },
    address: addressSchema,
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending', index: true },
    logoUrl: String,
    metadata: { type: Map, of: mongoose.Schema.Types.Mixed },
    metrics: {
      totalRevenue: { type: Number, default: 0 },
      totalOrders: { type: Number, default: 0 },
      totalProducts: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
)

companySchema.index({ name: 'text', description: 'text', servicesOffered: 1 })

module.exports = mongoose.models.Company || mongoose.model('Company', companySchema)
