import type { IUsuario } from '../interfaces/IUsuario';
import type { IUsuarioLogado } from '../interfaces/IUsuarioLogado';
import { IconeEditar, IconeExcluir } from './Icones';

interface TabelaUsuariosProps {
  usuarios: IUsuario[];
  usuarioLogado: IUsuarioLogado;
  onEditar: (id: string) => void;
  onExcluir: (id: string) => void;
}

function TabelaUsuarios({ usuarios, usuarioLogado, onEditar, onExcluir }: TabelaUsuariosProps) {
  const isAdmin = usuarioLogado.perfil === 'Administrador';

  return (
    <div className="tabela-wrapper">
      <table className="tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Perfil</th>
            <th>Criado em</th>
            {isAdmin && (
              <th>
                <span className="sr-only">Ações</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 5 : 4}>Nenhum usuário cadastrado</td>
            </tr>
          ) : (
            usuarios.map((usuario) => (
              <tr key={usuario._id}>
                <td data-label="Nome">{usuario.nome}</td>
                <td data-label="Email">{usuario.email}</td>
                <td data-label="Perfil">{usuario.perfil}</td>
                <td data-label="Criado em">{new Date(usuario.createdAt).toLocaleDateString('pt-BR')}</td>
                {isAdmin && (
                  <td data-label="Ações">
                    <button className="btn-editar" title="Editar" aria-label="Editar usuário" onClick={() => onEditar(usuario._id)}>
                      <IconeEditar />
                    </button>
                    {usuario._id !== usuarioLogado.id && (
                      <button className="btn-excluir" title="Excluir" aria-label="Excluir usuário" onClick={() => onExcluir(usuario._id)}>
                        <IconeExcluir />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaUsuarios;