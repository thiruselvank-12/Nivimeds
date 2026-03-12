import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import User from '../../../../models/User';
import { withAdmin, getPagination } from '../../../../lib/apiMiddleware';
import { sendOrderStatusSMS } from '../../../../lib/sms';

// GET /api/admin/orders
export const GET = withAdmin(async (req: any) => {
  try {
    await connectDB();
    const { page, limit, skip } = getPagination(req);
    const status = req.nextUrl.searchParams.get('status') || '';
    const query: Record<string, unknown> = {};
    if (status) query.status = status;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
});
