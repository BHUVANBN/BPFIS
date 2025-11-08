import express from 'express'
import auth from '../middleware/auth.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { getCompanyProfile, updateCompanyProfile, dashboardSummary } from '../controllers/supplierController.js'
import { body } from 'express-validator'
import { getMyCompany, upsertMyCompany } from '../controllers/companyController.js'

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

export default router
