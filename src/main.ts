import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('main');

async function bootstrap() {
  const configService = new ConfigService();
  const transport = parseInt(configService.get<string>('TRANSPORT_LOCAL'));
  const connectionUrl = configService.get<string>('SERVER_URL_LOCAL');
  const noAckOp = configService.get<string>('NOACK') === 'true';
  const queueName = configService.get<string>('QUEUE_NAME_LOCAL');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport,
      options: {
        urls: [connectionUrl],
        noAck: noAckOp,
        queue: queueName,
      },
    },
  );
  logger.log('microservice is listening');
  await app.listen();
}

bootstrap();
