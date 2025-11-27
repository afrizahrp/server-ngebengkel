import { registerAs } from '@nestjs/config';

export default registerAs('claim', () => ({
  otpExpirySeconds: parseInt(
    process.env.OTP_EXPIRY_SECONDS || '300',
    10,
  ), // Default: 300 detik (5 menit)
  otpLength: parseInt(process.env.OTP_LENGTH || '6', 10), // Default: 6 digit
}));

