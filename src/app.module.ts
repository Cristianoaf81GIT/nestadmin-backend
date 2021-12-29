import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigurations } from './config/mongoose.config';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigurations,
    }),
    CategoriasModule,
    JogadoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
