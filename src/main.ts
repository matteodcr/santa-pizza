import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TYPEORM_MODULE_OPTIONS } from '@nestjs/typeorm/dist/typeorm.constants';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const typeOrmModule = app.get(TYPEORM_MODULE_OPTIONS);

  // Swagger
  const configSwagger = new DocumentBuilder()
    .setTitle('Pizza Party API')
    .setDescription('The Pizza Party API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);

  // Settings
  const port = configService.get<string>('SERVER_PORT');
  app.enableCors();

  // Start
  await app.listen(port);
  logger.log(`Swagger UI available at http://localhost:${port}/api`);
  logger.log(
    `Connected to ${typeOrmModule.type} database at ${typeOrmModule.host}:${typeOrmModule.port}/${typeOrmModule.database}`,
  );
  logger.log(
    `Application listening on port ${port} in ${process.env.NODE_ENV} mode`,
  );
}
bootstrap();
