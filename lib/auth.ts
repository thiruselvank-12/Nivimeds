import jwt from 'jsonwebtoken';
import { redisSet, redisGet, redisDel, redisIncr } from './redis';

// ==================== Token Types ====================

export interface JWTPayload {
  userId: string;
  phone: string;
  role: 'user' | 'admin';
}

export interface OTPData {
  otp: string;
  attempts: number;
  lockedUntil?: number;
}

// ==================== JWT Utilities ====================

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_replace_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_replace_in_production';

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// ==================== OTP Utilities (Redis-backed) ====================

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const OTP_TTL = 3 * 60; // 3 minutes
const OTP_LOCK_TTL = 5 * 60; // 5 minutes lock

export async function storeOTP(phone: string): Promise<string> {
  const otp = generateOTP();
  const data: OTPData = { otp, attempts: 0 };
  await redisSet(`otp:${phone}`, JSON.stringify(data), OTP_TTL);
  return otp;
}

export async function verifyOTP(
  phone: string,
  inputOtp: string
): Promise<{ success: boolean; error?: string; locked?: boolean }> {
  // Check rate lock
  const lockKey = `otp_lock:${phone}`;
  const locked = await redisGet(lockKey);
  if (locked) {
    return { success: false, error: 'Too many attempts. Please wait 5 minutes.', locked: true };
  }

  const raw = await redisGet(`otp:${phone}`);
  if (!raw) return { success: false, error: 'OTP expired. Please resend.' };

  const data: OTPData = JSON.parse(raw);

  if (data.otp !== inputOtp) {
    data.attempts += 1;
    if (data.attempts >= 3) {
      await redisDel(`otp:${phone}`);
      await redisSet(lockKey, '1', OTP_LOCK_TTL);
      return { success: false, error: 'Too many attempts. Locked for 5 minutes.', locked: true };
    }
    await redisSet(`otp:${phone}`, JSON.stringify(data), OTP_TTL);
    return {
      success: false,
      error: `Invalid OTP. ${3 - data.attempts} attempt${3 - data.attempts === 1 ? '' : 's'} left.`,
    };
  }

  // Valid OTP
  await redisDel(`otp:${phone}`);
  return { success: true };
}

// ==================== Rate Limiting ====================

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const count = await redisIncr(`rl:${key}`, windowSeconds);
  return count <= limit;
}

// ==================== Refresh Token Blacklist ====================

export async function blacklistRefreshToken(token: string): Promise<void> {
  // Store token in blacklist for 7 days (max refresh token life)
  await redisSet(`refresh_bl:${token.slice(-32)}`, '1', 7 * 24 * 60 * 60);
}

export async function isRefreshTokenBlacklisted(token: string): Promise<boolean> {
  const val = await redisGet(`refresh_bl:${token.slice(-32)}`);
  return val !== null;
}
