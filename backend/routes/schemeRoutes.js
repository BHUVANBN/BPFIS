import express from 'express'
import { validateRequest } from '../middleware/validateRequest.js'
import { body, param, query } from 'express-validator'
import { listSchemes, adminCreate, adminUpdate, adminDelete } from '../controllers/schemeController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Public list
router.get(
  '/',
  [
    query('state').optional().isString().trim(),
    query('district').optional().isString().trim(),
    query('q').optional().isString().trim(),
    query('tags').optional().isString().trim(),
    validateRequest,
  ],
  listSchemes
)

// Admin section
router.use('/admin', auth(['admin']))

router.post(
  '/admin',
  [
    body('title').isString().trim().notEmpty(),
    body('description').optional().isString().trim(),
    body('department').optional().isString().trim(),
    body('category').optional().isString().trim(),
    body('benefits').optional().isArray(),
    body('eligibility').optional().isArray(),
    body('documentsRequired').optional().isArray(),
    body('url').optional().isString().trim(),
    body('activeFrom').optional().isISO8601(),
    body('activeTo').optional().isISO8601(),
    body('isActive').optional().isBoolean(),
    body('states').optional().isArray(),
    body('districts').optional().isArray(),
    body('tags').optional().isArray(),
    validateRequest,
  ],
  adminCreate
)

router.put(
  '/admin/:id',
  [param('id').isMongoId(), validateRequest],
  adminUpdate
)

router.delete('/admin/:id', [param('id').isMongoId(), validateRequest], adminDelete)

export default router
