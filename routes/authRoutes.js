import express from 'express';
import {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', login);

// @route   GET /api/auth/verify/:token
// @desc    Verify email address
router.get('/verify/:token', verifyEmail);

// @route   POST /api/auth/resend-verification
// @desc    Resend verification email
router.post('/resend-verification', resendVerification);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
router.post('/forgot-password', forgotPassword);

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password with token
router.post('/reset-password/:token', resetPassword);

export default router;