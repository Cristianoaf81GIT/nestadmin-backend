import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from '../interfaces/categorias/categoria.schema';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Categoria',
        useFactory: () => CategoriaSchema,
      },
    ]),
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
