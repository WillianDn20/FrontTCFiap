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

        {/* Rotas de Leitura (Alunos e Professores) */}
        <Route 
          path="/" 
          element={
            <PrivateRoute allowedRoles={['student', 'teacher', 'aluno', 'professor']}>
              <Home />
            </PrivateRoute>
          } 
        />
        
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
        
        <Route 
          path="/post/new" 
          element={
            <PrivateRoute allowedRoles={['teacher', 'professor']}>
              <PostForm />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/post/edit/:id" 
          element={
            <PrivateRoute allowedRoles={['teacher', 'professor']}>
              <PostForm />
            </PrivateRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;