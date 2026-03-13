import { Request, Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import Prescription from '../models/Prescription';

// ──────────────────────────────────────────────────────
//  GET /api/v1/admin/dashboard
// ──────────────────────────────────────────────────────
export const getDashboard = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueAgg, lowStockItems, recentOrders, pendingPrescriptions, lowStockMedicines, outOfStock] =
      await Promise.all([
        User.countDocuments(),
        Product.countDocuments({ isActive: true }),
        Order.countDocuments(),
        Order.aggregate([
          { $match: { paymentStatus: 'completed' } },
          { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
        Product.find({ stockQuantity: { $lt: 10, $gt: 0 }, isActive: true })
          .select('name stockQuantity brand')
          .limit(10),
        Order.find({})
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('user', 'name phone'),
        Prescription.countDocuments({ status: 'pending' }),
        Product.countDocuments({ stockQuantity: { $lt: 10, $gt: 0 }, isActive: true }),
        Product.countDocuments({ stockQuantity: { $lte: 0 }, isActive: true }),
      ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingPrescriptions,
        lowStockMedicines,
        outOfStock,
        lowStockItems,
        recentOrders,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ──────────────────────────────────────────────────────
//  GET /api/v1/admin/analytics
// ──────────────────────────────────────────────────────
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [dailyOrders, topProducts, monthlyRevenue, userGrowth] = await Promise.all([
      // Daily order count for the last 7 days
      Order.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            revenue: { $sum: '$total' },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Top 5 selling products by revenue (from items embedded in orders)
      Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.name',
            totalSold: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          },
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 5 },
      ]),

      // Monthly revenue sum
      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),

      // New users in last 30 days
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    res.json({
      success: true,
      data: {
        dailyOrders,
        topProducts,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        newUsersThisMonth: userGrowth,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ──────────────────────────────────────────────────────
//  PUT /api/v1/admin/users/:id/block
// ──────────────────────────────────────────────────────
export const blockUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, error: 'Cannot block an admin user' });
    }

    (user as any).isBlocked = !(user as any).isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User ${(user as any).isBlocked ? 'blocked' : 'unblocked'} successfully`,
      isBlocked: (user as any).isBlocked,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
