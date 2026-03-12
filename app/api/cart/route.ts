import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Cart from '../../../models/Cart';
import Coupon from '../../../models/Coupon';
import { withAuth } from '../../../lib/apiMiddleware';

// GET /api/cart - Get user's server cart
export const GET = withAuth(async (req: any) => {
  try {
    await connectDB();
    const cart = await Cart.findOne({ userId: req.user.userId }).lean();
    return NextResponse.json({ success: true, cart: cart || { items: [], couponCode: null } });
  } catch (error) {
    console.error('[cart GET]', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
});

// POST /api/cart - Sync local cart to server (called on login)
export const POST = withAuth(async (req: any) => {
  try {
    const body = await req.json();
    const { items, couponCode } = body;

    await connectDB();

    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.userId },
      { userId: req.user.userId, items: items || [], couponCode },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error('[cart POST]', error);
    return NextResponse.json({ error: 'Failed to sync cart' }, { status: 500 });
  }
});

// PATCH /api/cart - Update cart item quantity or add item
export const PATCH = withAuth(async (req: any) => {
  try {
    const body = await req.json();
    const { productId, quantity, item } = body;

    await connectDB();

    let cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [] });
    }

    if (item) {
      // Add new item
      const existing = cart.items.find((i: any) => i.productId === item.productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.items.push({ ...item, quantity: 1 });
      }
    } else if (productId !== undefined) {
      // Update quantity
      if (quantity <= 0) {
        cart.items = cart.items.filter((i: any) => i.productId !== productId);
      } else {
        const existing = cart.items.find((i: any) => i.productId === productId);
        if (existing) existing.quantity = quantity;
      }
    }

    await cart.save();
    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error('[cart PATCH]', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
});

// DELETE /api/cart - Clear cart
export const DELETE = withAuth(async (req: any) => {
  try {
    await connectDB();
    await Cart.findOneAndUpdate(
      { userId: req.user.userId },
      { items: [], couponCode: null }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
});
