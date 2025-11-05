import mongoose from 'mongoose'

const signatureSchema = new mongoose.Schema(
  {
    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    signedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'signed', 'declined'],
      default: 'pending',
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  { _id: false }
)

const agreementSchema = new mongoose.Schema(
  {
    landId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Land',
      required: true,
      index: true,
    },
    parties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    terms: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipfsHash: {
      type: String,
      index: true,
    },
    txHash: {
      type: String,
      index: true,
    },
    blockNumber: Number,
    status: {
      type: String,
      enum: ['draft', 'pending', 'recorded', 'disputed', 'resolved', 'cancelled'],
      default: 'draft',
      index: true,
    },
    signatures: [signatureSchema],
    version: {
      type: Number,
      default: 1,
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Agreement || mongoose.model('Agreement', agreementSchema)
