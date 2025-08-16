import Profile from '../models/Profile.js';
import User from '../models/User.js';
import Verification from '../models/Verification.js';
import Marriage from '../models/Marriage.js';
import SuccessStory from '../models/SuccessStory.js';
import AdminLog from '../models/AdminLog.js';

// Get all pending verifications
export const getPendingVerifications = async (req, res) => {
  try {
    const verifications = await Verification.find({ status: 'pending' })
      .populate('profile')
      .populate('adminReviewer');
    
    res.json(verifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all profiles
export const getAllProfiles = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    const profiles = await Profile.find(filter)
      .populate('user');
    
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all marriages
export const getAllMarriages = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    const marriages = await Marriage.find(filter)
      .populate('profile1')
      .populate('profile2');
    
    res.json(marriages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get pending success stories
export const getPendingStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({ approved: false })
      .populate('marriage')
      .populate('user1')
      .populate('user2');
    
    res.json(stories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Approve success story
export const approveStory = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.storyId);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    story.approved = true;
    await story.save();
    
    // Log admin action
    const adminLog = new AdminLog({
      admin: req.user.id,
      action: 'story_approved',
      targetType: 'story',
      targetId: story._id
    });
    await adminLog.save();
    
    res.json(story);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Reject success story
export const rejectStory = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndDelete(req.params.storyId);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    // Log admin action
    const adminLog = new AdminLog({
      admin: req.user.id,
      action: 'story_rejected',
      targetType: 'story',
      targetId: story._id
    });
    await adminLog.save();
    
    res.json({ message: 'Story rejected and deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get admin logs
export const getAdminLogs = async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .populate('admin')
      .sort({ createdAt: -1 });
    
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};