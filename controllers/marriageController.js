import Marriage from '../models/Marriage.js';
import Profile from '../models/Profile.js';
import { sendNotification } from '../utils/email.js';

// Confirm marriage status
export const confirmMarriage = async (req, res) => {
  const { response } = req.body;
  
  try {
    const marriage = await Marriage.findById(req.params.marriageId);
    if (!marriage) {
      return res.status(404).json({ error: 'Marriage record not found' });
    }

    const currentProfile = await Profile.findById(req.query.profileId);
    
    // Determine which profile is responding
    if (marriage.profile1.equals(currentProfile._id)) {
      marriage.confirmation.profile1Response = response;
    } else if (marriage.profile2.equals(currentProfile._id)) {
      marriage.confirmation.profile2Response = response;
    } else {
      return res.status(403).json({ error: 'Not authorized for this marriage' });
    }

    // Update status if both respond
    if (marriage.confirmation.profile1Response !== undefined && 
        marriage.confirmation.profile2Response !== undefined) {
      if (marriage.confirmation.profile1Response && marriage.confirmation.profile2Response) {
        marriage.status = 'married';
        marriage.confirmation.confirmedDate = new Date();
        
        // Update profiles to married status
        await Profile.updateMany(
          { _id: { $in: [marriage.profile1, marriage.profile2] } },
          { status: 'married' }
        );
        
        // Notify users
        const profile1 = await Profile.findById(marriage.profile1).populate('user');
        const profile2 = await Profile.findById(marriage.profile2).populate('user');
        
        if (profile1.user.email) {
          sendNotification(profile1.user.email, 'Marriage Confirmed', 'Congratulations! Your marriage has been confirmed.');
        }
        
        if (profile2.user.email) {
          sendNotification(profile2.user.email, 'Marriage Confirmed', 'Congratulations! Your marriage has been confirmed.');
        }
      } else {
        marriage.status = 'unsuccessful';
      }
    }

    await marriage.save();
    res.json(marriage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get marriage details
export const getMarriageDetails = async (req, res) => {
  try {
    const marriage = await Marriage.findById(req.params.marriageId)
      .populate('profile1')
      .populate('profile2');
    
    if (!marriage) {
      return res.status(404).json({ error: 'Marriage not found' });
    }
    
    // Check authorization
    const currentProfile = await Profile.findById(req.query.profileId);
    if (!marriage.profile1.equals(currentProfile._id) && 
        !marriage.profile2.equals(currentProfile._id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    res.json(marriage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};