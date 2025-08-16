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

router.post('/register', register);

router.post('/login', login);

router.get('/verify/:token', verifyEmail);

router.post('/resend-verification', resendVerification);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

export default router;