import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import authConfig from '../config/auth.js';
import { sendVerificationEmail } from '../utils/email.js';

// Register new user
export const register = async (req, res) => {
  const { username, email, password, contact } = req.body;
  
  try {
    // Validate input
    if (!username || !email || !password || !contact) {
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required',
        fields: {
          username: !username ? 'Username is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          contact: !contact ? 'Contact is required' : null
        }
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Case 1: User is already verified
      if (existingUser.isVerified) {
        return res.status(409).json({ 
          success: false,
          error: 'Email already registered and verified',
          field: 'email'
        });
      }
      
      // Case 2: Verification token expired
      if (existingUser.verificationExpires < Date.now()) {
        // Allow re-registration by deleting the old unverified record
        await User.deleteOne({ _id: existingUser._id });
      } 
      // Case 3: Verification still pending and not expired
      else {
        return res.status(409).json({ 
          success: false,
          error: 'Verification email already sent. Please check your email or wait for expiration.',
          field: 'email',
          code: 'VERIFICATION_PENDING'
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create verification token
    const verificationToken = jwt.sign({ email }, authConfig.jwtSecret, {
      expiresIn: '1h'
    });

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      contact,
      verificationToken,
      verificationExpires: Date.now() + 3600000 // 1 hour
    });

    await user.save();

    // Send verification email (in background, don't wait for response)
    sendVerificationEmail(email, verificationToken)
      .catch(err => console.error('Email sending error:', err));

    // Create auth token
    const payload = { 
      user: { 
        id: user.id, 
        role: user.role,
        isVerified: user.isVerified
      } 
    };
    
    const token = jwt.sign(payload, authConfig.jwtSecret, {
      expiresIn: authConfig.jwtExpiration
    });

    // Return response without sensitive data
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      contact: user.contact,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    };
    
    res.status(201).json({ 
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      token,
      user: userResponse
    });
  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle specific MongoDB errors
    if (err.name === 'ValidationError') {
      const errors = {};
      Object.keys(err.errors).forEach(key => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        fields: errors
      });
    }
    
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists',
        field: 'email'
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Registration failed. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Authenticate user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        error: 'Account not verified. Please check your email.',
        requiresVerification: true
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        _id: user._id,
        email: user.email,
        isVerified: user.isVerified,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Set secure HTTP-only cookie
    res.cookie('verificationToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
      domain: process.env.COOKIE_DOMAIN || undefined
    });

    // Return response without sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.verificationToken;
    
    res.json({ 
      token, 
      user: userResponse
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  
  try {
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    // Verify token
    const decoded = jwt.verify(token, authConfig.jwtSecret);
    const user = await User.findOne({ 
      email: decoded.email,
      verificationToken: token
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    // Check if token expired
    if (user.verificationExpires < Date.now()) {
      return res.status(400).json({ error: 'Verification token has expired' });
    }

    // Update user
    user.isVerified = true;
    user.verificationToken = undefined;
    // user.verificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Verification token has expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: 'Invalid verification token' });
    }
    console.error('Verification error:', err.message);
    res.status(500).json({ error: 'Server error during verification' });
  }
};

// Resend verification email
export const resendVerification = async (req, res) => {
  const { email } = req.body;
  
  try {
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Create new verification token
    const verificationToken = jwt.sign({ email }, authConfig.jwtSecret, {
      expiresIn: '1h'
    });

    // Update user
    user.verificationToken = verificationToken;
    user.verificationExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.json({ message: 'Verification email sent successfully' });
  } catch (err) {
    console.error('Resend verification error:', err.message);
    res.status(500).json({ error: 'Server error during resend verification' });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user doesn't exist
      return res.json({ message: 'If your email is registered, you will receive a password reset link' });
    }

    // Create password reset token
    const resetToken = jwt.sign({ id: user.id }, authConfig.jwtSecret, {
      expiresIn: '15m'
    });

    // Update user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 900000; // 15 minutes
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'Password reset email sent successfully' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ error: 'Server error during password reset' });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  
  try {
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    // Verify token
    const decoded = jwt.verify(token, authConfig.jwtSecret);
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Password reset token has expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: 'Invalid password reset token' });
    }
    console.error('Reset password error:', err.message);
    res.status(500).json({ error: 'Server error during password reset' });
  }
};