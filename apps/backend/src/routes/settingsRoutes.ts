import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware';
import { getSettings, updateSettings } from '../controllers/settingsController';

const router = express.Router();

router.get('/', getSettings); // Public route so frontend can fetch global conf like delivery fee
router.put('/', protect, admin, updateSettings);

export default router;
