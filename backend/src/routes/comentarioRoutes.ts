import express from 'express';
import { ComentarioRepository } from '../repositories/ComentarioRepository.js';
import { PostRepository } from '../repositories/PostRepository.js';
import { ComentarioController } from '../controllers/comentarioController.js';
import { validarSchema } from '../middlewares/validarSchema.js';
import { criarComentarioSchema } from '../schemas/comentarioSchema.js';

const router = express.Router();
const repository = new ComentarioRepository();
const postRepository = new PostRepository();
const controller = new ComentarioController(repository, postRepository);

/**
 * @swagger
 * /comentarios:
 *   post:
 *     summary: Criar comentário em um post (qualquer usuário autenticado)
 *     tags: [Comentarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conteudo
 *               - post
 *             properties:
 *               conteudo:
 *                 type: string
 *                 example: Ótimo post, muito esclarecedor!
 *               post:
 *                 type: string
 *                 example: 64a1b2c3d4e5f6a7b8c9d0e1
 *     responses:
 *       201:
 *         description: Comentário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comentario'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Post não encontrado
 */
router.post('/', validarSchema(criarComentarioSchema), (req, res) => controller.criarComentario(req, res));

/**
 * @swagger
 * /comentarios:
 *   get:
 *     summary: Listar comentários de um post
 *     tags: [Comentarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: post
 *         required: true
 *         schema:
 *           type: string
 *         example: 64a1b2c3d4e5f6a7b8c9d0e1
 *     responses:
 *       200:
 *         description: Lista de comentários do post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comentario'
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get('/', (req, res) => controller.listarComentarios(req, res));

/**
 * @swagger
 * /comentarios/{id}:
 *   delete:
 *     summary: Deletar comentário (somente o autor ou Administrador)
 *     tags: [Comentarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64a1b2c3d4e5f6a7b8c9d0e1
 *     responses:
 *       200:
 *         description: Comentário deletado com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Comentário não encontrado
 */
router.delete('/:id', (req, res) => controller.deletarComentario(req, res));

export default router;
