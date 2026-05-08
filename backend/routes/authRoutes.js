import express from 'express';
import { loginUser, sendOTP, verifyOTP, verifyCredentials, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/verify-credentials', verifyCredentials);
router.get('/me', protect, getMe);

export default router;
