export interface IComentarioAutor {
  _id: string;
  nome: string;
}

export interface IComentario {
  _id: string;
  conteudo: string;
  autor: IComentarioAutor;
  post: string;
  createdAt: string;
  updatedAt: string;
}
