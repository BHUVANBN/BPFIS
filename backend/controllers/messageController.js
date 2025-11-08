const Message = require('../models/Message');
const mongoose = require('mongoose');

const makeThreadId = (a, b) => {
  const [x, y] = [a.toString(), b.toString()].sort()
  return `${x}_${y}`
}

const createMessage = async (req, res) => {
  try {
    const { recipientId, subject, body } = req.body
    if (!recipientId || !body) return res.status(400).json({ success: false, message: 'recipientId and body are required' })
    const threadId = req.body.threadId || makeThreadId(req.user._id, recipientId)
    const msg = await Message.create({
      threadId,
      senderId: req.user._id,
      recipientId: new mongoose.Types.ObjectId(recipientId),
      senderRole: req.user.role,
      recipientRole: req.body.recipientRole || 'supplier',
      subject: subject || '',
      body,
      meta: req.body.meta || {}
    })
    res.status(201).json({ success: true, data: msg })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const listThreads = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1')
    const limit = Math.min(parseInt(req.query.limit || '20'), 100)
    const skip = (page - 1) * limit
    const pipeline = [
      { $match: { $or: [{ senderId: req.user._id }, { recipientId: req.user._id }] } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$threadId', lastMessage: { $first: '$$ROOT' }, count: { $sum: 1 } } },
      { $sort: { 'lastMessage.createdAt': -1 } },
      { $skip: skip },
      { $limit: limit }
    ]
    const threads = await Message.aggregate(pipeline)
    res.status(200).json({ success: true, data: threads, page, limit })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getThread = async (req, res) => {
  try {
    const { threadId } = req.params
    const page = parseInt(req.query.page || '1')
    const limit = Math.min(parseInt(req.query.limit || '50'), 200)
    const skip = (page - 1) * limit
    const rows = await Message.find({ threadId, $or: [{ senderId: req.user._id }, { recipientId: req.user._id }] })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    res.status(200).json({ success: true, data: rows, page, limit })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const markRead = async (req, res) => {
  try {
    const { id } = req.params
    const msg = await Message.findOne({ _id: id, recipientId: req.user._id })
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' })
    msg.readAt = new Date()
    await msg.save()
    res.status(200).json({ success: true, data: msg })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

module.exports = { 
  createMessage, 
  listThreads, 
  getThread, 
  markRead 
};
