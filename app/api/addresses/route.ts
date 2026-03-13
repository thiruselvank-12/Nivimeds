import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import { withAuth } from '../../../lib/apiMiddleware';
import mongoose from 'mongoose';

const addressSchema = z.object({
  label: z.string().default('Home'),
  name: z.string().min(2),
  phone: z.string().regex(/^\d{10}$/),
  line1: z.string().min(5),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
  isDefault: z.boolean().default(false),
});

// GET /api/addresses
export const GET = withAuth(async (req: any) => {
  try {
    await connectDB();
    const user = await User.findById(req.user.userId).select('addresses');
    return NextResponse.json({ success: true, addresses: user?.addresses ?? [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
});

// POST /api/addresses
export const POST = withAuth(async (req: any) => {
  try {
    const body = await req.json();
    const parsed = addressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(req.user.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const newAddress = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...parsed.data,
    };

    // If new address is default, unset existing defaults
    if (parsed.data.isDefault) {
      user.addresses.forEach((a: any) => (a.isDefault = false));
    }

    user.addresses.push(newAddress as any);
    await user.save();

    return NextResponse.json({ success: true, address: newAddress }, { status: 201 });
  } catch (error) {
    console.error('[addresses POST]', error);
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
  }
});

// DELETE /api/addresses?id=xxx
export const DELETE = withAuth(async (req: any) => {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Address ID required' }, { status: 400 });

    await connectDB();
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { addresses: { _id: id } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
});
