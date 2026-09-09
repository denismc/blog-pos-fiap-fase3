import { useState, useEffect } from 'react';
import api from '../services/api';
import TabelaPosts from '../components/TabelaPosts';
import Modal from '../components/Modal';
import FormPost from '../components/FormPost';
import PostDetalhe from '../components/PostDetalhe';
import type { CriarPostForm, AtualizarPostForm } from '../schemas/postSchema';
import type { IPost } from '../interfaces/IPost';
import type { IAxiosError } from '../interfaces/IAxiosError';
import { useAuth } from '../contexts/AuthContext';

function TelaPosts() {
  const { usuarioLogado } = useAuth();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [modal, setModal] = useState<'detalhe' | 'form' | null>(null);
  const [postSelecionado, setPostSelecionado] = useState<IPost | null>(null);

  const podeCriar = usuarioLogado?.perfil === 'Administrador' || usuarioLogado?.perfil === 'Professor';

  const carregarPosts = async (termo?: string) => {
    const url = termo ? `/posts/search?q=${encodeURIComponent(termo)}` : '/posts';
    const res = await api.get<IPost[]>(url);
    setPosts(res.data);
  };

  useEffect(() => {
    carregarPosts();
  }, []);

  const abrirNovo = () => {
    setPostSelecionado(null);
    setModal('form');
  };

  const abrirDetalhe = (post: IPost) => {
    setPostSelecionado(post);
    setModal('detalhe');
  };

  const abrirEdicao = (post: IPost) => {
    setPostSelecionado(post);
    setModal('form');
  };

  const fecharModal = () => {
    setModal(null);
    setPostSelecionado(null);
  };

  const salvarPost = async (dados: CriarPostForm | AtualizarPostForm) => {
    try {
      if (postSelecionado) {
        await api.put(`/posts/${postSelecionado._id}`, dados);
      } else {
        await api.post('/posts', dados);
      }
      fecharModal();
      carregarPosts(termoBusca || undefined);
    } catch (err) {
      const mensagem = (err as IAxiosError).response?.data?.erro ?? 'Erro ao salvar post';
      alert(mensagem);
    }
  };

  const excluirPost = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      fecharModal();
      carregarPosts(termoBusca || undefined);
    } catch (err) {
      const mensagem = (err as IAxiosError).response?.data?.erro ?? 'Erro ao excluir post';
      alert(mensagem);
    }
  };

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    carregarPosts(termoBusca || undefined);
  };

  return (
    <div>
      <TabelaPosts
        posts={posts}
        termoBusca={termoBusca}
        onTermoBuscaChange={setTermoBusca}
        onBuscar={handleBuscar}
        onAbrirDetalhe={abrirDetalhe}
        onEditar={abrirEdicao}
        onExcluir={excluirPost}
        podeCriar={podeCriar}
        onNovo={abrirNovo}
      />

      {modal === 'detalhe' && postSelecionado && (
        <Modal titulo={postSelecionado.titulo} onFechar={fecharModal} grande>
          <PostDetalhe post={postSelecionado} />
        </Modal>
      )}

      {modal === 'form' && (
        <Modal titulo={postSelecionado ? 'Editar Post' : 'Novo Post'} onFechar={fecharModal} grande>
          <FormPost postInicial={postSelecionado} onSalvar={salvarPost} onCancelar={fecharModal} />
        </Modal>
      )}
    </div>
  );
}

export default TelaPosts;
