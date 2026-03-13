import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware';
import {
  getPublishedArticles,
  getArticleBySlug,
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle
} from '../controllers/articleController';

const router = express.Router();

// Public routes
router.get('/', getPublishedArticles);
router.get('/slug/:slug', getArticleBySlug);

// Admin / Staff routes (In production, replace 'admin' with a role/permission check)
router.get('/admin/all', protect, admin, getAllArticles);
router.post('/', protect, admin, createArticle);
router.put('/:id', protect, admin, updateArticle);
router.delete('/:id', protect, admin, deleteArticle);

export default router;
