import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import { withAuth } from '../../../../lib/apiMiddleware';

// GET /api/orders/[orderId]
export const GET = withAuth(async (req: any, context: any) => {
  try {
    const { orderId } = await context.params;
    await connectDB();

    const order = await Order.findOne({
      $or: [{ _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null }, { orderNumber: orderId }],
      userId: req.user.userId,
    }).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('[order detail]', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
});
