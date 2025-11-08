const Company = require('../models/Company')

const getMyCompany = async (req, res) => {
  try {
    const doc = await Company.findOne({ userId: req.user._id })
    if (!doc) return res.status(200).json({ success: true, data: null })
    res.status(200).json({ success: true, data: doc })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const upsertMyCompany = async (req, res) => {
  try {
    const payload = {
      userId: req.user._id,
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      servicesOffered: req.body.servicesOffered,
      gstNumber: req.body.gstNumber,
      address: req.body.address,
      logoUrl: req.body.logoUrl,
      metadata: req.body.metadata,
    }
    const doc = await Company.findOneAndUpdate(
      { userId: req.user._id },
      { $set: payload },
      { upsert: true, new: true }
    )
    res.status(200).json({ success: true, data: doc })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const adminListCompanies = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1')
    const limit = Math.min(parseInt(req.query.limit || '20'), 100)
    const skip = (page - 1) * limit
    const filter = {}
    if (req.query.status) filter.status = req.query.status
    const [rows, total] = await Promise.all([
      Company.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Company.countDocuments(filter)
    ])
    res.status(200).json({ success: true, data: rows, page, pages: Math.ceil(total/limit), total })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const adminUpdateCompanyStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body // pending|verified|rejected
    const doc = await Company.findById(id)
    if (!doc) return res.status(404).json({ success: false, message: 'Company not found' })
    doc.status = status
    await doc.save()
    res.status(200).json({ success: true, data: doc })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

module.exports = { getMyCompany, upsertMyCompany, adminListCompanies, adminUpdateCompanyStatus }
