import express from 'express';
import {auth} from '../middleware/auth.js';
import { sendRequest, respondToRequest } from '../controllers/matchController.js';

const router = express.Router();

// @route   POST /api/match/requests
// @desc    Send private detail request
router.post('/requests', auth, sendRequest);

// @route   PUT /api/match/requests/:requestId
// @desc    Respond to request
router.put('/requests/:requestId', auth, respondToRequest);

export default router;