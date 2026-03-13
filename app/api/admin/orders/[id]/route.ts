import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Order from '../../../../../models/Order';
import User from '../../../../../models/User';
import { withAdmin } from '../../../../../lib/apiMiddleware';
import { sendOrderStatusSMS } from '../../../../../lib/sms';

const VALID_STATUSES = ['placed', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled'];

// PATCH /api/admin/orders/[id] — Update order status
export const PATCH = withAdmin(async (req: any, context: any) => {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status, note } = body;

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status,
        $push: {
          statusTimeline: {
            status,
            timestamp: new Date(),
            note: note || `Order ${status}`,
          },
        },
      },
      { new: true }
    );

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Send SMS notification
    const user = await User.findById(order.userId);
    if (user) {
      sendOrderStatusSMS(user.phone, order.orderNumber, status).catch(() => {});
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
});

// GET /api/admin/orders/[id] — Order detail
export const GET = withAdmin(async (req: any, context: any) => {
  try {
    const { id } = await context.params;
    await connectDB();
    const order = await Order.findById(id).lean();
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
});
