import { Request, Response } from 'express';
import Order from '../models/Order';
import crypto from 'crypto';

// Extend the Request to include user
declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

const generateOrderNumber = () => {
  return 'ORD' + Math.floor(10000000 + Math.random() * 90000000).toString();
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      subtotal,
      discount,
      deliveryFee,
      total
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Must be logged in to create an order' });
    }

    const orderNumber = generateOrderNumber();
    const paymentStatus = (paymentMethod === 'cod') ? 'pending' : 'completed';

    const newOrder = await Order.create({
      user: req.user._id,
      orderNumber,
      items,
      shippingAddress,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      paymentStatus,
      orderStatus: 'processing',
      subtotal,
      discount,
      deliveryFee,
      total,
    });

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Must be logged in' });
    }
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: 'Must be logged in' });
    }
    // Assume id can be Order Number
    const order = await Order.findOne({ user: req.user._id, orderNumber: id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'name email phone');
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = status;
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
