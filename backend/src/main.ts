import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

const normalizeOrigin = (origin: string): string =>
  origin.trim().replace(/\/$/, '');

const getAllowedOrigins = (value?: string): string[] => {
  const configured = value
    ?.split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

  if (configured && configured.length > 0) {
    return configured;
  }

  return [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://messmealcal.vercel.app',
  ];
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const allowedOrigins = getAllowedOrigins(
    configService.get<string>('CORS_ORIGINS'),
  );

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow: boolean) => void,
    ) => {
      const normalizedOrigin = origin ? normalizeOrigin(origin) : undefined;

      if (
        !origin ||
        allowedOrigins.includes('*') ||
        (normalizedOrigin ? allowedOrigins.includes(normalizedOrigin) : false)
      ) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`), false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
