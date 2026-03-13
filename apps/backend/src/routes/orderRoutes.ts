import express from 'express';
import { createOrder, getUserOrders, getOrderDetails, getAllOrders, updateOrderStatus } from '../controllers/orderController';
import { protect, admin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/all', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.get('/:id', protect, getOrderDetails);

export default router;
