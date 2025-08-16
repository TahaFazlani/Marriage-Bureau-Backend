import express from 'express';
import {auth} from '../middleware/auth.js';
import { sendRequest, respondToRequest } from '../controllers/matchController.js';

const router = express.Router();

router.post('/requests', auth, sendRequest);

router.put('/requests/:requestId', auth, respondToRequest);

export default router;