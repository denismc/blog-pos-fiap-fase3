import type { IPost } from '../interfaces/IPost';
import type { IUsuarioLogado } from '../interfaces/IUsuarioLogado';
import { IconeEditar, IconeExcluir } from './Icones';

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
      <div className="tabela-wrapper">
        <table className="tabela tabela-posts">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Descrição</th>
              <th>Publicado em</th>
              <th><span className="sr-only">Ações</span></th>
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
                  <td className="post-titulo" data-label="Título" onClick={() => onAbrirDetalhe(post)} title={post.titulo}>
                    {post.titulo}
                  </td>
                  <td data-label="Autor">{post.autor.nome}</td>
                  <td className="post-resumo-tabela" data-label="Descrição">{resumirConteudo(post.conteudo)}</td>
                  <td data-label="Publicado em">{new Date(post.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td data-label="Ações">
                    {podeGerenciar(post) && (
                      <>
                        <button className="btn-editar" title="Editar" aria-label="Editar post" onClick={() => onEditar(post)}>
                          <IconeEditar />
                        </button>
                        <button className="btn-excluir" title="Excluir" aria-label="Excluir post" onClick={() => onExcluir(post._id)}>
                          <IconeExcluir />
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
    </div>
  );
}

export default TabelaPosts;
