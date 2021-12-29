import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresController } from './jogadores.controller';
import { JogadoresService } from './jogadores.service';
import { JogadorSchema } from '../interfaces/jogadores/jogador.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Jogador',
        useFactory: () => JogadorSchema,
      },
    ]),
  ],
  controllers: [JogadoresController],
  providers: [JogadoresService],
})
export class JogadoresModule {}
