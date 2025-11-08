import mongoose from 'mongoose'

const sponsoredPlacementSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, trim: true },
    imageUrl: String,
    targetUrl: String,
    placement: { type: String, enum: ['homepage','seller_dashboard','category','search'], default: 'homepage', index: true },
    budget: { type: Number, default: 0 },
    cpc: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    startsAt: { type: Date, default: Date.now },
    endsAt: { type: Date },
    status: { type: String, enum: ['draft','active','paused','ended'], default: 'draft', index: true },
    metadata: { type: Map, of: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
)

sponsoredPlacementSchema.index({ placement: 1, status: 1, startsAt: -1 })

export default mongoose.models.SponsoredPlacement || mongoose.model('SponsoredPlacement', sponsoredPlacementSchema)
