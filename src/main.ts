import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

dotenv.config();
const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://<user>:<pass>@<host>:5672/<internal_host>`],
      noAck: false,
      queue: '<queue_name>',
    },
  });
  logger.log('microservice is listening');
  await app.listen();
}

bootstrap();
