import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

// process.cwd() sempre é /app, mas só existe 'src/' em dev (tsx roda direto do
// TypeScript) e só existe 'dist/' em produção (o Dockerfile copia apenas o
// build compilado). Resolver o glob a partir da localização deste próprio
// arquivo garante que 'routes' seja encontrado nos dois cenários, já que o
// tsc preserva os comentários @swagger no JS compilado.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// glob (usado internamente pelo swagger-jsdoc) trata '\' como caractere de
// escape — no Windows, path.join produz separadores '\', o que quebra o
// padrão silenciosamente (zero arquivos encontrados). Normaliza para '/'.
const toGlob = (p: string): string => p.split(path.sep).join('/');

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog Pós FIAP — API',
      version: '1.0.0',
      description: 'Documentação da API do Blog Pós FIAP: usuários, autenticação e posts',
    },
    servers: [
      {
        url: '/api',
        description: 'API Base',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
            nome: { type: 'string', example: 'João Silva' },
            email: { type: 'string', example: 'joao@email.com' },
            perfil: {
              type: 'string',
              enum: ['Administrador', 'Professor', 'Aluno'],
            },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
            titulo: { type: 'string', example: 'Introdução ao Node.js' },
            conteudo: { type: 'string', example: 'Node.js é um runtime JavaScript...' },
            autor: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
                nome: { type: 'string', example: 'João Silva' },
              },
            },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          },
        },
        Comentario: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
            conteudo: { type: 'string', example: 'Ótimo post, muito esclarecedor!' },
            autor: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
                nome: { type: 'string', example: 'João Silva' },
              },
            },
            post: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          },
        },
        ErroValidacao: {
          type: 'object',
          properties: {
            erro: { type: 'string', example: 'Dados inválidos' },
            detalhes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  campo: { type: 'string', example: 'email' },
                  mensagem: { type: 'string', example: 'Email inválido' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [toGlob(path.join(__dirname, '../routes/*.ts')), toGlob(path.join(__dirname, '../routes/*.js'))],
};

export const swaggerSpec = swaggerJsdoc(options);