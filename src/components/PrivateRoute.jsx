import React from 'react';
import { Navigate } from 'react-router-dom';

// Permissões necessárias para entrar na página
function PrivateRoute({ children, allowedRoles }) {
  const userRole = localStorage.getItem('userRole');

  // Se não estiver logado, manda para o Login
  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    alert("Acesso negado! Apenas professores podem acessar esta área.");
    return <Navigate to="/" />; // Manda de volta para a Home
  }

  // Se passou em todos os testes, deixa entrar
  return children;
}

export default PrivateRoute;