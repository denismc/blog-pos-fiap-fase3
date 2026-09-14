import type { IPost } from '../interfaces/IPost';
import Comentarios from './Comentarios';

interface PostDetalheProps {
  post: IPost;
}

function PostDetalhe({ post }: PostDetalheProps) {
  const foiAtualizado = post.updatedAt !== post.createdAt;

  return (
    <div className="post-detalhe">
      <div className="post-detalhe-meta">
        <p>Por {post.autor.nome}</p>
        <p>Publicado em {new Date(post.createdAt).toLocaleDateString('pt-BR')}</p>
        {foiAtualizado && <p>Atualizado em {new Date(post.updatedAt).toLocaleDateString('pt-BR')}</p>}
      </div>
      <p className="post-detalhe-conteudo">{post.conteudo}</p>
      <Comentarios postId={post._id} />
    </div>
  );
}

export default PostDetalhe;