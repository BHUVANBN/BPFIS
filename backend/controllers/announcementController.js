const Announcement = require('../models/Announcement');

const listAnnouncements = async (req, res) => {
  try {
    const audience = req.query.audience || 'all'
    const now = new Date()
    const filter = {
      isActive: true,
      $and: [
        { $or: [{ startsAt: { $lte: now } }, { startsAt: { $exists: false } }] },
        { $or: [{ endsAt: { $gte: now } }, { endsAt: { $exists: false } }] }
      ]
    }
    if (audience && audience !== 'all') filter.audience = audience
    const rows = await Announcement.find(filter).sort({ priority: -1, createdAt: -1 })
    res.status(200).json({ success: true, data: rows })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const adminCreate = async (req, res) => {
  try {
    const doc = await Announcement.create({ ...req.body, createdBy: req.user._id })
    res.status(201).json({ success: true, data: doc })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const adminUpdate = async (req, res) => {
  try {
    const doc = await Announcement.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' })
    res.status(200).json({ success: true, data: doc })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const adminDelete = async (req, res) => {
  try {
    const doc = await Announcement.findById(req.params.id)
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' })
    await Announcement.deleteOne({ _id: doc._id })
    res.status(200).json({ success: true, message: 'Deleted' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

module.exports = {
  listAnnouncements,
  adminCreate,
  adminUpdate,
  adminDelete
};
