const express = require('express');
const { validateRequest } = require('../middleware/validateRequest');
const { body, param, query } = require('express-validator');
const { 
  listAnnouncements, 
  adminCreate, 
  adminUpdate, 
  adminDelete 
} = require('../controllers/announcementController');
const auth = require('../middleware/auth');

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

module.exports = router;
