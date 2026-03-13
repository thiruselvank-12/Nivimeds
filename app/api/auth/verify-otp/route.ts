import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import {
  verifyOTP,
  generateAccessToken,
  generateRefreshToken,
} from '../../../../lib/auth';
import { setAuthCookies } from '../../../../lib/apiMiddleware';

const schema = z.object({
  phone: z.string().regex(/^\d{10}$/),
  otp: z.string().length(6),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { phone, otp, name, email } = parsed.data;

    // Verify OTP
    const result = await verifyOTP(phone, otp);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error, locked: result.locked },
        { status: result.locked ? 429 : 400 }
      );
    }

    await connectDB();

    // Find or create user
    let user = await User.findOne({ phone });
    const isNewUser = !user;

    if (!user) {
      user = new User({
        phone,
        name: name || `User${phone.slice(-4)}`,
        email,
        role: isAdminPhone(phone) ? 'admin' : 'user',
      });
      await user.save();
    } else if (email && !user.email) {
      user.email = email;
      await user.save();
    }

    // Issue tokens
    const payload = {
      userId: user._id.toString(),
      phone: user.phone,
      role: user.role as 'user' | 'admin',
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const userData = {
      id: user._id.toString(),
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      paybackPoints: user.paybackPoints,
      membershipTier: user.membershipTier,
      addresses: user.addresses,
      isNewUser,
    };

    const response = NextResponse.json({ success: true, user: userData });
    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch (error) {
    console.error('[verify-otp]', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

function isAdminPhone(phone: string): boolean {
  const adminPhones = (process.env.ADMIN_PHONES || '').split(',').map((p) => p.trim());
  return adminPhones.includes(phone);
}
