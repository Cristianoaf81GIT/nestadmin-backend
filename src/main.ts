import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();
const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: +process.env.TRANSPORT,
    options: {
      urls: [process.env.SERVER_URL],
      queue: process.env.QUEUE_NAME,
    },
  });
  logger.log('microservice is listening');
  await app.listen();
}
bootstrap();
