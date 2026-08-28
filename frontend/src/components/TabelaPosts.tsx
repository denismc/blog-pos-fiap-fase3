import type { IPost } from '../interfaces/IPost';
import type { IUsuarioLogado } from '../interfaces/IUsuarioLogado';

const TAMANHO_RESUMO = 100;

function resumirConteudo(conteudo: string) {
  return conteudo.length > TAMANHO_RESUMO
    ? `${conteudo.slice(0, TAMANHO_RESUMO)}…`
    : conteudo;
}

interface TabelaPostsProps {
  posts: IPost[];
  usuarioLogado: IUsuarioLogado;
  termoBusca: string;
  onTermoBuscaChange: (valor: string) => void;
  onBuscar: (e: React.FormEvent) => void;
  onAbrirDetalhe: (post: IPost) => void;
  onEditar: (post: IPost) => void;
  onExcluir: (id: string) => void;
  podeCriar: boolean;
  onNovo: () => void;
}

function TabelaPosts({
  posts,
  usuarioLogado,
  termoBusca,
  onTermoBuscaChange,
  onBuscar,
  onAbrirDetalhe,
  onEditar,
  onExcluir,
  podeCriar,
  onNovo,
}: TabelaPostsProps) {
  const podeGerenciar = (post: IPost) =>
    usuarioLogado.perfil === 'Administrador' ||
    (usuarioLogado.perfil === 'Professor' && post.autor._id === usuarioLogado.id);

  return (
    <div>
      <form className="busca-posts" onSubmit={onBuscar}>
        <input
          type="text"
          placeholder="Buscar por título ou conteúdo..."
          value={termoBusca}
          onChange={(e) => onTermoBuscaChange(e.target.value)}
        />
        <button type="submit">Buscar</button>
        {podeCriar && (
          <button type="button" className="btn-novo" onClick={onNovo}>
            + Novo Post
          </button>
        )}
      </form>
      <table className="tabela tabela-posts">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Descrição</th>
            <th>Publicado em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr>
              <td colSpan={5}>Nenhum post encontrado</td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr key={post._id}>
                <td className="post-titulo" onClick={() => onAbrirDetalhe(post)} title={post.titulo}>
                  {post.titulo}
                </td>
                <td>{post.autor.nome}</td>
                <td className="post-resumo-tabela">{resumirConteudo(post.conteudo)}</td>
                <td>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>
                  {podeGerenciar(post) && (
                    <>
                      <button className="btn-editar" onClick={() => onEditar(post)}>
                        Editar
                      </button>
                      <button className="btn-excluir" onClick={() => onExcluir(post._id)}>
                        Excluir
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaPosts;
