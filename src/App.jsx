import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Post from './pages/Post';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import PostForm from './pages/PostForm';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registrar" element={<Register />} />

        {/* Rotas de Leitura (Alunos e Professores) */}
        <Route 
          path="/" 
          element={
            <PrivateRoute allowedRoles={['student', 'teacher', 'aluno', 'professor']}>
              <Home />
            </PrivateRoute>
          } 
        />
        
        {/* Rotas de Criação (Apenas Professores) */}
        <Route 
          path="/post/new" 
          element={
            <PrivateRoute allowedRoles={['teacher', 'professor']}>
              <PostForm />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/post/novo" 
          element={
            <PrivateRoute allowedRoles={['teacher', 'professor']}>
              <PostForm />
            </PrivateRoute>
          } 
        />
        
        {/* Rota de Leitura de um Post Específico */}
        <Route 
          path="/post/:id" 
          element={
            <PrivateRoute allowedRoles={['student', 'teacher', 'aluno', 'professor']}>
              <Post />
            </PrivateRoute>
          } 
        />

        {/* Rotas Administrativas (Apenas Professores) */}
        <Route 
          path="/admin" 
          element={
            <PrivateRoute allowedRoles={['teacher', 'professor']}>
              <Admin />
            </PrivateRoute>
          } 
        />
        
        {/* Rotas de Edição (Apenas Professores) */}
        <Route 
          path="/post/edit/:id" 
          element={
            <PrivateRoute allowedRoles={['teacher', 'professor']}>
              <PostForm />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/post/editar/:id" 
          element={
            <PrivateRoute allowedRoles={['teacher', 'professor']}>
              <PostForm />
            </PrivateRoute>
          } 
        />

        {/* Se a URL não existir, joga para o login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;