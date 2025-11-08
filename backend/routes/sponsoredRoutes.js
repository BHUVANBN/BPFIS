const express = require('express');
const { validateRequest } = require('../middleware/validateRequest');
const { body, param, query } = require('express-validator');
const auth = require('../middleware/auth');
const { 
  listPublicPlacements, 
  listMine, 
  createPlacement, 
  updatePlacement, 
  deletePlacement 
} = require('../controllers/sponsoredController');

const router = express.Router()

// Public: list active placements by placement type
router.get('/', [query('placement').optional().isIn(['homepage','seller_dashboard','category','search']), validateRequest], listPublicPlacements)

// Supplier-only
router.use(auth(['supplier']))

router.get('/me', listMine)

router.post(
  '/',
  [
    body('productId').isMongoId(),
    body('title').optional().isString().trim(),
    body('imageUrl').optional().isString().trim(),
    body('targetUrl').optional().isString().trim(),
    body('placement').isIn(['homepage','seller_dashboard','category','search']),
    body('budget').optional().isFloat({ min: 0 }),
    body('cpc').optional().isFloat({ min: 0 }),
    body('startsAt').optional().isISO8601(),
    body('endsAt').optional().isISO8601(),
    body('status').optional().isIn(['draft','active','paused','ended']),
    validateRequest,
  ],
  createPlacement
)

router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('placement').optional().isIn(['homepage','seller_dashboard','category','search']),
    body('status').optional().isIn(['draft','active','paused','ended']),
    validateRequest,
  ],
  updatePlacement
)

router.delete('/:id', [param('id').isMongoId(), validateRequest], deletePlacement)

module.exports = router;
