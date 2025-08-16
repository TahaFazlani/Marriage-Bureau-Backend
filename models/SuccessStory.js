import mongoose from 'mongoose';

const SuccessStorySchema = new mongoose.Schema({
  marriage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marriage',
    required: true
  },
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  testimonial: {
    type: String,
    required: true
  },
  photos: [String],
  approved: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('SuccessStory', SuccessStorySchema);