import express from 'express';
import { getDashboard, getAnalytics, blockUser } from '../controllers/adminController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, admin);

router.get('/dashboard', getDashboard);
router.get('/analytics', getAnalytics);
router.put('/users/:id/block', blockUser);

export default router;
