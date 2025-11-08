import mongoose from 'mongoose'

const schemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    department: { type: String, trim: true },
    category: { type: String, trim: true },
    benefits: { type: [String], default: [] },
    eligibility: { type: [String], default: [] },
    documentsRequired: { type: [String], default: [] },
    url: { type: String, trim: true },
    activeFrom: Date,
    activeTo: Date,
    isActive: { type: Boolean, default: true, index: true },
    states: { type: [String], default: [] },
    districts: { type: [String], default: [] },
    tags: { type: [String], default: [], index: true },
    metadata: { type: Map, of: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
)

schemeSchema.index({ title: 'text', description: 'text', tags: 1 })

export default mongoose.models.Scheme || mongoose.model('Scheme', schemeSchema)
