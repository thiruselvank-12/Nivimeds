import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '../../../../lib/payments';
import { withAuth } from '../../../../lib/apiMiddleware';

// POST /api/payments/verify — Verify Razorpay payment signature
export const POST = withAuth(async (req: any) => {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified',
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error('[verify payment]', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
});
