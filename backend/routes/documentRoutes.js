const express = require('express');
const { body, param } = require('express-validator');
const multer = require('multer');
const {
  uploadLandDocument,
  getLandDocuments,
  verifyDocument,
  deleteDocument
} = require('../controllers/documentController');
const auth = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');
const { validateFileType } = require('../services/documentService');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (validateFileType(file)) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .png, and .pdf files are allowed'), false);
    }
  },
});

// Apply auth middleware to all routes
router.use(auth());

// @route   POST /api/lands/:landId/documents
// @desc    Upload a document for a land
// @access  Private (Farmer only)
router.post(
  '/:landId/documents',
  upload.single('document'),
  [
    param('landId').isMongoId().withMessage('Invalid land ID'),
    body('documentType')
      .isIn(['RTC', 'AADHAAR', 'AGREEMENT', 'SURVEY', 'OTHER'])
      .withMessage('Invalid document type'),
  ],
  validateRequest,
  uploadLandDocument
);

// @route   GET /api/lands/:landId/documents
// @desc    Get all documents for a land
// @access  Private (Owner/Admin)
router.get(
  '/:landId/documents',
  [
    param('landId').isMongoId().withMessage('Invalid land ID'),
  ],
  validateRequest,
  getLandDocuments
);

// @route   PUT /api/lands/:landId/documents/:documentId/verify
// @desc    Verify a document (Admin only)
// @access  Private (Admin only)
router.put(
  '/:landId/documents/:documentId/verify',
  [
    param('landId').isMongoId().withMessage('Invalid land ID'),
    param('documentId').isString().notEmpty().withMessage('Invalid document ID'),
    body('isVerified').isBoolean().withMessage('isVerified must be a boolean'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
  ],
  validateRequest,
  verifyDocument
);

// @route   DELETE /api/lands/:landId/documents/:documentId
// @desc    Delete a document
// @access  Private (Owner/Admin)
router.delete(
  '/:landId/documents/:documentId',
  [
    param('landId').isMongoId().withMessage('Invalid land ID'),
    param('documentId').isString().notEmpty().withMessage('Invalid document ID'),
  ],
  validateRequest,
  deleteDocument
);

module.exports = router;
