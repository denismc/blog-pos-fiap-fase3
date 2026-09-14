import { ComentarioController } from '../controllers/comentarioController.js';
import { IComentarioRepository } from '../repositories/IComentarioRepository.js';
import { IPostRepository } from '../repositories/IPostRepository.js';
import { Request, Response } from 'express';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockRepository: jest.Mocked<IComentarioRepository> = {
  findByPost: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

const mockPostRepository: jest.Mocked<IPostRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  search: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res) as unknown as Response['status'];
  res.json = jest.fn().mockReturnValue(res) as unknown as Response['json'];
  return res;
};

describe('ComentarioController', () => {
  let controller: ComentarioController;

  beforeEach(() => {
    controller = new ComentarioController(mockRepository, mockPostRepository);
    jest.clearAllMocks();
  });

  describe('criarComentario', () => {
    it('deve retornar 404 quando o post não existe', async () => {
      mockPostRepository.findById.mockResolvedValue(null);

      const req = {
        body: { conteudo: 'Ótimo post!', post: '999' },
        usuario: { id: '2', perfil: 'Aluno' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.criarComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Post não encontrado' });
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('deve usar o id do usuário logado como autor e retornar 201', async () => {
      const post = { _id: '1', titulo: 'A', conteudo: 'B', autor: '3', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
      const comentarioCriado = {
        _id: '10',
        conteudo: 'Ótimo post!',
        autor: '2',
        post: '1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };
      mockPostRepository.findById.mockResolvedValue(post);
      mockRepository.create.mockResolvedValue(comentarioCriado);

      const req = {
        body: { conteudo: 'Ótimo post!', post: '1' },
        usuario: { id: '2', perfil: 'Aluno' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.criarComentario(req, res);

      expect(mockRepository.create).toHaveBeenCalledWith({
        conteudo: 'Ótimo post!',
        post: '1',
        autor: '2',
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('deve retornar 400 quando ocorrer erro', async () => {
      const post = { _id: '1', titulo: 'A', conteudo: 'B', autor: '3', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
      mockPostRepository.findById.mockResolvedValue(post);
      mockRepository.create.mockRejectedValue(new Error('Erro ao salvar'));

      const req = {
        body: { conteudo: 'Ótimo post!', post: '1' },
        usuario: { id: '2', perfil: 'Aluno' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.criarComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Erro ao salvar' });
    });
  });

  describe('listarComentarios', () => {
    it('deve repassar o id do post ao repositório e retornar 200', async () => {
      const comentarios = [
        { _id: '10', conteudo: 'Ótimo post!', autor: '2', post: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];
      mockRepository.findByPost.mockResolvedValue(comentarios);

      const req = { query: { post: '1' } } as unknown as Request;
      const res = mockResponse();

      await controller.listarComentarios(req, res);

      expect(mockRepository.findByPost).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(comentarios);
    });

    it('deve buscar com id vazio quando "post" não é informado', async () => {
      mockRepository.findByPost.mockResolvedValue([]);

      const req = { query: {} } as unknown as Request;
      const res = mockResponse();

      await controller.listarComentarios(req, res);

      expect(mockRepository.findByPost).toHaveBeenCalledWith('');
    });

    it('deve retornar 500 quando ocorrer erro', async () => {
      mockRepository.findByPost.mockRejectedValue(new Error('Erro no banco'));

      const req = { query: { post: '1' } } as unknown as Request;
      const res = mockResponse();

      await controller.listarComentarios(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Erro no banco' });
    });
  });

  describe('deletarComentario', () => {
    it('deve retornar 404 quando comentário não encontrado', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const req = {
        params: { id: '999' },
        usuario: { id: '2', perfil: 'Aluno' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.deletarComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Comentário não encontrado' });
    });

    it('deve retornar 403 quando não é o autor nem administrador', async () => {
      const comentario = { _id: '10', conteudo: 'X', autor: '2', post: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
      mockRepository.findById.mockResolvedValue(comentario);

      const req = {
        params: { id: '10' },
        usuario: { id: '3', perfil: 'Aluno' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.deletarComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Você só pode excluir seus próprios comentários' });
    });

    it('deve retornar 403 mesmo quando o autor vem populado ({ _id, nome })', async () => {
      const comentario = {
        _id: '10',
        conteudo: 'X',
        autor: { _id: '2', nome: 'Outro Aluno' },
        post: '1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };
      mockRepository.findById.mockResolvedValue(comentario);

      const req = {
        params: { id: '10' },
        usuario: { id: '3', perfil: 'Aluno' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.deletarComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('deve permitir que o próprio autor exclua e retornar 200', async () => {
      const comentario = { _id: '10', conteudo: 'X', autor: '2', post: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
      mockRepository.findById.mockResolvedValue(comentario);
      mockRepository.delete.mockResolvedValue(comentario);

      const req = {
        params: { id: '10' },
        usuario: { id: '2', perfil: 'Aluno' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.deletarComentario(req, res);

      expect(mockRepository.delete).toHaveBeenCalledWith('10');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Comentário deletado com sucesso' });
    });

    it('deve permitir que o administrador exclua comentário de outro autor', async () => {
      const comentario = { _id: '10', conteudo: 'X', autor: '2', post: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
      mockRepository.findById.mockResolvedValue(comentario);
      mockRepository.delete.mockResolvedValue(comentario);

      const req = {
        params: { id: '10' },
        usuario: { id: '1', perfil: 'Administrador' },
      } as unknown as Request;
      const res = mockResponse();

      await controller.deletarComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
