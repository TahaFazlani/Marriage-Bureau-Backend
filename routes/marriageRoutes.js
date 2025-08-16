import express from 'express';
import {auth} from '../middleware/auth.js';
import { 
  confirmMarriage, 
  getMarriageDetails 
} from '../controllers/marriageController.js';

const router = express.Router();

// @route   PUT /api/marriage/:marriageId/confirm
// @desc    Confirm marriage status
router.put('/:marriageId/confirm', auth, confirmMarriage);

// @route   GET /api/marriage/:marriageId
// @desc    Get marriage details
router.get('/:marriageId', auth, getMarriageDetails);

export default router;