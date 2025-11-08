import express from 'express'
import auth from '../middleware/auth.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { body, param, query } from 'express-validator'
import { createProduct, updateProduct, deleteProduct, getProductById, listMyProducts, listActiveProducts, supplierAnalytics } from '../controllers/productController.js'

const router = express.Router()

// Public listing for store
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('category').optional().isString().trim(),
    query('q').optional().isString().trim(),
    validateRequest,
  ],
  listActiveProducts
)

// Public get by id (controller restricts hidden products)
router.get(
  '/:id',
  [param('id').isMongoId(), validateRequest],
  getProductById
)

// Supplier-only below
router.use(auth())

router.get(
  '/me',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
    validateRequest,
  ],
  listMyProducts
)

router.get('/analytics/summary', supplierAnalytics)

router.post(
  '/',
  [
    body('title').isString().trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 }),
    body('category').optional().isString().trim(),
    body('images').optional().isArray(),
    body('specs').optional().isObject(),
    body('status').optional().isIn(['draft','active','inactive','out_of_stock']),
    validateRequest,
  ],
  createProduct
)

router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('title').optional().isString().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 }),
    body('category').optional().isString().trim(),
    body('images').optional().isArray(),
    body('specs').optional().isObject(),
    body('status').optional().isIn(['draft','active','inactive','out_of_stock']),
    validateRequest,
  ],
  updateProduct
)

router.delete('/:id', [param('id').isMongoId(), validateRequest], deleteProduct)

export default router
