import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Post from './pages/Post';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import PostForm from './pages/PostForm';
import Calendar from './pages/Calendar'; 
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registrar" element={<Register />} />

        <Route path="/" element={<PrivateRoute allowedRoles={['student', 'teacher', 'aluno', 'professor']}><Home /></PrivateRoute>} />
        
        {/* Nova Rota do Calendário (Liberada para Alunos e Professores) */}
        <Route path="/calendario" element={<PrivateRoute allowedRoles={['student', 'teacher', 'aluno', 'professor']}><Calendar /></PrivateRoute>} />
        
        <Route path="/post/new" element={<PrivateRoute allowedRoles={['teacher', 'professor']}><PostForm /></PrivateRoute>} />
        <Route path="/post/novo" element={<PrivateRoute allowedRoles={['teacher', 'professor']}><PostForm /></PrivateRoute>} />
        
        <Route path="/post/:id" element={<PrivateRoute allowedRoles={['student', 'teacher', 'aluno', 'professor']}><Post /></PrivateRoute>} />

        <Route path="/admin" element={<PrivateRoute allowedRoles={['teacher', 'professor']}><Admin /></PrivateRoute>} />
        
        <Route path="/post/edit/:id" element={<PrivateRoute allowedRoles={['teacher', 'professor']}><PostForm /></PrivateRoute>} />
        <Route path="/post/editar/:id" element={<PrivateRoute allowedRoles={['teacher', 'professor']}><PostForm /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;