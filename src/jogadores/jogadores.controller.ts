import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Jogador } from '../interfaces/jogadores/jogador.interface';
import { JogadoresService } from './jogadores.service';

const ackErrors: string[] = ['E11000'];

@Controller('jogadores')
export class JogadoresController {
  private logger = new Logger(JogadoresController.name);
  constructor(private readonly jogadoresService: JogadoresService) {}

  @EventPattern('criar-jogador')
  async criarJogador(@Payload() jogador: Jogador, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      this.logger.log(`jogador: ${JSON.stringify(jogador)}`);
      await this.jogadoresService.criarJogador(jogador);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }

  @MessagePattern('consultar-jogadores')
  async consultarJogadores(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      if (_id) return await this.jogadoresService.consultarJogadorPeloId(_id);
      else return await this.jogadoresService.consultarTodosJogadores();
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('atualizar-jogador')
  async atualizarJogador(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      this.logger.log(`data: ${JSON.stringify(data)}`);
      const _id: string = data.id;
      const jogador: Jogador = data.jogador;
      await this.jogadoresService.atualizarJogador(_id, jogador);
      await channel.ack(originalMessage);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }

  @EventPattern('deletar-jogador')
  async deletarJogador(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      await this.jogadoresService.deletarJogador(_id);
      await channel.ack(originalMessage);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }
}
