import { Request, Response } from 'express';
import { IComentarioRepository } from '../repositories/IComentarioRepository.js';
import { IPostRepository } from '../repositories/IPostRepository.js';
import { IComentario } from '../interfaces/IComentario.js';

export class ComentarioController {
  constructor(
    private repository: IComentarioRepository,
    private postRepository: IPostRepository
  ) {}

  private obterIdAutor(autor: IComentario['autor']): string {
    if (typeof autor === 'object' && '_id' in autor) return String(autor._id);
    return String(autor);
  }

  async criarComentario(req: Request, res: Response): Promise<void> {
    try {
      const { conteudo, post } = req.body;
      const autor = req.usuario?.id as string;

      const postExiste = await this.postRepository.findById(post);
      if (!postExiste) {
        res.status(404).json({ erro: 'Post não encontrado' });
        return;
      }

      const comentario = await this.repository.create({ conteudo, post, autor });
      res.status(201).json(comentario);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      res.status(400).json({ erro: message });
    }
  }

  async listarComentarios(req: Request, res: Response): Promise<void> {
    try {
      const postId = typeof req.query.post === 'string' ? req.query.post : '';
      const comentarios = await this.repository.findByPost(postId);
      res.status(200).json(comentarios);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      res.status(500).json({ erro: message });
    }
  }

  async deletarComentario(req: Request, res: Response): Promise<void> {
    try {
      const comentario = await this.repository.findById(req.params.id as string);
      if (!comentario) {
        res.status(404).json({ erro: 'Comentário não encontrado' });
        return;
      }

      const ehAdministrador = req.usuario?.perfil === 'Administrador';
      const ehAutor = req.usuario?.id === this.obterIdAutor(comentario.autor);
      if (!ehAdministrador && !ehAutor) {
        res.status(403).json({ erro: 'Você só pode excluir seus próprios comentários' });
        return;
      }

      await this.repository.delete(req.params.id as string);
      res.status(200).json({ mensagem: 'Comentário deletado com sucesso' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      res.status(500).json({ erro: message });
    }
  }
}
