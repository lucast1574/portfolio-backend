import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('CORS not allowed for ' + origin), false);
    },
    credentials: true,
  });
  app.use(cookieParser());
  // NOTE: whitelist:true would strip nested input fields (e.g. i18n.es.name)
  // because our GraphQL @InputType DTOs do not carry class-validator
  // decorators on nested classes. GraphQL already validates the shape via
  // Apollo, so we only need transform here.
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const port = Number(process.env.PORT || 4000);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Portfolio backend listening on :${port}`);
}
bootstrap();
