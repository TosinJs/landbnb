import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './exceptions/all-exceptions.exception';
import * as sessions from "express-session";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }))
  app.enableCors()
  app.useGlobalFilters(new AllExceptionsFilter())

  app.use(
    sessions({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
    })
  )
  await app.listen(8080);
}
bootstrap();
