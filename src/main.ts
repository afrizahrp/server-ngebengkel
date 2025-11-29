import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, HttpException } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security Headers dengan Helmet
  // IMPORTANT: Helmet harus dikonfigurasi sebelum CORS untuk menghindari konflik
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: [
            "'self'",
            'https://rest.ngebengkel.com',
            'https://admin.ngebengkel.com',
          ],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false, // Disable untuk compatibility
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginOpenerPolicy: false, // Disable untuk CORS compatibility
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  // Serve static files (untuk logo dan assets lainnya)
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  // CORS Configuration dengan environment variables
  const isProduction = process.env.NODE_ENV === 'production';
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : isProduction
      ? [
          'https://ngebengkel.com',
          'https://www.ngebengkel.com',
          'https://workshop.ngebengkel.com',
          'https://admin.ngebengkel.com',
          'https://app.ngebengkel.com',
        ]
      : [
          'http://localhost:3000',
          'http://localhost:3100',
          'http://localhost:3200',
          'http://localhost:3300',
          'https://ngebengkel.com',
          'https://www.ngebengkel.com',
          'https://www.workshop.ngebengkel.com',
          'https://www.admin.ngebengkel.com',
          'https://www.app.ngebengkel.com',
        ];

  // CORS Configuration - menggunakan array origins langsung untuk lebih reliable dengan preflight
  // Log allowed origins untuk debugging
  if (!isProduction) {
    console.log('[CORS] Allowed origins:', allowedOrigins);
  }

  app.enableCors({
    origin: allowedOrigins, // Gunakan array langsung - lebih reliable untuk preflight
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      'X-Anonymous-Id', // For anonymous login
      'x-anonymous-id', // Case-insensitive support
      'X-Refresh-Token', // For refresh token
      'x-refresh-token', // Case-insensitive support
    ],
    exposedHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
      'x-access-token', // Untuk token refresh di frontend
      'x-refresh-token', // Untuk token refresh di frontend
      'x-token-refreshed', // Flag untuk token refresh
    ],
    credentials: true, // Allow cookies and credentials - IMPORTANT for CORS with credentials
    maxAge: 86400, // 24 hours - cache preflight response
    preflightContinue: false, // End preflight request immediately (jangan lanjutkan ke route handler)
    optionsSuccessStatus: 204, // Use 204 No Content for OPTIONS (standard untuk preflight)
  });

  // Add logging middleware untuk debugging CORS (hanya di development)
  if (!isProduction) {
    app.use((req: any, res: any, next: () => void) => {
      // Log CORS preflight requests
      if (req.method === 'OPTIONS') {
        console.log(`[CORS Preflight] ${req.method} ${req.url}`);
        console.log(
          `[CORS Preflight] Origin: ${req.headers.origin || 'no origin'}`,
        );
        console.log(
          `[CORS Preflight] Access-Control-Request-Method: ${req.headers['access-control-request-method'] || 'N/A'}`,
        );
        console.log(
          `[CORS Preflight] Access-Control-Request-Headers: ${req.headers['access-control-request-headers'] || 'N/A'}`,
        );
      }
      next();
    });
  }

  // Global Exception Filter untuk sanitize error messages
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: { enableImplicitConversion: true },
      validateCustomDecorators: true, // Enable validation for custom decorators
      stopAtFirstError: false, // Collect all validation errors
      exceptionFactory: (errors) => {
        // Custom exception factory untuk sanitize validation errors
        const messages = errors.map((error) => {
          const constraints = error.constraints || {};
          return Object.values(constraints)[0] || 'Validation failed';
        });
        return new HttpException(
          {
            statusCode: 400,
            message: messages,
            error: 'Bad Request',
          },
          400,
        );
      },
    }),
  );

  // set all routes with /api prefix
  app.setGlobalPrefix('api');

  // const port = process.env.PORT ?? 4000;
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
