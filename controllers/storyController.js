import SuccessStory from '../models/SuccessStory.js';
import Marriage from '../models/Marriage.js';
import Profile from '../models/Profile.js';
import User from '../models/User.js';

// Submit success story
export const submitStory = async (req, res) => {
  const { testimonial, photos } = req.body;
  
  try {
    const marriage = await Marriage.findById(req.params.marriageId);
    if (!marriage) {
      return res.status(404).json({ error: 'Marriage not found' });
    }
    
    // Check if marriage is confirmed
    if (marriage.status !== 'married') {
      return res.status(400).json({ error: 'Marriage not confirmed' });
    }
    
    // Get user profiles
    const profile1 = await Profile.findById(marriage.profile1);
    const profile2 = await Profile.findById(marriage.profile2);
    
    // Create success story
    const story = new SuccessStory({
      marriage: marriage._id,
      user1: profile1.user,
      user2: profile2.user,
      testimonial,
      photos
    });
    
    await story.save();
    res.json(story);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all approved success stories
export const getSuccessStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({ approved: true })
      .populate('user1')
      .populate('user2')
      .populate('marriage')
      .sort({ createdAt: -1 });
    
    res.json(stories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get featured success stories
export const getFeaturedStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({ approved: true, featured: true })
      .populate('user1')
      .populate('user2')
      .populate('marriage')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json(stories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};