import React from 'react';
import { Navigate } from 'react-router-dom';

// Agora o segurança recebe as permissões necessárias para entrar na página
function PrivateRoute({ children, allowedRoles }) {
  const userRole = localStorage.getItem('userRole');

  // 1. Se não estiver logado de jeito nenhum, manda para o Login
  if (!userRole) {
    return <Navigate to="/login" />;
  }

  // 2. Se a página exige um cargo específico (ex: professor) e o usuário não tem, barra ele
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    alert("Acesso negado! Apenas professores podem acessar esta área.");
    return <Navigate to="/" />; // Manda de volta para a Home
  }

  // 3. Se passou em todos os testes, deixa entrar
  return children;
}

export default PrivateRoute;