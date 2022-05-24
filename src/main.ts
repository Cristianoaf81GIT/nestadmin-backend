import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns-tz';
import ptBR from 'date-fns/locale/pt-BR';

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

  Date.prototype.toJSON = (): string => {
    try {
      return format(this, 'yyyy-MM-dd HH:mm:ss.SS', {
        timeZone: 'America/Sao_Paulo',
        locale: ptBR,
      });
    } catch (error: unknown) {
      return this;
    }
  };

  logger.log('microservice is listening');
  await app.listen();
}

bootstrap();
