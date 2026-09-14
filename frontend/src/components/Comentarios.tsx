import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { IComentario } from '../interfaces/IComentario';
import type { IAxiosError } from '../interfaces/IAxiosError';
import { IconeExcluir } from './Icones';

function formatarDataHora(data: string) {
  const dataObj = new Date(data);
  const dataFormatada = dataObj.toLocaleDateString('pt-BR');
  const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dataFormatada} às ${horaFormatada}`;
}

interface ComentariosProps {
  postId: string;
}

function Comentarios({ postId }: ComentariosProps) {
  const { usuarioLogado } = useAuth();
  const [comentarios, setComentarios] = useState<IComentario[]>([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);

  const carregarComentarios = async () => {
    const res = await api.get<IComentario[]>(`/comentarios?post=${postId}`);
    setComentarios(res.data);
  };

  useEffect(() => {
    carregarComentarios();
  }, [postId]);

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;

    setEnviando(true);
    try {
      await api.post('/comentarios', { conteudo: texto, post: postId });
      setTexto('');
      carregarComentarios();
    } catch (err) {
      const mensagem = (err as IAxiosError).response?.data?.erro ?? 'Erro ao enviar comentário';
      alert(mensagem);
    } finally {
      setEnviando(false);
    }
  };

  const podeExcluir = (comentario: IComentario) =>
    usuarioLogado?.perfil === 'Administrador' || comentario.autor._id === usuarioLogado?.id;

  const handleExcluir = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este comentário?')) return;
    try {
      await api.delete(`/comentarios/${id}`);
      carregarComentarios();
    } catch (err) {
      const mensagem = (err as IAxiosError).response?.data?.erro ?? 'Erro ao excluir comentário';
      alert(mensagem);
    }
  };

  return (
    <div className="comentarios">
      <h3 className="comentarios-titulo">Comentários ({comentarios.length})</h3>

      <form className="comentario-form" onSubmit={handleEnviar}>
        <textarea
          rows={2}
          placeholder="Escreva um comentário..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button type="submit" disabled={enviando || !texto.trim()}>
          {enviando ? 'Enviando...' : 'Comentar'}
        </button>
      </form>

      {comentarios.length === 0 ? (
        <p className="comentarios-vazio">Nenhum comentário ainda.</p>
      ) : (
        <ul className="comentarios-lista">
          {comentarios.map((comentario) => (
            <li key={comentario._id} className="comentario-item">
              <div className="comentario-cabecalho">
                <span className="comentario-autor">{comentario.autor.nome}</span>
                <span className="comentario-data">{formatarDataHora(comentario.createdAt)}</span>
                {podeExcluir(comentario) && (
                  <button
                    type="button"
                    className="comentario-excluir"
                    title="Excluir comentário"
                    aria-label="Excluir comentário"
                    onClick={() => handleExcluir(comentario._id)}
                  >
                    <IconeExcluir tamanho={14} />
                  </button>
                )}
              </div>
              <p className="comentario-conteudo">{comentario.conteudo}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Comentarios;
