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

// @route   GET /api/admin/verifications/pending
// @desc    Get pending verifications
router.get('/verifications/pending', [auth, admin], getPendingVerifications);

// @route   GET /api/admin/profiles
// @desc    Get all profiles
router.get('/profiles', [auth, admin], getAllProfiles);

// @route   GET /api/admin/marriages
// @desc    Get all marriages
router.get('/marriages', [auth, admin], getAllMarriages);

// @route   GET /api/admin/stories/pending
// @desc    Get pending success stories
router.get('/stories/pending', [auth, admin], getPendingStories);

// @route   PUT /api/admin/stories/:storyId/approve
// @desc    Approve success story
router.put('/stories/:storyId/approve', [auth, admin], approveStory);

// @route   DELETE /api/admin/stories/:storyId/reject
// @desc    Reject success story
router.delete('/stories/:storyId/reject', [auth, admin], rejectStory);

// @route   GET /api/admin/logs
// @desc    Get admin logs
router.get('/logs', [auth, admin], getAdminLogs);

export default router;