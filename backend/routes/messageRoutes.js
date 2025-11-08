import express from 'express'
import auth from '../middleware/auth.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { body, param, query } from 'express-validator'
import { createMessage, listThreads, getThread, markRead } from '../controllers/messageController.js'

const router = express.Router()

router.use(auth())

router.post(
  '/',
  [
    body('recipientId').isMongoId(),
    body('body').isString().trim().notEmpty(),
    body('subject').optional().isString().trim(),
    body('threadId').optional().isString().trim(),
    body('recipientRole').optional().isIn(['farmer','supplier','admin']),
    validateRequest,
  ],
  createMessage
)

router.get(
  '/threads',
  [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 100 }).toInt(), validateRequest],
  listThreads
)

router.get(
  '/thread/:threadId',
  [param('threadId').isString().notEmpty(), query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 200 }).toInt(), validateRequest],
  getThread
)

router.patch('/:id/read', [param('id').isMongoId(), validateRequest], markRead)

export default router
