// Email service using Nodemailer (works with SendGrid SMTP or any SMTP server)
// Falls back to console.log if SendGrid is not configured

import nodemailer from 'nodemailer';

const configured = !!(process.env.SENDGRID_API_KEY);

const transporter = configured
  ? nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    })
  : null;

const FROM = `"${process.env.SENDGRID_FROM_NAME || 'Nivimeds'}" <${
  process.env.SENDGRID_FROM_EMAIL || 'noreply@nivimeds.com'
}>`;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(opts: EmailOptions): Promise<void> {
  if (!transporter) {
    console.log(`[Email - DEV] To: ${opts.to} | Subject: ${opts.subject}`);
    return;
  }
  await transporter.sendMail({ from: FROM, ...opts });
}

// ==================== Email Templates ====================

export function sendOrderConfirmationEmail(
  to: string,
  orderNumber: string,
  total: number,
  items: { name: string; quantity: number; price: number }[]
): Promise<void> {
  const itemRows = items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${i.name} ×${i.quantity}</td><td style="text-align:right;padding:8px 0;border-bottom:1px solid #f0f0f0;">₹${(i.price * i.quantity).toFixed(2)}</td></tr>`
    )
    .join('');

  return sendEmail({
    to,
    subject: `Order Confirmed — #${orderNumber} | Nivimeds`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:12px;">
        <div style="background:#1E6FD9;color:white;padding:24px;border-radius:8px;text-align:center;margin-bottom:24px;">
          <h1 style="margin:0;font-size:24px;">Order Confirmed! 🎉</h1>
          <p style="margin:8px 0 0;opacity:0.9;">Order #${orderNumber}</p>
        </div>
        <div style="background:white;padding:24px;border-radius:8px;">
          <table style="width:100%;">${itemRows}</table>
          <div style="border-top:2px solid #1E6FD9;padding-top:12px;margin-top:8px;font-weight:bold;display:flex;justify-content:space-between;">
            <span>Total</span><span>₹${total.toFixed(2)}</span>
          </div>
        </div>
        <p style="text-align:center;color:#666;font-size:13px;margin-top:16px;">
          Thank you for shopping with Nivimeds. Your order will be delivered soon!
        </p>
      </div>
    `,
  });
}

export function sendOTPEmail(to: string, otp: string): Promise<void> {
  return sendEmail({
    to,
    subject: `Your Nivimeds OTP: ${otp}`,
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:0 auto;text-align:center;padding:24px;">
        <h2 style="color:#1E6FD9;">Your OTP Code</h2>
        <div style="font-size:40px;font-weight:900;letter-spacing:12px;color:#1E6FD9;background:#f0f6ff;padding:20px;border-radius:12px;margin:20px 0;">${otp}</div>
        <p style="color:#666;">Valid for 3 minutes. Do not share this code with anyone.</p>
      </div>
    `,
  });
}
