import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Order from '../../../models/Order';
import Cart from '../../../models/Cart';
import User from '../../../models/User';
import Coupon from '../../../models/Coupon';
import { withAuth } from '../../../lib/apiMiddleware';
import { sendOrderConfirmationEmail } from '../../../lib/email';
import { sendOrderStatusSMS } from '../../../lib/sms';

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `NV${timestamp}${random}`;
}

// GET /api/orders — list user's orders
export const GET = withAuth(async (req: any) => {
  try {
    await connectDB();
    const page = Math.max(1, Number(req.nextUrl.searchParams.get('page') || 1));
    const limit = 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ userId: req.user.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ userId: req.user.userId }),
    ]);

    return NextResponse.json({
      success: true,
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('[orders GET]', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
});

// POST /api/orders — create a new order (COD or post-payment)
export const POST = withAuth(async (req: any) => {
  try {
    const body = await req.json();
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      discount,
      deliveryFee,
      total,
      couponCode,
      razorpayOrderId,
      razorpayPaymentId,
      prescriptionUrl,
      notes,
    } = body;

    if (!items?.length || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Increment coupon usage
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase(), isActive: true },
        { $inc: { usedCount: 1 } }
      );
    }

    const orderNumber = generateOrderNumber();
    const estimatedDelivery = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days

    const order = new Order({
      orderNumber,
      userId: req.user.userId,
      items,
      shippingAddress,
      subtotal,
      discount: discount || 0,
      deliveryFee: deliveryFee || 0,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      razorpayOrderId,
      razorpayPaymentId,
      status: 'placed',
      statusTimeline: [{ status: 'placed', timestamp: new Date(), note: 'Order placed successfully' }],
      couponCode,
      prescriptionUrl,
      notes,
      estimatedDelivery,
    });

    await order.save();

    // Clear server cart
    await Cart.findOneAndUpdate(
      { userId: req.user.userId },
      { items: [], couponCode: null }
    );

    // Add payback points (1 point per ₹10 spent)
    const pointsEarned = Math.floor(total / 10);
    if (pointsEarned > 0) {
      await User.findByIdAndUpdate(req.user.userId, { $inc: { paybackPoints: pointsEarned } });
    }

    // Notifications (non-blocking)
    const user = await User.findById(req.user.userId);
    if (user) {
      sendOrderConfirmationEmail(
        user.email || '',
        orderNumber,
        total,
        items.map((i: any) => ({ name: i.productName, quantity: i.quantity, price: i.price }))
      ).catch(() => {});

      sendOrderStatusSMS(user.phone, orderNumber, 'placed').catch(() => {});
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('[orders POST]', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
});
