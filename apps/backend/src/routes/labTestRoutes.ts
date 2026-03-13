import express from 'express';
import { getLabTests, seedLabTests, createBooking } from '../controllers/labTestController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', getLabTests);
router.post('/seed', seedLabTests);
router.post('/book', protect, createBooking);

export default router;
