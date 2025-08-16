import express from 'express';
import { auth } from '../middleware/auth.js';
import { 
  createProfile, 
  getUserProfiles, 
  browseProfiles 
} from '../controllers/profileController.js';
import { uploadProfileMediaMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', auth, uploadProfileMediaMiddleware,  createProfile);

router.get('/me', auth, getUserProfiles);

router.get('/browse', auth, browseProfiles);

export default router;