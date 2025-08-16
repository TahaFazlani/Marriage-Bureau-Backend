import express from 'express';
import {auth} from '../middleware/auth.js';
import { 
  confirmMarriage, 
  getMarriageDetails 
} from '../controllers/marriageController.js';

const router = express.Router();

router.put('/:marriageId/confirm', auth, confirmMarriage);

router.get('/:marriageId', auth, getMarriageDetails);

export default router;