import { Request, Response } from 'express';
import crypto from 'crypto';

// This simulates a Razorpay backend integration without needing actual secret keys for local dev
export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    
    // Simulate Razorpay short random order details
    const orderId = 'order_' + crypto.randomBytes(8).toString('hex');

    res.json({
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock12345',
      amount: amount * 100, // Razorpay takes amount in paise (1 INR = 100 paise)
      currency: 'INR',
      orderId,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // In a real integration you would verify using crypto.createHmac and your secret key.
    // However for simulation we safely assume it's verified as long as we get a mock payment id
    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Missing payment signature details' });
    }

    res.json({ message: 'Payment verified successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
