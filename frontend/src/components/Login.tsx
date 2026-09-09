import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { IAxiosError } from '../interfaces/IAxiosError';

function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      login(res.data.usuario);
    } catch (err) {
      setErro((err as IAxiosError).response?.data?.erro || 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/logo-blog-fiap-1024.jpg" alt="Blog Pós FIAP" className="login-logo" />
        <h1>Blog Pós FIAP</h1><br></br>
        {erro && <div className="erro-msg">{erro}</div>}
        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="campo">
            <label>Senha</label>
            <input type="password" name="senha" value={form.senha} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-login" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
