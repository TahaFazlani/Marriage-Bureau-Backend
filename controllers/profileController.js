import Profile from '../models/Profile.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);
// Create new profile
export const createProfile = async (req, res) => {
  console.log("Creating Profile...");

  const { gender, profileFor, publicDetails, privateDetails } = req.body;

  try {
    let profilePhotoUrl = '';
    const photosUrls = [];

    // ✅ Access files correctly
    const profilePhotoFile = req.files?.profilePhoto?.[0];
    const privatePhotosFiles = req.files?.photos || [];

    // ✅ Upload profile photo if provided
    if (profilePhotoFile) {
      try {
        const result = await cloudinary.uploader.upload(profilePhotoFile.path, {
          folder: 'marriage-bureau/profiles',
          use_filename: true,
          unique_filename: false
        });
        profilePhotoUrl = result.secure_url;
        await unlinkAsync(profilePhotoFile.path); // cleanup
      } catch (uploadErr) {
        console.error('Cloudinary profile photo upload error:', uploadErr);
        await unlinkAsync(profilePhotoFile.path);
        return res.status(500).json({
          success: false,
          error: 'Failed to upload profile photo'
        });
      }
    }

    // ✅ Upload private photos if provided
    for (const file of privatePhotosFiles) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'marriage-bureau/private-photos',
          use_filename: true
        });
        photosUrls.push(result.secure_url);
        await unlinkAsync(file.path);
      } catch (uploadErr) {
        console.error('Cloudinary private photo upload error:', uploadErr);
        // Cleanup all uploaded temp files
        await Promise.all(privatePhotosFiles.map(f => unlinkAsync(f.path)));
        return res.status(500).json({
          success: false,
          error: 'Failed to upload some private photos'
        });
      }
    }

    // ✅ Create profile
    const profile = new Profile({
      user: req.user.id,
      gender,
      profileFor,
      publicDetails: {
        ...publicDetails,
        profilePhoto: profilePhotoUrl
      },
      privateDetails: {
        ...privateDetails,
        photos: photosUrls
      }
    });

    await profile.save();

    res.status(201).json({
      success: true,
      data: profile
    });

  } catch (err) {
    console.error('Profile creation error:', err);

    // Cleanup temp files if needed (precaution)
    if (req.files?.profilePhoto?.[0]) await unlinkAsync(req.files.profilePhoto[0].path);
    if (req.files?.photos) await Promise.all(req.files.photos.map(f => unlinkAsync(f.path)));

    res.status(500).json({
      success: false,
      error: 'Server error during profile creation'
    });
  }
};

// Get all profiles for current user
export const getUserProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ user: req.user.id });
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Browse profiles (opposite gender only)
export const browseProfiles = async (req, res) => {
  try {
    const currentProfile = await Profile.findById(req.query.profileId);
    if (!currentProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const oppositeGender = currentProfile.gender === 'male' ? 'female' : 'male';
    const profiles = await Profile.find({
      gender: oppositeGender,
      status: 'verified'
    }).select('publicDetails');

    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};