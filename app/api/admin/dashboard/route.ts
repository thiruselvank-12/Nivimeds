import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import Product from '../../../../models/Product';
import User from '../../../../models/User';
import { withAdmin } from '../../../../lib/apiMiddleware';

export const GET = withAdmin(async (req: any) => {
  try {
    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      monthOrders,
      totalRevenue,
      monthRevenue,
      totalProducts,
      totalUsers,
      ordersByStatus,
      recentOrders,
      revenueByDay,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true }),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Order.aggregate([
        { $match: { createdAt: { $gte: last30Days }, paymentStatus: 'paid' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      metrics: {
        totalOrders,
        monthOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthRevenue: monthRevenue[0]?.total || 0,
        totalProducts,
        totalUsers,
        ordersByStatus: Object.fromEntries(ordersByStatus.map((s: any) => [s._id, s.count])),
        recentOrders,
        revenueByDay,
      },
    });
  } catch (error) {
    console.error('[admin dashboard]', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
});
