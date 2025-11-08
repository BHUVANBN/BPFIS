import userModel from '../models/User.js'
import Land from '../models/Land.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'

const requireAdmin = (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Admin only' })
    return false
  }
  return true
}

const getOverview = async (req, res) => {
  if (!requireAdmin(req, res)) return
  try {
    const [farmerCount, supplierCount, productCount, landCount, pendingLands] = await Promise.all([
      userModel.Farmer.countDocuments(),
      userModel.Supplier.countDocuments(),
      Product.countDocuments(),
      Land.countDocuments({ isActive: true }),
      Land.countDocuments({ isVerified: false, isActive: true })
    ])
    res.status(200).json({ success: true, data: { farmerCount, supplierCount, productCount, landCount, pendingLands } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const listFarmers = async (req, res) => {
  if (!requireAdmin(req, res)) return
  try {
    const page = parseInt(req.query.page || '1')
    const limit = Math.min(parseInt(req.query.limit || '20'), 100)
    const skip = (page - 1) * limit
    const [rows, total] = await Promise.all([
      userModel.Farmer.find({}).select('-passwordHash -__v').sort({ createdAt: -1 }).skip(skip).limit(limit),
      userModel.Farmer.countDocuments({})
    ])
    res.status(200).json({ success: true, data: rows, page, pages: Math.ceil(total/limit), total })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const listSuppliers = async (req, res) => {
  if (!requireAdmin(req, res)) return
  try {
    const page = parseInt(req.query.page || '1')
    const limit = Math.min(parseInt(req.query.limit || '20'), 100)
    const skip = (page - 1) * limit
    const [rows, total] = await Promise.all([
      userModel.Supplier.find({}).select('-passwordHash -__v').sort({ createdAt: -1 }).skip(skip).limit(limit),
      userModel.Supplier.countDocuments({})
    ])
    res.status(200).json({ success: true, data: rows, page, pages: Math.ceil(total/limit), total })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const listProducts = async (req, res) => {
  if (!requireAdmin(req, res)) return
  try {
    const page = parseInt(req.query.page || '1')
    const limit = Math.min(parseInt(req.query.limit || '20'), 100)
    const skip = (page - 1) * limit
    const filter = {}
    if (req.query.status) filter.status = req.query.status
    const [rows, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter)
    ])
    res.status(200).json({ success: true, data: rows, page, pages: Math.ceil(total/limit), total })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const updateProductStatus = async (req, res) => {
  if (!requireAdmin(req, res)) return
  try {
    const prod = await Product.findById(req.params.productId)
    if (!prod) return res.status(404).json({ success: false, message: 'Product not found' })
    if (req.body.status) prod.status = req.body.status
    await prod.save()
    res.status(200).json({ success: true, data: prod })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const listPendingLands = async (req, res) => {
  if (!requireAdmin(req, res)) return
  try {
    const rows = await Land.find({ isVerified: false, isActive: true }).sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: rows })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const reviewLand = async (req, res) => {
  if (!requireAdmin(req, res)) return
  try {
    const { action, note } = req.body // action: 'APPROVED' | 'REJECTED'
    const land = await Land.findById(req.params.landId)
    if (!land) return res.status(404).json({ success: false, message: 'Land not found' })
    land.verificationNotes.push({ note: note || '', verifiedBy: req.user._id, status: action === 'APPROVED' ? 'APPROVED' : 'REJECTED' })
    await land.save()
    res.status(200).json({ success: true, data: land })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const reports = async (req, res) => {
  if (!requireAdmin(req, res)) return
  try {
    const since = req.query.since ? new Date(req.query.since) : new Date(Date.now() - 30*24*60*60*1000)
    const [salesAgg, topSuppliers] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $unwind: '$items' },
        { $group: { _id: null, revenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } }, orders: { $addToSet: '$_id' }, units: { $sum: '$items.qty' } } },
        { $project: { _id: 0, revenue: 1, orders: { $size: '$orders' }, units: 1 } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$supplierId', orders: { $sum: 1 }, total: { $sum: '$total' } } },
        { $sort: { total: -1 } },
        { $limit: 5 }
      ])
    ])
    res.status(200).json({ success: true, data: { summary: salesAgg[0] || { revenue: 0, orders: 0, units: 0 }, topSuppliers } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export { getOverview, listFarmers, listSuppliers, listProducts, updateProductStatus, listPendingLands, reviewLand, reports }
