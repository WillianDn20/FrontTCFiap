import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #2c3e50;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Logo = styled(Link)`
  color: white;
  font-size: 1.5em;
  font-weight: bold;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: #ecf0f1;
  text-decoration: none;
  font-size: 1em;
  transition: color 0.2s;

  &:hover {
    color: #3498db;
  }
`;

const WelcomeText = styled.span`
  color: #bdc3c7;
  font-size: 0.9em;
`;

const LogoutButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;

function Header() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <Nav>
      <Logo to="/">Fase 3 Blog</Logo>
      
      <NavLinks>
        {userRole && (
          <>
            <WelcomeText>Olá, {userName}</WelcomeText>
            <StyledLink to="/">Lista de Posts</StyledLink>
            
            {userRole === 'professor' && (
              <StyledLink to="/admin">Painel Admin</StyledLink>
            )}
            
            <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
          </>
        )}
      </NavLinks>
    </Nav>
  );
}

export default Header;