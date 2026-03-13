import express from 'express';
import { syncCart } from '../controllers/cartController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/sync', protect, syncCart);

export default router;
