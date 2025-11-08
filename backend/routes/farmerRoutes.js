const express = require('express');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { query } = require('express-validator');

const { 
  dashboardSummary, 
  listNearbyFarmers, 
  listStoreProducts, 
  getWeatherForecast, 
  getPricePrediction, 
  getSchemes 
} = require('../controllers/farmerController');

const router = express.Router()

// Async handler to wrap route handlers for better error handling
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Apply auth middleware for all routes in this router
router.use((req, res, next) => {
  return auth(['farmer'])(req, res, next);
});

// Dashboard routes
router.get('/dashboard/summary', asyncHandler(dashboardSummary));

// Nearby farmers route
router.get(
  '/nearby',
  [
    query('lng')
      .exists().withMessage('Longitude is required')
      .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180')
      .toFloat(),
    query('lat')
      .exists().withMessage('Latitude is required')
      .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90')
      .toFloat(),
    query('distance')
      .optional()
      .isInt({ min: 100, max: 200000 }).withMessage('Distance must be between 100 and 200,000 meters')
      .toInt(),
    (req, res, next) => validateRequest(req, res, next)
  ],
  asyncHandler(listNearbyFarmers)
)

// Store products route
router.get(
  '/store',
  [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
      .toInt(),
    query('category')
      .optional()
      .isString().withMessage('Category must be a string')
      .trim(),
    query('q')
      .optional()
      .isString().withMessage('Search query must be a string')
      .trim(),
    (req, res, next) => validateRequest(req, res, next)
  ],
  asyncHandler(listStoreProducts)
)

// Weather and prediction routes
router.get('/weather-forecast', asyncHandler(getWeatherForecast));
router.get('/prices/predict', asyncHandler(getPricePrediction));
router.get('/schemes', asyncHandler(getSchemes));

module.exports = router;
