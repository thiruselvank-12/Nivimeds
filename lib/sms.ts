// SMS service using Twilio
// Falls back to console.log if Twilio is not configured (perfect for dev)

let twilioClient: ReturnType<typeof import('twilio')> | null = null;

function getTwilioClient() {
  if (twilioClient) return twilioClient;
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN
  ) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
}

export async function sendSMS(to: string, message: string): Promise<void> {
  const client = getTwilioClient();
  if (!client) {
    console.log(`[SMS - DEV] To: ${to} | Message: ${message}`);
    return;
  }
  const phone = to.startsWith('+') ? to : `+91${to}`;
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to: phone,
  });
}

export async function sendOTPSMS(phone: string, otp: string): Promise<void> {
  return sendSMS(phone, `Your Nivimeds OTP is: ${otp}. Valid for 3 minutes. Do not share.`);
}

export async function sendOrderStatusSMS(phone: string, orderNumber: string, status: string): Promise<void> {
  const messages: Record<string, string> = {
    confirmed: `Your Nivimeds order #${orderNumber} is confirmed! We'll notify you when it's packed.`,
    packed: `Your Nivimeds order #${orderNumber} is packed and ready for dispatch!`,
    out_for_delivery: `Your Nivimeds order #${orderNumber} is out for delivery! Expected today.`,
    delivered: `Your Nivimeds order #${orderNumber} has been delivered. Thank you for shopping with us!`,
    cancelled: `Your Nivimeds order #${orderNumber} has been cancelled. Refund will be processed in 5-7 days.`,
  };
  const msg = messages[status] || `Order #${orderNumber} status updated to: ${status}`;
  return sendSMS(phone, msg);
}
