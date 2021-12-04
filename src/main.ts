import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(cookieParser)
  
  const pathFile = process.cwd();
  
  app.use('/avatar', express.static(pathFile + "/storage/avatar"));

  
  app.use(express.json({limit: '50mb'}));
  app.use(express.urlencoded({limit: '50mb', extended: true}));

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
  .setTitle('HRku API')
  .setDescription('hrku API description')
  .setVersion('0.1')
  .addBasicAuth({type: 'http',scheme: 'basic'})
  .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'access-token')
  .addServer(process.env.DEV_API,'Dev API')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api-docs', app, document);

  app.enableCors();
  console.log('server run in port:'+process.env.PORT)
  await app.listen(process.env.PORT);
}
bootstrap();
