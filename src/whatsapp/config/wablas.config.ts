import { registerAs } from '@nestjs/config';

export default registerAs('wablas', () => ({
  apiUrl: process.env.WABLAS_API_URL || 'https://api.wablas.com/api/v2',
  apiKey: process.env.WABLAS_API_KEY || '',
  senderName: process.env.WABLAS_SENDER_NAME || 'Ngebengkel',
  enabled: process.env.WABLAS_ENABLED === 'true',
}));
