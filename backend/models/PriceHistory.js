import mongoose from 'mongoose'

const priceHistorySchema = new mongoose.Schema(
  {
    crop: {
      type: String,
      required: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    source: String,
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
)

priceHistorySchema.index({ crop: 1, location: 1, date: -1 }, { unique: true })

export default mongoose.models.PriceHistory || mongoose.model('PriceHistory', priceHistorySchema)
