import express from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
} from '../controllers/productController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

// Public
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin protected
router.get('/admin/all', protect, admin, getAllProductsAdmin);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
