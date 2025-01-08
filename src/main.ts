import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1/');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const configService = app.get(ConfigService);
  const swaggerConfig = new DocumentBuilder()
  .setTitle(configService.get<string>('APP_NAME') ?? 'Currency Flow')
  .setDescription('The API description')
  .setVersion('1.0')
  .addBearerAuth(
    {
      description: 'Please enter token in following format: <Token>',
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header'
    },
    'JWT'
  )
  .build();

const document = SwaggerModule.createDocument(app, swaggerConfig);
SwaggerModule.setup('api/docs', app, document, {
  swaggerOptions: {
    persistAuthorization: true
  }
});

  await app.listen(3000);
}
bootstrap();
