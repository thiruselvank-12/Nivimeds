import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, JWTPayload } from './auth';

type RouteHandler = (req: NextRequest, context?: { params?: Record<string, string> }) => Promise<NextResponse>;
type AuthedHandler = (req: NextRequest & { user: JWTPayload }, context?: { params?: Record<string, string> }) => Promise<NextResponse>;

// ==================== Auth Middleware HOC ====================

export function withAuth(handler: AuthedHandler): RouteHandler {
  return async (req, context) => {
    const token =
      req.cookies.get('access_token')?.value ||
      req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    (req as any).user = payload;
    return handler(req as any, context);
  };
}

// ==================== Admin Middleware HOC ====================

export function withAdmin(handler: AuthedHandler): RouteHandler {
  return withAuth(async (req, context) => {
    if (req.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    return handler(req, context);
  }) as RouteHandler;
}

// ==================== JSON Response Helpers ====================

export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status: number = 400): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status });
}

// ==================== Pagination Helpers ====================

export function getPagination(req: NextRequest) {
  const page = Math.max(1, Number(req.nextUrl.searchParams.get('page') || 1));
  const limit = Math.min(100, Math.max(1, Number(req.nextUrl.searchParams.get('limit') || 20)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// ==================== Cookie Utils ====================

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): void {
  const isProduction = process.env.NODE_ENV === 'production';

  response.cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });

  response.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set('access_token', '', { maxAge: 0, path: '/' });
  response.cookies.set('refresh_token', '', { maxAge: 0, path: '/' });
}
