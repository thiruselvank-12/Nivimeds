import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Coupon from '../../../models/Coupon';
import { withAuth, withAdmin } from '../../../lib/apiMiddleware';

// POST /api/coupons/validate — Validate and get coupon details
export const POST = withAuth(async (req: any) => {
  try {
    const body = await req.json();
    const { code, orderTotal } = body;

    if (!code) return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });

    await connectDB();

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
    }

    if (orderTotal && orderTotal < coupon.minOrder) {
      return NextResponse.json({
        error: `Minimum order of ₹${coupon.minOrder} required for this coupon`,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        discount: coupon.discount,
        minOrder: coupon.minOrder,
        description: coupon.description,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
});

// GET /api/coupons — Admin: list all coupons
export const GET = withAdmin(async (req: any) => {
  try {
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
});
