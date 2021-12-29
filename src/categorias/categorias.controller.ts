import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Categoria } from '../interfaces/categorias/categoria.interface';
import { CategoriasService } from './categorias.service';

@Controller()
export class CategoriasController {
  private logger = new Logger(CategoriasController.name);
  private ackErrors: string[] = ['E11000'];

  constructor(private categoriaService: CategoriasService) {}

  @EventPattern('criar-categoria')
  async criarCategoria(
    @Payload() categoria: Categoria,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`data: ${JSON.stringify(categoria)}`);

    try {
      await this.categoriaService.criarCategoria(categoria);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = this.ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }

  @MessagePattern('consultar-categorias')
  async consultarCategorias(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      if (_id) {
        return await this.categoriaService.consultarCategoriaPorId(_id);
      } else {
        return await this.categoriaService.consultarTodasCategorias();
      }
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('atualizar-categoria')
  async atualizarCategoria(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const _id: string = data.id;
      const categoria: Categoria = data.categoria;
      await this.categoriaService.atualizarCategoria(_id, categoria);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = this.ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }
}
