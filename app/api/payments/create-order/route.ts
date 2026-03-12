import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { createRazorpayOrder } from '../../../../lib/payments';
import { withAuth } from '../../../../lib/apiMiddleware';

// POST /api/payments/create-order
export const POST = withAuth(async (req: any) => {
  try {
    const body = await req.json();
    const { amount } = body;

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    await connectDB();
    const receipt = `rcpt_${req.user.userId.slice(-8)}_${Date.now()}`;
    const order = await createRazorpayOrder(amount, receipt);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('[create-order]', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
});
