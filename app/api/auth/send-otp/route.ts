import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '../../../../lib/mongodb';
import { storeOTP, checkRateLimit } from '../../../../lib/auth';
import { sendOTPSMS } from '../../../../lib/sms';
import { sendOTPEmail } from '../../../../lib/email';

const schema = z.object({
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
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

    const { phone, email } = parsed.data;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    // Rate limit: 3 OTPs per minute per IP, 5 per phone per 10 minutes
    const ipAllowed = await checkRateLimit(`otp_ip:${ip}`, 3, 60);
    const phoneAllowed = await checkRateLimit(`otp_phone:${phone}`, 5, 600);

    if (!ipAllowed || !phoneAllowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    await connectDB();
    const otp = await storeOTP(phone);

    // Send OTP
    await sendOTPSMS(phone, otp);
    if (email) {
      await sendOTPEmail(email, otp).catch(() => {}); // non-blocking
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // In dev mode, include OTP in response for testing
      ...(process.env.NODE_ENV !== 'production' && { devOtp: otp }),
    });
  } catch (error) {
    console.error('[send-otp]', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
