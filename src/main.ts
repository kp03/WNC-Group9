import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Set this up to automatically validate
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Sakila Api').setVersion('1.0').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);
  await app.listen(4000);
}
bootstrap();
