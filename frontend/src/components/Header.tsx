import { useState } from 'react';
import type { IUsuarioLogado } from '../interfaces/IUsuarioLogado';

export type Tela = 'posts' | 'usuarios';

interface HeaderProps {
  tela: Tela;
  onMudarTela: (tela: Tela) => void;
  usuarioLogado: IUsuarioLogado;
  onLogout: () => void;
}

function Header({ tela, onMudarTela, usuarioLogado, onLogout }: HeaderProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  const isAdmin = usuarioLogado.perfil === 'Administrador';
  const isAluno = usuarioLogado.perfil === 'Aluno';

  const irPara = (novaTela: Tela) => {
    onMudarTela(novaTela);
    setMenuAberto(false);
  };

  const sair = () => {
    setMenuAberto(false);
    onLogout();
  };

  return (
    <header className="header">
      <div className="header-titulo">
        <img src="/favicon.svg" alt="" className="header-logo" />
        <h1>Blog Pós FIAP</h1>
        {!isAluno && (
          <nav className="header-nav">
            <button className={tela === 'posts' ? 'aba-ativa' : ''} onClick={() => onMudarTela('posts')}>
              Posts
            </button>
            {isAdmin && (
              <button className={tela === 'usuarios' ? 'aba-ativa' : ''} onClick={() => onMudarTela('usuarios')}>
                Usuários
              </button>
            )}
          </nav>
        )}
      </div>

      <div className="header-acoes">
        <span className="usuario-logado">
          {usuarioLogado.nome} ({usuarioLogado.perfil})
        </span>
        <button className="btn-logout" onClick={onLogout}>
          Sair
        </button>
      </div>

      <button
        type="button"
        className="btn-menu-mobile"
        onClick={() => setMenuAberto((aberto) => !aberto)}
        aria-label="Abrir menu"
        aria-expanded={menuAberto}
      >
        ☰
      </button>

      {menuAberto && (
        <div className="menu-mobile">
          <div className="menu-mobile-usuario">
            {usuarioLogado.nome} ({usuarioLogado.perfil})
          </div>
          {!isAluno && (
            <button className={tela === 'posts' ? 'aba-ativa' : ''} onClick={() => irPara('posts')}>
              Posts
            </button>
          )}
          {isAdmin && (
            <button className={tela === 'usuarios' ? 'aba-ativa' : ''} onClick={() => irPara('usuarios')}>
              Usuários
            </button>
          )}
          <button onClick={sair}>Sair</button>
        </div>
      )}
    </header>
  );
}

export default Header;
