// Payments stub for Razorpay integration
// Requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

export async function createRazorpayOrder(
  amountInRupees: number
): Promise<RazorpayOrder> {
  // Production: use Razorpay SDK
  // const Razorpay = require('razorpay');
  // const razorpay = new Razorpay({
  //   key_id: process.env.RAZORPAY_KEY_ID!,
  //   key_secret: process.env.RAZORPAY_KEY_SECRET!,
  // });
  // return await razorpay.orders.create({ amount: amountInRupees * 100, currency: 'INR' });

  // Stub response
  return {
    id: `order_${Date.now()}`,
    amount: amountInRupees * 100,
    currency: 'INR',
  };
}

export function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  // Production: verify HMAC-SHA256 signature
  // const crypto = require('crypto');
  // const body = orderId + '|' + paymentId;
  // const expectedSignature = crypto
  //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
  //   .update(body).digest('hex');
  // return expectedSignature === signature;

  return true; // Stub
}

export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder';
