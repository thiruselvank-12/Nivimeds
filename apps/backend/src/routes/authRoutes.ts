import express from 'express';
import { sendOTP, verifyOTP, getMe, addAddress, addMember, getAllUsers } from '../controllers/authController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/me', protect, getMe);
router.post('/address', protect, addAddress);
router.post('/member', protect, addMember);
router.get('/users', protect, admin, getAllUsers);

export default router;
