import express from 'express';
import {auth} from '../middleware/auth.js';
import { 
  submitStory, 
  getSuccessStories, 
  getFeaturedStories 
} from '../controllers/storyController.js';

const router = express.Router();

// @route   POST /api/stories/:marriageId
// @desc    Submit success story
router.post('/:marriageId', auth, submitStory);

// @route   GET /api/stories
// @desc    Get all approved success stories
router.get('/', getSuccessStories);

// @route   GET /api/stories/featured
// @desc    Get featured success stories
router.get('/featured', getFeaturedStories);

export default router;