import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
  .setTitle('HRku API')
  .setDescription('hrku API description')
  .setVersion('0.1')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer' }, 'access-token',
  )
  .addServer(process.env.DEV_API,'Dev API')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api-docs', app, document);

  app.enableCors();
  console.log('server run in port:'+process.env.PORT)
  await app.listen(process.env.PORT);
}
bootstrap();
