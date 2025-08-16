import Verification from '../models/Verification.js';
import Profile from '../models/Profile.js';
import { processPayment } from '../utils/payment.js';
import AdminLog from '../models/AdminLog.js';

// Submit payment for verification
export const submitPayment = async (req, res) => {
  try {
    const profileId = req.params.profileId;
    const profile = await Profile.findById(profileId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Simulate payment processing
    const paymentSuccess = await processPayment();
    
    if (!paymentSuccess) {
      return res.status(400).json({ error: 'Payment failed' });
    }
    
    // Create verification record
    const verification = new Verification({
      profile: profileId,
      paymentStatus: 'completed',
      status: 'pending'
    });
    
    await verification.save();
    
    // Update profile status
    profile.verificationStatus = 'pending';
    await profile.save();
    
    res.json({ 
      message: 'Payment successful. Profile submitted for verification',
      verification
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Admin: Verify profile
export const verifyProfile = async (req, res) => {
  try {
    const profileId = req.params.profileId;
    const profile = await Profile.findById(profileId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const verification = await Verification.findOne({ profile: profileId });
    
    if (!verification) {
      return res.status(400).json({ error: 'No verification record found' });
    }
    
    // Update verification
    verification.status = 'approved';
    verification.adminReviewer = req.user.id;
    verification.updatedAt = new Date();
    await verification.save();
    
    // Update profile
    profile.status = 'verified';
    await profile.save();
    
    // Log admin action
    const adminLog = new AdminLog({
      admin: req.user.id,
      action: 'profile_verified',
      targetType: 'profile',
      targetId: profileId,
      details: { verificationId: verification._id }
    });
    await adminLog.save();
    
    res.json({ message: 'Profile verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Admin: Reject profile
export const rejectProfile = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const profileId = req.params.profileId;
    const profile = await Profile.findById(profileId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const verification = await Verification.findOne({ profile: profileId });
    
    if (!verification) {
      return res.status(400).json({ error: 'No verification record found' });
    }
    
    // Update verification
    verification.status = 'rejected';
    verification.rejectionReason = rejectionReason;
    verification.adminReviewer = req.user.id;
    verification.updatedAt = new Date();
    await verification.save();
    
    // Update profile
    profile.status = 'rejected';
    await profile.save();
    
    // Log admin action
    const adminLog = new AdminLog({
      admin: req.user.id,
      action: 'profile_rejected',
      targetType: 'profile',
      targetId: profileId,
      details: { verificationId: verification._id, rejectionReason }
    });
    await adminLog.save();
    
    res.json({ message: 'Profile rejected', rejectionReason });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};