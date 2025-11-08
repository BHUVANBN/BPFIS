const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    threadId: { type: String, index: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    senderRole: { type: String, enum: ['farmer','supplier','admin'], required: true },
    recipientRole: { type: String, enum: ['farmer','supplier','admin'], required: true },
    subject: { type: String, trim: true },
    body: { type: String, required: true, trim: true },
    meta: { type: Map, of: mongoose.Schema.Types.Mixed },
    readAt: Date,
    archived: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
)

messageSchema.index({ senderId: 1, recipientId: 1, createdAt: -1 })
messageSchema.index({ threadId: 1, createdAt: -1 });

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);
