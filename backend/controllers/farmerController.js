const { getLandModel } = require('../models/Land');
const Product = require('../models/Product');

// This will be initialized when the controller is first used
let Land;

const dashboardSummary = async (req, res) => {
  try {
    // Ensure Land model is initialized
    if (!Land) {
      Land = await getLandModel();
    }
    
    const [landCount, verifiedLands] = await Promise.all([
      Land.countDocuments({ farmer: req.user._id, isActive: true }),
      Land.countDocuments({ farmer: req.user._id, isActive: true, isVerified: true })
    ])
    res.status(200).json({ success: true, data: { landCount, verifiedLands } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const listNearbyFarmers = async (req, res) => {
  try {
    // Ensure Land model is initialized
    if (!Land) {
      Land = await getLandModel();
    }
    
    const { lng, lat, distance } = req.query
    if (!lng || !lat) return res.status(400).json({ success: false, message: 'lng and lat are required' })
    const maxDistance = distance ? parseInt(distance) : 10000
    const lands = await Land.findNearby([parseFloat(lng), parseFloat(lat)], maxDistance).select('farmer location area surveyNumber')
    res.status(200).json({ success: true, count: lands.length, data: lands })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const listStoreProducts = async (req, res) => {
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
    res.status(500).json({ success: false, message: err.message })
  }
}

// Placeholders for AI integrations; to be wired with services later
const getWeatherForecast = async (req, res) => {
  try {
    // TODO: integrate real weather service
    res.status(200).json({ success: true, data: { forecast: [], location: req.query } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getPricePrediction = async (req, res) => {
  try {
    // TODO: integrate ML model/service
    res.status(200).json({ success: true, data: { crop: req.query.crop || 'unknown', predictedPrice: null } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getSchemes = async (req, res) => {
  try {
    // TODO: fetch from government APIs or curated list
    res.status(200).json({ success: true, data: [] })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { dashboardSummary, listNearbyFarmers, listStoreProducts, getWeatherForecast, getPricePrediction, getSchemes }
