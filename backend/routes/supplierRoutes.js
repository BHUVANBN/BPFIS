const express = require('express');
const auth = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');
const { 
  getCompanyProfile, 
  updateCompanyProfile, 
  dashboardSummary 
} = require('../controllers/supplierController');
const { body } = require('express-validator');
const { getMyCompany, upsertMyCompany } = require('../controllers/companyController');

const router = express.Router()

router.use(auth(['supplier']))

router.get('/me', getCompanyProfile)

router.put(
  '/me',
  [
    body('name').optional().isString().trim().isLength({ min: 2, max: 100 }),
    body('email').optional().isEmail(),
    body('profilePic').optional().isString().trim(),
    body('company').optional().isObject(),
    validateRequest,
  ],
  updateCompanyProfile
)

router.get('/dashboard/summary', dashboardSummary)

// Company resource (separate collection)
router.get('/company', getMyCompany)
router.put(
  '/company',
  [
    body('name').optional().isString().trim().isLength({ min: 2, max: 200 }),
    body('email').optional().isEmail(),
    body('description').optional().isString().trim(),
    body('servicesOffered').optional().isArray(),
    body('gstNumber').optional().isString().trim(),
    body('address').optional().isObject(),
    body('logoUrl').optional().isString().trim(),
    validateRequest,
  ],
  upsertMyCompany
)

module.exports = router;
