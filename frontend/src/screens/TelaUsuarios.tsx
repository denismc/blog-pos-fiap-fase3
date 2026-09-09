import { useState, useEffect } from 'react';
import api from '../services/api';
import TabelaUsuarios from '../components/TabelaUsuarios';
import Modal from '../components/Modal';
import FormUsuario from '../components/FormUsuario';
import type { CriarUsuarioForm, AtualizarUsuarioForm } from '../schemas/usuarioSchema';
import type { IUsuario } from '../interfaces/IUsuario';
import type { IAxiosError } from '../interfaces/IAxiosError';
import { useAuth } from '../contexts/AuthContext';

function TelaUsuarios() {
  const { usuarioLogado } = useAuth();
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<IUsuario | null>(null);

  const isAdmin = usuarioLogado?.perfil === 'Administrador';

  const carregarUsuarios = async () => {
    const res = await api.get<IUsuario[]>('/usuarios');
    setUsuarios(res.data);
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const abrirModalNovo = () => {
    setUsuarioEditando(null);
    setModalAberto(true);
  };

  const abrirModalEditar = async (id: string) => {
    const res = await api.get<IUsuario>(`/usuarios/${id}`);
    setUsuarioEditando(res.data);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setUsuarioEditando(null);
  };

  const salvarUsuario = async (dados: CriarUsuarioForm | AtualizarUsuarioForm) => {
    try {
      const payload = { ...dados };
      if (!payload.senha) delete payload.senha;

      if (usuarioEditando) {
        await api.put(`/usuarios/${usuarioEditando._id}`, payload);
      } else {
        await api.post('/usuarios', payload);
      }
      fecharModal();
      carregarUsuarios();
    } catch (err) {
      const mensagem = (err as IAxiosError).response?.data?.erro ?? 'Erro ao salvar usuário';
      alert(mensagem);
    }
  };

  const excluirUsuario = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      await api.delete(`/usuarios/${id}`);
      carregarUsuarios();
    } catch (err) {
      const mensagem = (err as IAxiosError).response?.data?.erro ?? 'Erro ao excluir usuário';
      alert(mensagem);
    }
  };

  return (
    <div>
      <div className="tela-toolbar">
        {isAdmin && (
          <button className="btn-novo" onClick={abrirModalNovo}>
            + Novo Usuário
          </button>
        )}
      </div>

      <TabelaUsuarios usuarios={usuarios} onEditar={abrirModalEditar} onExcluir={excluirUsuario} />

      {modalAberto && (
        <Modal titulo={usuarioEditando ? 'Editar Usuário' : 'Novo Usuário'} onFechar={fecharModal}>
          <FormUsuario usuarioInicial={usuarioEditando} onSalvar={salvarUsuario} onCancelar={fecharModal} />
        </Modal>
      )}
    </div>
  );
}

export default TelaUsuarios;
