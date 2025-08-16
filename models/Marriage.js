import mongoose from 'mongoose';

const MarriageSchema = new mongoose.Schema({
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
    enum: ['matched', 'progress', 'married', 'unsuccessful'],
    default: 'matched'
  },
  confirmation: {
    profile1Response: Boolean,
    profile2Response: Boolean,
    confirmedDate: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Marriage', MarriageSchema);