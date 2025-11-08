import Product from '../models/Product.js'
import Order from '../models/Order.js'

const createProduct = async (req, res) => {
  try {
    if (req.user.role !== 'supplier') {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    const doc = await Product.create({
      supplierId: req.user._id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock ?? 0,
      category: req.body.category,
      images: req.body.images || [],
      specs: req.body.specs || {},
      status: req.body.status || 'draft',
    })
    res.status(201).json({ success: true, data: doc })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id)
    if (!prod) return res.status(404).json({ success: false, message: 'Not found' })
    if (req.user.role !== 'admin' && prod.supplierId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    const updatable = ['title','description','price','stock','category','images','specs','status']
    updatable.forEach(k => {
      if (typeof req.body[k] !== 'undefined') prod[k] = req.body[k]
    })
    await prod.save()
    res.status(200).json({ success: true, data: prod })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id)
    if (!prod) return res.status(404).json({ success: false, message: 'Not found' })
    if (req.user.role !== 'admin' && prod.supplierId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    await Product.deleteOne({ _id: prod._id })
    res.status(200).json({ success: true, message: 'Deleted' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const getProductById = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id)
    if (!prod) return res.status(404).json({ success: false, message: 'Not found' })
    if (prod.status !== 'active' && req.user?.role !== 'admin' && prod.supplierId.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    res.status(200).json({ success: true, data: prod })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const listMyProducts = async (req, res) => {
  try {
    if (req.user.role !== 'supplier') {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    const page = parseInt(req.query.page || '1')
    const limit = Math.min(parseInt(req.query.limit || '10'), 50)
    const skip = (page - 1) * limit
    const [rows, total] = await Promise.all([
      Product.find({ supplierId: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments({ supplierId: req.user._id })
    ])
    res.status(200).json({ success: true, data: rows, page, pages: Math.ceil(total/limit), total })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const listActiveProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1')
    const limit = Math.min(parseInt(req.query.limit || '12'), 100)
    const skip = (page - 1) * limit
    const q = req.query.q?.trim()
    const filter = { status: 'active' }
    if (req.query.category) filter.category = req.query.category
    if (q) filter.$text = { $search: q }
    const [rows, total] = await Promise.all([
      Product.find(filter).sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter)
    ])
    res.status(200).json({ success: true, data: rows, page, pages: Math.ceil(total/limit), total })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const supplierAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'supplier') {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    const since = req.query.since ? new Date(req.query.since) : new Date(Date.now() - 30*24*60*60*1000)
    const pipeline = [
      { $match: { supplierId: req.user._id, createdAt: { $gte: since } } },
      { $unwind: '$items' },
      { $group: {
          _id: null,
          revenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } },
          orders: { $addToSet: '$_id' },
          units: { $sum: '$items.qty' }
      } },
      { $project: { _id: 0, revenue: 1, orders: { $size: '$orders' }, units: 1 } }
    ]
    const [agg, topProducts] = await Promise.all([
      Order.aggregate(pipeline),
      Order.aggregate([
        { $match: { supplierId: req.user._id, createdAt: { $gte: since } } },
        { $unwind: '$items' },
        { $group: { _id: '$items.productId', title: { $last: '$items.title' }, units: { $sum: '$items.qty' }, sales: { $sum: { $multiply: ['$items.qty', '$items.price'] } } } },
        { $sort: { sales: -1 } },
        { $limit: 5 }
      ])
    ])
    res.status(200).json({ success: true, data: { summary: agg[0] || { revenue: 0, orders: 0, units: 0 }, topProducts } })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export { createProduct, updateProduct, deleteProduct, getProductById, listMyProducts, listActiveProducts, supplierAnalytics }
