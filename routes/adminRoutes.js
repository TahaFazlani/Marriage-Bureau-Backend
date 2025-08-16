import express from 'express';
import {auth} from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import { 
  getPendingVerifications,
  getAllProfiles,
  getAllMarriages,
  getPendingStories,
  approveStory,
  rejectStory,
  getAdminLogs
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/verifications/pending', [auth, admin], getPendingVerifications);

router.get('/profiles', [auth, admin], getAllProfiles);

router.get('/marriages', [auth, admin], getAllMarriages);

router.get('/stories/pending', [auth, admin], getPendingStories);

router.put('/stories/:storyId/approve', [auth, admin], approveStory);

router.delete('/stories/:storyId/reject', [auth, admin], rejectStory);

router.get('/logs', [auth, admin], getAdminLogs);

export default router;