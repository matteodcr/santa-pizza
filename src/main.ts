import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Swagger
  const configSwagger = new DocumentBuilder()
    .setTitle('Pizza Party API')
    .setDescription('The Pizza Party API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  const port = config.get<string>('SERVER_PORT');
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
