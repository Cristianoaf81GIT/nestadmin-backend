import * as mongoose from 'mongoose';

export const JogadorSchema = new mongoose.Schema(
  {
    telefoneCelular: { type: String },
    email: { type: String, unique: true },
    nome: String,
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
    ranking: String,
    posicaoRanking: Number,
    urlFotoJogador: String,
  },
  { timestamps: true, collection: 'jogadores' },
);
