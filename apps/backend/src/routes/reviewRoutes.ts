import express from 'express';
import { createReview, getProductReviews, getAllReviewsAdmin } from '../controllers/reviewController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);
router.get('/admin/all', protect, admin, getAllReviewsAdmin);

export default router;
