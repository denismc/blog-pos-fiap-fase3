import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const criarComentarioSchema = z.object({
  conteudo: z.string().min(1, 'Comentário não pode ser vazio').max(1000, 'Comentário deve ter no máximo 1000 caracteres'),
  post: z.string().regex(objectIdRegex, 'Id de post inválido'),
});
