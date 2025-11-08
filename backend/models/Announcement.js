const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    audience: { type: String, enum: ['all','farmers','suppliers'], default: 'all', index: true },
    priority: { type: String, enum: ['low','medium','high'], default: 'low' },
    startsAt: { type: Date, default: Date.now },
    endsAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    metadata: { type: Map, of: mongoose.Schema.Types.Mixed },
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
)

announcementSchema.index({ title: 'text', body: 'text' })

module.exports = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
