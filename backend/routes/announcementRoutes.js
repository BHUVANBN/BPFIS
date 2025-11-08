import express from 'express'
import { validateRequest } from '../middleware/validateRequest.js'
import { body, param, query } from 'express-validator'
import { listAnnouncements, adminCreate, adminUpdate, adminDelete } from '../controllers/announcementController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Public list by audience
router.get(
  '/',
  [query('audience').optional().isIn(['all','farmers','suppliers']), validateRequest],
  listAnnouncements
)

// Admin CRUD
router.use('/admin', auth(['admin']))

router.post(
  '/admin',
  [
    body('title').isString().trim().notEmpty(),
    body('body').isString().trim().notEmpty(),
    body('audience').optional().isIn(['all','farmers','suppliers']),
    body('priority').optional().isIn(['low','medium','high']),
    body('startsAt').optional().isISO8601(),
    body('endsAt').optional().isISO8601(),
    body('isActive').optional().isBoolean(),
    validateRequest,
  ],
  adminCreate
)

router.put(
  '/admin/:id',
  [param('id').isMongoId(), body('isActive').optional().isBoolean(), validateRequest],
  adminUpdate
)

router.delete('/admin/:id', [param('id').isMongoId(), validateRequest], adminDelete)

export default router
