import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://ngebengkel.com',
    ],
    methods: 'GET,POST,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // const port = process.env.PORT ?? 4000;
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
