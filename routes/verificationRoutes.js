import express from 'express';
import {auth} from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import { 
  submitPayment, 
  verifyProfile, 
  rejectProfile 
} from '../controllers/verificationController.js';

const router = express.Router();

router.post('/:profileId/pay', auth, submitPayment);

router.put('/:profileId/verify', [auth, admin], verifyProfile);

router.put('/:profileId/reject', [auth, admin], rejectProfile);

export default router;