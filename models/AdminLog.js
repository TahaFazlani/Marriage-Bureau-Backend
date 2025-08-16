import mongoose from 'mongoose';

const AdminLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  targetType: {
    type: String,
    enum: ['profile', 'user', 'verification', 'match', 'marriage', 'story'],
    required: true
  },
  targetId: mongoose.Schema.Types.ObjectId,
  details: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('AdminLog', AdminLogSchema);