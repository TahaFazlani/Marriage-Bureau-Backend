import mongoose from 'mongoose';

const MatchRequestSchema = new mongoose.Schema({
  fromProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  toProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  sharedPrivateDetails: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('MatchRequest', MatchRequestSchema);