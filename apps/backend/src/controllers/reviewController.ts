import { Request, Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';

export const createReview = async (req: Request, res: Response) => {
  try {
    const { productId, rating, comment, title } = req.body;
    if (!req.user) return res.status(401).json({ success: false, error: 'Must be logged in' });

    // Check if already reviewed
    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) {
      return res.status(400).json({ success: false, error: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
      title,
    });

    // Update product rating
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews, count: reviews.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllReviewsAdmin = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({})
      .populate('user', 'name')
      .populate('product', 'name slug')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
