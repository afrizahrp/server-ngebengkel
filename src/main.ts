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
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false, // Disable untuk compatibility
      crossOriginResourcePolicy: { policy: 'cross-origin' },
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

  // CORS Configuration - menggunakan array langsung untuk lebih reliable
  app.enableCors({
    origin: allowedOrigins, // Gunakan array langsung, lebih reliable untuk preflight
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
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
    credentials: true, // Allow cookies and credentials
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 200, // Beberapa browser/axios memerlukan 200 untuk preflight
  });

  // Add logging middleware
  // app.use(
  //   (
  //     req: { method: any; url: any; headers: any; body: any },
  //     res: any,
  //     next: () => void,
  //   ) => {
  //     console.log(`Received ${req.method} request to ${req.url}`);
  //     console.log('Headers:', req.headers);
  //     console.log('Body:', req.body);
  //     next();
  //   },
  // );

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
