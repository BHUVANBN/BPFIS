import Scheme from '../models/Scheme.js'

const listSchemes = async (req, res) => {
  try {
    const filter = { isActive: true }
    if (req.query.state) filter.states = req.query.state
    if (req.query.district) filter.districts = req.query.district
    if (req.query.q) filter.$text = { $search: req.query.q }
    if (req.query.tags) filter.tags = { $in: [].concat(req.query.tags) }
    const rows = await Scheme.find(filter).sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: rows })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const adminCreate = async (req, res) => {
  try {
    const doc = await Scheme.create(req.body)
    res.status(201).json({ success: true, data: doc })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const adminUpdate = async (req, res) => {
  try {
    const doc = await Scheme.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' })
    res.status(200).json({ success: true, data: doc })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const adminDelete = async (req, res) => {
  try {
    const doc = await Scheme.findById(req.params.id)
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' })
    await Scheme.deleteOne({ _id: doc._id })
    res.status(200).json({ success: true, message: 'Deleted' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export { listSchemes, adminCreate, adminUpdate, adminDelete }
