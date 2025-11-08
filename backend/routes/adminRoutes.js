import express from 'express'
import auth from '../middleware/auth.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { body, param, query } from 'express-validator'
import { getOverview, listFarmers, listSuppliers, listProducts, updateProductStatus, listPendingLands, reviewLand, reports } from '../controllers/adminController.js'
import { adminListCompanies, adminUpdateCompanyStatus } from '../controllers/companyController.js'

const router = express.Router()

router.use(auth(['admin']))

router.get('/overview', getOverview)

router.get(
  '/farmers',
  [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 100 }).toInt(), validateRequest],
  listFarmers
)

router.get(
  '/suppliers',
  [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 100 }).toInt(), validateRequest],
  listSuppliers
)

router.get(
  '/products',
  [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 100 }).toInt(), query('status').optional().isIn(['draft','active','inactive','out_of_stock']), validateRequest],
  listProducts
)

router.patch(
  '/products/:productId/status',
  [param('productId').isMongoId(), body('status').isIn(['draft','active','inactive','out_of_stock']), validateRequest],
  updateProductStatus
)

router.get('/lands/pending', listPendingLands)

router.post(
  '/lands/:landId/review',
  [param('landId').isMongoId(), body('action').isIn(['APPROVED','REJECTED']), body('note').optional().isString().trim().isLength({ max: 500 }), validateRequest],
  reviewLand
)

router.get('/reports', reports)

// Companies (Company collection)
router.get(
  '/companies',
  [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 100 }).toInt(), query('status').optional().isIn(['pending','verified','rejected']), validateRequest],
  adminListCompanies
)

router.patch(
  '/companies/:id/status',
  [param('id').isMongoId(), body('status').isIn(['pending','verified','rejected']), validateRequest],
  adminUpdateCompanyStatus
)

export default router
