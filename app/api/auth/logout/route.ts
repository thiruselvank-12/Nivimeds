import { NextRequest, NextResponse } from 'next/server';
import { blacklistRefreshToken } from '../../../../lib/auth';
import { clearAuthCookies } from '../../../../lib/apiMiddleware';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refresh_token')?.value;
    if (refreshToken) {
      await blacklistRefreshToken(refreshToken);
    }
    const response = NextResponse.json({ success: true, message: 'Logged out' });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    console.error('[logout]', error);
    const response = NextResponse.json({ success: true });
    clearAuthCookies(response);
    return response;
  }
}
