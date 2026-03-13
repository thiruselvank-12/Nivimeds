import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { verifyAccessToken } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get('access_token')?.value ||
      req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.userId).select('-passwordHash -googleId');
    if (!user || !user.isActive) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        paybackPoints: user.paybackPoints,
        membershipTier: user.membershipTier,
        membershipExpiry: user.membershipExpiry,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.error('[/me]', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
