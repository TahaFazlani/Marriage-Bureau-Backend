import express from 'express';
import {auth} from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import { 
  submitPayment, 
  verifyProfile, 
  rejectProfile 
} from '../controllers/verificationController.js';

const router = express.Router();

// @route   POST /api/verification/:profileId/pay
// @desc    Submit payment for verification
router.post('/:profileId/pay', auth, submitPayment);

// @route   PUT /api/verification/:profileId/verify
// @desc    Verify profile (admin)
router.put('/:profileId/verify', [auth, admin], verifyProfile);

// @route   PUT /api/verification/:profileId/reject
// @desc    Reject profile (admin)
router.put('/:profileId/reject', [auth, admin], rejectProfile);

export default router;