import { IComentarioRepository } from './IComentarioRepository.js';
import { IComentario } from '../interfaces/IComentario.js';
import { ICriarComentario } from '../interfaces/ICriarComentario.js';
import Comentario from '../models/comentarioModel.js';

export class ComentarioRepository implements IComentarioRepository {
  async findByPost(postId: string): Promise<IComentario[]> {
    return await Comentario.find({ post: postId }).populate('autor', 'nome').sort({ createdAt: 1 }).lean();
  }

  async findById(id: string): Promise<IComentario | null> {
    return await Comentario.findById(id).lean();
  }

  async create(dados: ICriarComentario): Promise<IComentario> {
    const comentario = new Comentario(dados);
    await comentario.save();
    return comentario.toObject();
  }

  async delete(id: string): Promise<IComentario | null> {
    return await Comentario.findByIdAndDelete(id).lean();
  }
}
