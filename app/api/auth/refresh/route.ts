import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { verifyRefreshToken, generateAccessToken, isRefreshTokenBlacklisted } from '../../../../lib/auth';
import { setAuthCookies, errorResponse } from '../../../../lib/apiMiddleware';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refresh_token')?.value;
    if (!refreshToken) return errorResponse('No refresh token', 401);

    // Check blacklist
    if (await isRefreshTokenBlacklisted(refreshToken)) {
      return errorResponse('Token revoked', 401);
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) return errorResponse('Invalid refresh token', 401);

    await connectDB();
    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) return errorResponse('User not found', 401);

    const newPayload = { userId: user._id.toString(), phone: user.phone, role: user.role as 'user' | 'admin' };
    const newAccessToken = generateAccessToken(newPayload);

    const response = NextResponse.json({ success: true });
    response.cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('[refresh]', error);
    return errorResponse('Failed to refresh token', 500);
  }
}
