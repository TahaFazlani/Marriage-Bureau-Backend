import Profile from '../models/Profile.js';
import MatchRequest from '../models/MatchRequest.js';
import Marriage from '../models/Marriage.js';

// Send private detail request
export const sendRequest = async (req, res) => {
  const { toProfileId, sharedPrivateDetails } = req.body;
  
  try {
    const fromProfile = await Profile.findById(req.query.profileId);
    const toProfile = await Profile.findById(toProfileId);
    
    if (!fromProfile || !toProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Ensure opposite gender
    if (fromProfile.gender === toProfile.gender) {
      return res.status(400).json({ error: 'Same gender profiles not allowed' });
    }

    const matchRequest = new MatchRequest({
      fromProfile: fromProfile._id,
      toProfile: toProfile._id,
      sharedPrivateDetails
    });

    await matchRequest.save();
    res.json(matchRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Respond to private detail request
export const respondToRequest = async (req, res) => {
  const { status } = req.body;
  
  try {
    const matchRequest = await MatchRequest.findById(req.params.requestId);
    if (!matchRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }

    matchRequest.status = status;
    await matchRequest.save();

    // Create marriage record if accepted
    if (status === 'accepted') {
      const marriage = new Marriage({
        profile1: matchRequest.fromProfile,
        profile2: matchRequest.toProfile
      });
      await marriage.save();
    }

    res.json(matchRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};