import userModel from '../models/User.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'

const getCompanyProfile = async (req, res) => {
  try {
    if (req.user.role !== 'supplier') return res.status(403).json({ success: false, message: 'Forbidden' })
    const User = userModel.getUserModel('supplier')
    const user = await User.findById(req.user._id).select('-passwordHash -__v')
    if (!user) return res.status(404).json({ success: false, message: 'Not found' })
    res.status(200).json({ success: true, data: user })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const updateCompanyProfile = async (req, res) => {
  try {
    if (req.user.role !== 'supplier') return res.status(403).json({ success: false, message: 'Forbidden' })
    const User = userModel.getUserModel('supplier')
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ success: false, message: 'Not found' })
    const allowed = ['name','email','profilePic','company']
    Object.keys(req.body).forEach(k => { if (allowed.includes(k)) user[k] = req.body[k] })
    await user.save()
    const obj = user.toObject(); delete obj.passwordHash; delete obj.__v
    res.status(200).json({ success: true, data: obj })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const dashboardSummary = async (req, res) => {
  try {
    if (req.user.role !== 'supplier') return res.status(403).json({ success: false, message: 'Forbidden' })
    const since = req.query.since ? new Date(req.query.since) : new Date(Date.now() - 30*24*60*60*1000)
    const [stats, productCounts] = await Promise.all([
      Order.aggregate([
        { $match: { supplierId: req.user._id, createdAt: { $gte: since } } },
        { $unwind: '$items' },
        { $group: { _id: null, revenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } }, orders: { $addToSet: '$_id' }, units: { $sum: '$items.qty' } } },
        { $project: { _id: 0, revenue: 1, orders: { $size: '$orders' }, units: 1 } }
      ]),
      Product.aggregate([
        { $match: { supplierId: req.user._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ])
    const productStatus = productCounts.reduce((acc, cur) => { acc[cur._id] = cur.count; return acc }, {})
    res.status(200).json({ success: true, data: { summary: stats[0] || { revenue: 0, orders: 0, units: 0 }, productStatus } })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export { getCompanyProfile, updateCompanyProfile, dashboardSummary }
