import express from 'express';
import {auth} from '../middleware/auth.js';
import { 
  submitStory, 
  getSuccessStories, 
  getFeaturedStories 
} from '../controllers/storyController.js';

const router = express.Router();

router.post('/:marriageId', auth, submitStory);

router.get('/', getSuccessStories);

router.get('/featured', getFeaturedStories);

export default router;