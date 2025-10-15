import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  from: {
    name: process.env.EMAIL_FROM_NAME || 'Ngebengkel',
    address: process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER,
  },
  verificationUrl:
    process.env.EMAIL_VERIFICATION_URL ||
    'http://localhost:3000/auth/verify-email',
  verificationTokenExpiry: parseInt(
    process.env.EMAIL_VERIFICATION_EXPIRY || '3600000',
    10,
  ), // 1 hour in milliseconds
}));
