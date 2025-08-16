import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  profileFor: {
    type: String,
    enum: ['self', 'son', 'daughter', 'sibling', 'relative'],
    required: true
  },
  publicDetails: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    religion: {
      type: String,
      enum: [
        'muslim', 'hindu', 'christian', 'sikh', 'buddhist', 'jain', 'parsi',
        'jewish', 'other'
      ],
      required: true
    },
    caste: { type: String, required: true },
    education: {
      type: String,
      enum: [
        'high school', 'diploma', 'bachelor', 'master', 'phd', 'other'
      ],
      required: true
    },
    profession: {
      type: String,
      enum: [
        'student', 'engineer', 'doctor', 'teacher', 'business', 'government',
        'private job', 'freelancer', 'unemployed', 'other'
      ],
      required: true
    },
    location: { type: String, required: true },
    bio: { type: String, required: true },
    profilePhoto: { type: String, required: true }
  },

  privateDetails: {
    fullName: { type: String, required: true },
    contact: { type: String, required: true },
    income: { type: Number, required: true },
    familyBackground: { type: String, required: true },
    photos: { type: [String], required: true },
    address: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'deactivated', 'married'],
    default: 'pending'
  },
  verification: {
    paid: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    rejectionReason: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Profile', ProfileSchema);