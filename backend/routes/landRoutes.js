const express = require('express');
const { body, param } = require('express-validator');
const multer = require('multer');
const { 
  registerLand, 
  getMyLands, 
  getLandById, 
  updateLand, 
  deleteLand, 
  addDocument 
} = require('../controllers/landController.js');
const auth = require('../middleware/auth.js');
const { validateRequest } = require('../middleware/validateRequest.js');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .png, and .pdf files are allowed'), false);
    }
  },
});

// Apply auth middleware to all routes
router.use(auth());

// @route   POST /api/lands
// @desc    Register a new land
// @access  Private (Farmer only)
router.post(
  '/',
  [
    body('surveyNumber', 'Survey number is required').not().isEmpty().trim(),
    body('area.value', 'Area value is required and must be a positive number').isFloat({ min: 0.01 }),
    body('area.unit', 'Valid area unit is required').isIn(['ACRE', 'HECTARE', 'SQM', 'CENTS', 'GROUND']),
    body('location.coordinates', 'Valid coordinates are required').isArray({ min: 2, max: 2 }),
    body('location.address.district', 'District is required').not().isEmpty(),
    body('location.address.state', 'State is required').not().isEmpty(),
    body('soilType', 'Valid soil type is required').isIn([
      'BLACK', 'RED', 'LATERITE', 'MOUNTAIN', 'DESERT', 'PEATY', 'OTHER'
    ]),
    body('irrigation', 'Valid irrigation type is required').isIn([
      'IRRIGATED', 'RAIN_FED', 'BOTH', 'NONE'
    ]),
    body('ownershipType', 'Valid ownership type is required').optional().isIn([
      'OWNED', 'LEASED', 'INHERITED', 'GOVT_ALLOTTED'
    ]),
    validateRequest
  ],
  registerLand
);

// @route   GET /api/lands/my-lands
// @desc    Get all lands for the authenticated farmer
// @access  Private (Farmer only)
router.get('/my-lands', getMyLands);

// @route   GET /api/lands/:id
// @desc    Get land by ID
// @access  Private
router.get(
  '/:id',
  [
    param('id', 'Valid land ID is required').isMongoId(),
    validateRequest
  ],
  getLandById
);

// @route   PUT /api/lands/:id
// @desc    Update land details
// @access  Private (Land owner or admin)
router.put(
  '/:id',
  [
    param('id', 'Valid land ID is required').isMongoId(),
    body('surveyNumber', 'Survey number is required').optional().not().isEmpty().trim(),
    body('area.value', 'Area value must be a positive number').optional().isFloat({ min: 0.01 }),
    body('area.unit', 'Valid area unit is required')
      .optional()
      .isIn(['ACRE', 'HECTARE', 'SQM', 'CENTS', 'GROUND']),
    body('location.coordinates', 'Valid coordinates are required').optional().isArray({ min: 2, max: 2 }),
    body('soilType', 'Valid soil type is required')
      .optional()
      .isIn(['BLACK', 'RED', 'LATERITE', 'MOUNTAIN', 'DESERT', 'PEATY', 'OTHER']),
    body('irrigation', 'Valid irrigation type is required')
      .optional()
      .isIn(['IRRIGATED', 'RAIN_FED', 'BOTH', 'NONE']),
    body('ownershipType', 'Valid ownership type is required')
      .optional()
      .isIn(['OWNED', 'LEASED', 'INHERITED', 'GOVT_ALLOTTED']),
    validateRequest
  ],
  updateLand
);

// @route   DELETE /api/lands/:id
// @desc    Delete a land (soft delete)
// @access  Private (Land owner or admin)
router.delete(
  '/:id',
  [
    param('id', 'Valid land ID is required').isMongoId(),
    validateRequest
  ],
  deleteLand
);

// @route   POST /api/lands/:id/documents
// @desc    Add document to land
// @access  Private (Land owner or admin)
router.post(
  '/:id/documents',
  [
    param('id', 'Valid land ID is required').isMongoId(),
    body('documentType', 'Document type is required').isIn([
      'RTC', 'AADHAAR', 'AGREEMENT', 'SURVEY', 'OTHER'
    ]),
    validateRequest
  ],
  upload.single('document'),
  addDocument
);

module.exports = router;
