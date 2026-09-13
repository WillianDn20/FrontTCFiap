import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// ==========================================
// ESTILOS DO MENU SUPERIOR (APPLE LIQUID GLASS)
// ==========================================
const GlassNav = styled.nav`
  position: fixed;
  top: 20px;
  /* Centraliza no espaço restante da tela (tirando os 300px do menu lateral) */
  left: calc(50% + 150px); 
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  
  /* Efeito de Vidro (Glassmorphism) */
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  padding: 8px 12px;
  border-radius: 50px;
  z-index: 1000;
`;

const NavLink = styled(Link)`
  color: #2c3e50;
  text-decoration: none;
  font-size: 1.05em;
  font-weight: bold;
  padding: 12px 25px;
  border-radius: 30px;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    color: #3498db;
  }
`;

// ==========================================
// ESTILOS DO CARD LATERAL (PERFIL)
// ==========================================
const LeftSidebar = styled.aside`
  position: fixed;
  top: 100px;
  left: 20px;
  width: 260px;
  display: flex;
  flex-direction: column;
  gap: 20px; /* Espaço entre o card de perfil e futuros cards de avisos */
  z-index: 100;
`;

const UserCard = styled.div`
  background-color: white;
  padding: 30px 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
`;

const UserName = styled.h2`
  margin: 0 0 20px 0;
  font-size: 1.3em;
  text-align: center;
  color: #2c3e50;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f8f9fa;
  border: 2px solid #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  margin-bottom: 15px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
`;

const UserRoleBadge = styled.span`
  background-color: ${props => props.$isTeacher ? '#f39c12' : '#3498db'};
  color: white;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: bold;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const UserEmail = styled.span`
  font-size: 0.85em;
  color: #7f8c8d;
  margin-bottom: 25px;
  text-align: center;
  word-break: break-all;
`;

const LogoutButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1em;
  width: 100%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;

function Header() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail') || 'Email não carregado'; 

  // Ajusta os espaços globais do site para acomodar o card lateral e o menu de vidro
  useEffect(() => {
    if (userRole) {
      document.body.style.marginLeft = '300px'; // Abre espaço para a barra lateral esquerda
      document.body.style.paddingTop = '100px'; // Abre espaço para o menu flutuante no topo
      document.body.style.backgroundColor = '#f4f6f8';
    } else {
      document.body.style.marginLeft = '0';
      document.body.style.paddingTop = '0';
      document.body.style.backgroundColor = 'white';
    }
    
    return () => {
      document.body.style.marginLeft = '0';
      document.body.style.paddingTop = '0';
      document.body.style.backgroundColor = 'white';
    };
  }, [userRole]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!userRole) return null;

  const isTeacher = userRole === 'teacher' || userRole === 'professor';
  const roleText = isTeacher ? 'Professor(a)' : 'Aluno(a)';
  const AvatarIcon = isTeacher ? '👨‍🏫' : '👨‍🎓'; 

  return (
    <>
      {/* 1. Menu Flutuante Topo (Estilo Apple Glass) */}
      <GlassNav>
        <NavLink to="/">Lista de Posts</NavLink>
        {isTeacher && (
          <NavLink to="/admin">Painel Admin</NavLink>
        )}
      </GlassNav>

      {/* 2. Área Lateral Esquerda para Cards */}
      <LeftSidebar>
        
        {/* Card do Usuário */}
        <UserCard>
          <UserName>{userName}</UserName>
          <Avatar>{AvatarIcon}</Avatar>
          <UserRoleBadge $isTeacher={isTeacher}>{roleText}</UserRoleBadge>
          <UserEmail>{userEmail}</UserEmail>
          <LogoutButton onClick={handleLogout}>Sair da conta</LogoutButton>
        </UserCard>

        {/* FUTURO: Aqui embaixo você poderá adicionar os cards de Aviso tranquilamente! */}
        
      </LeftSidebar>
    </>
  );
}

export default Header;