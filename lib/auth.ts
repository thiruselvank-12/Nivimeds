// Auth utilities (NextAuth stub)
// Requires NEXTAUTH_SECRET in .env.local

export interface OTPSession {
  phone: string;
  otp: string;
  expires: number; // timestamp
  attempts: number;
  lockedUntil?: number;
}

// In-memory OTP store (use Redis in production)
const otpStore = new Map<string, OTPSession>();

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(phone: string): string {
  const otp = generateOTP();
  otpStore.set(phone, {
    phone,
    otp,
    expires: Date.now() + 3 * 60 * 1000, // 3 minutes
    attempts: 0,
  });
  return otp;
}

export function verifyOTP(
  phone: string,
  inputOtp: string
): { success: boolean; error?: string; locked?: boolean } {
  const session = otpStore.get(phone);
  if (!session) return { success: false, error: 'OTP expired. Please resend.' };

  if (session.lockedUntil && Date.now() < session.lockedUntil) {
    const rem = Math.ceil((session.lockedUntil - Date.now()) / 60000);
    return { success: false, error: `Too many attempts. Try again in ${rem} min.`, locked: true };
  }

  if (Date.now() > session.expires) {
    otpStore.delete(phone);
    return { success: false, error: 'OTP expired. Please resend.' };
  }

  if (session.otp !== inputOtp) {
    session.attempts += 1;
    if (session.attempts >= 3) {
      session.lockedUntil = Date.now() + 5 * 60 * 1000; // 5 min lock
    }
    return { success: false, error: `Invalid OTP. ${3 - session.attempts} attempts left.` };
  }

  otpStore.delete(phone);
  return { success: true };
}
