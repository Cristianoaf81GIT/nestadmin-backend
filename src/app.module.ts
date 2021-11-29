import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseConfigurations } from './config/mongoose.config';
import { CategoriaSchema } from './interfaces/categorias/categoria.schema';
import { JogadorSchema } from './interfaces/jogadores/jogador.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigurations,
    }),
    MongooseModule.forFeatureAsync([
      { name: 'Categoria', useFactory: () => CategoriaSchema },
      { name: 'Jogador', useFactory: () => JogadorSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
