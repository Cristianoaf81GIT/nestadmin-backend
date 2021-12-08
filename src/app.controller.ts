import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { Categoria } from './interfaces/categorias/categoria.interface';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  private ackErrors = [];
  constructor(private readonly appService: AppService) {}

  @EventPattern('criar-categoria')
  async criarCategoria(
    @Payload() categoria: Categoria,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);
    try {
      await this.appService.criarCategoria(categoria);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      this.ackErrors.forEach(async (ackError) => {
        if (error.message.includes(ackError)) {
          await channel.ack(originalMessage);
        }
      });
    }
  }

  @MessagePattern('consultar-categorias')
  async consultarCategorias(@Payload() _id: string) {
    if (_id) {
      return await this.appService.consultarTodasCategoriaPeloId(_id);
    } else {
      return await this.appService.consultarTodasCategorias();
    }
  }
}
