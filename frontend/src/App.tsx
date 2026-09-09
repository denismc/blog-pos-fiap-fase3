import { useState, useEffect } from 'react';
import Header, { type Tela } from './components/Header';
import TelaPosts from './screens/TelaPosts';
import TelaPostsAluno from './screens/TelaPostsAluno';
import TelaUsuarios from './screens/TelaUsuarios';
import Login from './components/Login';
import './App.css';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [tela, setTela] = useState<Tela>('posts');
  const { usuarioLogado } = useAuth();

  useEffect(() => {
    if (!usuarioLogado) setTela('posts');
  }, [usuarioLogado]);

  if (!usuarioLogado) {
    return <Login />;
  }

  const isAluno = usuarioLogado.perfil === 'Aluno';

  return (
    <div className="container">
      <Header tela={tela} onMudarTela={setTela} />
      {isAluno ? <TelaPostsAluno /> : tela === 'posts' ? <TelaPosts /> : <TelaUsuarios />}
    </div>
  );
}

export default App;
