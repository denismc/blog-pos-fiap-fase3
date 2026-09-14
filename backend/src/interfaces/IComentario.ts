import { Types } from 'mongoose';

export interface IComentario {
  _id: string | Types.ObjectId;
  conteudo: string;
  // Sem populate: string/ObjectId. Com .populate('autor', 'nome'): objeto { _id, nome }.
  autor: string | Types.ObjectId | { _id: string | Types.ObjectId; nome: string };
  post: string | Types.ObjectId;
  createdAt: string | Date;
  updatedAt: string | Date;
}
