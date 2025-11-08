const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    title: String,
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  { _id: false }
)

const eventSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['created', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    meta: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  { _id: false }
)

const addressSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    district: String,
    state: String,
    postalCode: String,
    country: {
      type: String,
      default: 'IN',
    },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      validate: [(val) => val.length > 0, 'Order must contain at least one item'],
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['created', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'created',
      index: true,
    },
    payment: {
      method: String,
      status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed', 'refunded'],
        default: 'pending',
      },
      transactionId: String,
      meta: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
      },
    },
    shippingAddress: addressSchema,
    billingAddress: addressSchema,
    events: [eventSchema],
    notes: String,
  },
  {
    timestamps: true,
  }
)

orderSchema.index({ buyerId: 1, createdAt: -1 })
orderSchema.index({ supplierId: 1, createdAt: -1 })

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema)
