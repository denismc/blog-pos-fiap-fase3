import { createContext, useContext, useState, type ReactNode } from 'react';
import type { IUsuarioLogado } from '../interfaces/IUsuarioLogado';

interface AuthContextValue {
  usuarioLogado: IUsuarioLogado | null;
  login: (usuario: IUsuarioLogado) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarioLogado, setUsuarioLogado] = useState<IUsuarioLogado | null>(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    return usuarioSalvo ? (JSON.parse(usuarioSalvo) as IUsuarioLogado) : null;
  });

  const login = (usuario: IUsuarioLogado) => {
    setUsuarioLogado(usuario);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuarioLogado(null);
  };

  return <AuthContext.Provider value={{ usuarioLogado, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
  }
  return contexto;
}
