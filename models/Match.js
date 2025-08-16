import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  profile1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  profile2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  sharedPrivateDetails: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Match', MatchSchema);