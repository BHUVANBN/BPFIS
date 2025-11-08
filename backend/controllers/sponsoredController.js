import SponsoredPlacement from '../models/SponsoredPlacement.js'

const listPublicPlacements = async (req, res) => {
  try {
    const { placement } = req.query
    const filter = { status: 'active' }
    if (placement) filter.placement = placement
    const rows = await SponsoredPlacement.find(filter).sort({ startsAt: -1 })
    res.status(200).json({ success: true, data: rows })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const listMine = async (req, res) => {
  try {
    const rows = await SponsoredPlacement.find({ supplierId: req.user._id }).sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: rows })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const createPlacement = async (req, res) => {
  try {
    const payload = {
      supplierId: req.user._id,
      productId: req.body.productId,
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      targetUrl: req.body.targetUrl,
      placement: req.body.placement,
      budget: req.body.budget,
      cpc: req.body.cpc,
      startsAt: req.body.startsAt,
      endsAt: req.body.endsAt,
      status: req.body.status || 'draft',
      metadata: req.body.metadata,
    }
    const doc = await SponsoredPlacement.create(payload)
    res.status(201).json({ success: true, data: doc })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const updatePlacement = async (req, res) => {
  try {
    const doc = await SponsoredPlacement.findById(req.params.id)
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' })
    if (doc.supplierId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Forbidden' })
    const allowed = ['title','imageUrl','targetUrl','placement','budget','cpc','startsAt','endsAt','status','metadata']
    allowed.forEach(k => { if (typeof req.body[k] !== 'undefined') doc[k] = req.body[k] })
    await doc.save()
    res.status(200).json({ success: true, data: doc })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const deletePlacement = async (req, res) => {
  try {
    const doc = await SponsoredPlacement.findById(req.params.id)
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' })
    if (doc.supplierId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Forbidden' })
    await SponsoredPlacement.deleteOne({ _id: doc._id })
    res.status(200).json({ success: true, message: 'Deleted' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export { listPublicPlacements, listMine, createPlacement, updatePlacement, deletePlacement }
