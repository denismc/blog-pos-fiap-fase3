import { IComentario } from '../interfaces/IComentario.js';
import { ICriarComentario } from '../interfaces/ICriarComentario.js';

export interface IComentarioRepository {
  findByPost(postId: string): Promise<IComentario[]>;
  findById(id: string): Promise<IComentario | null>;
  create(dados: ICriarComentario): Promise<IComentario>;
  delete(id: string): Promise<IComentario | null>;
}
