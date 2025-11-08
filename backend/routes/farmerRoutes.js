import express from 'express'
import auth from '../middleware/auth.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { query } from 'express-validator'
import { dashboardSummary, listNearbyFarmers, listStoreProducts, getWeatherForecast, getPricePrediction, getSchemes } from '../controllers/farmerController.js'

const router = express.Router()

router.use(auth(['farmer']))

router.get('/dashboard/summary', dashboardSummary)

router.get(
  '/nearby',
  [
    query('lng').exists().withMessage('lng required').isFloat({ min: -180, max: 180 }).toFloat(),
    query('lat').exists().withMessage('lat required').isFloat({ min: -90, max: 90 }).toFloat(),
    query('distance').optional().isInt({ min: 100, max: 200000 }).toInt(),
    validateRequest,
  ],
  listNearbyFarmers
)

router.get(
  '/store',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('category').optional().isString().trim(),
    query('q').optional().isString().trim(),
    validateRequest,
  ],
  listStoreProducts
)

router.get('/weather', getWeatherForecast)
router.get('/price-prediction', getPricePrediction)
router.get('/schemes', getSchemes)

export default router
