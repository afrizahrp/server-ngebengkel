import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, HttpException } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaService } from './prisma.service';

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

  // CORS Configuration - SEDERHANA & STANDAR
  const isProduction = process.env.NODE_ENV === 'production';

  // Daftar allowed origins - bisa dari env variable atau default
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : [
        // Development
        'http://localhost:3000',
        'http://localhost:3100',
        'http://localhost:3200',
        'http://localhost:3300',
        // Production
        'https://admin.ngebengkel.com',
        'https://workshop.ngebengkel.com',
        'https://ngebengkel.com',
      ];

  // Log untuk debugging (always log in production to help troubleshoot)
  console.log('[CORS] Environment:', process.env.NODE_ENV);
  console.log('[CORS] Allowed origins:', allowedOrigins);

   // Enable CORS - konfigurasi sederhana & standar
  app.enableCors({
    origin: (origin, callback) => {
      // Log origin untuk debugging di production
      if (isProduction) {
        console.log('[CORS] Request from origin:', origin || 'no-origin');
      }
  
      // Allow requests with no origin (mobile apps, Postman, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }
  
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        console.log('[CORS] ✅ Origin allowed:', origin);
        callback(null, true);
      } else {
        console.log('[CORS] ❌ Origin blocked:', origin);
        // FIX: Return false instead of throwing error
        // This allows CORS middleware to properly reject with headers
        callback(null, false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'X-Anonymous-Id',
      'x-anonymous-id',
      'X-Refresh-Token',
      'x-refresh-token',
    ],
    exposedHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
    ],
    credentials: true,
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  
  // ...existing code...

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

  // Enable graceful shutdown for Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // const port = process.env.PORT ?? 4000;
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
