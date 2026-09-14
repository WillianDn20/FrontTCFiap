import React, { useEffect, useState } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const GlassNav = styled.nav`
  position: fixed;
  top: 40px; 
  left: calc(50% + 150px); 
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 8px 12px;
  border-radius: 50px;
  z-index: 1000;
`;

const NavLink = styled(RouterNavLink)`
  color: #2c3e50;
  text-decoration: none;
  font-size: 1.05em;
  font-weight: bold;
  padding: 10px 22px; 
  border-radius: 30px;
  border: 2px solid transparent; 
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    color: #3498db;
  }

  &.active {
    color: #3498db;
    border: 2px solid #3498db;
    background-color: white;
  }
`;

const LeftSidebar = styled.aside`
  position: fixed;
  top: 40px; 
  left: 20px;
  width: 260px;
  bottom: 20px; 
  overflow-y: auto; 
  display: flex;
  flex-direction: column;
  gap: 20px; 
  z-index: 100;
  &::-webkit-scrollbar { width: 0px; }
`;

const GlassCard = styled.div`
  background-color: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px; 
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  font-family: Arial, sans-serif;
`;

const UserCard = styled(GlassCard)`
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NoticeCard = styled(GlassCard)`
  padding: 20px;
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
  &:hover { background-color: #c0392b; }
`;

const NoticeTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 1.1em;
  color: #2c3e50;
  text-align: center;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  padding-bottom: 10px;
`;

const NoticeItem = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 10px;
  border-left: 3px solid #f39c12;
  display: flex;
  flex-direction: column;
  gap: 6px; 
`;

const NoticeText = styled.p`
  margin: 0;
  font-size: 0.9em;
  color: #34495e;
  line-height: 1.4;
  word-break: break-word; 
`;

const NoticeDate = styled.small`
  font-size: 0.75em;
  color: #7f8c8d;
`;

const DeleteNoticeBtn = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 0.85em;
  font-weight: bold;
  cursor: pointer;
  align-self: flex-start;
  padding: 0;
  margin-top: 4px;
  &:hover { text-decoration: underline; }
`;

const NoticeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 15px;
`;

const NoticeInput = styled.textarea`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.85em;
  resize: vertical;
  min-height: 60px;
  box-sizing: border-box;
`;

const AddNoticeBtn = styled.button`
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.85em;
  &:hover { background-color: #2ecc71; }
`;

const formatarDataCurta = (dataString) => {
  if (!dataString) return '';
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

function Header() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Usuário';
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail') || 'Email não carregado'; 

  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState('');

  useEffect(() => {
    if (userRole) {
      document.body.style.marginLeft = '300px'; 
      document.body.style.paddingTop = '110px'; 
      document.body.style.backgroundColor = '#e8ecef';
      loadNotices(); 
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

  const loadNotices = async () => {
    try {
      const response = await api.get('/notices');
      setNotices(response.data);
    } catch (error) {
      console.error("Erro ao carregar avisos:", error);
    }
  };

  const handleAddNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.trim()) return;

    try {
      await api.post('/notices', { text: newNotice, author: userName });
      setNewNotice('');
      loadNotices(); 
    } catch (error) {
      console.error("Erro ao criar aviso:", error);
    }
  };

  const handleDeleteNotice = async (id) => {
    if(!window.confirm("Apagar este aviso?")) return;
    try {
      await api.delete(`/notices/${id}`);
      loadNotices();
    } catch (error) {
      console.error("Erro ao deletar aviso:", error);
    }
  };

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
      <GlassNav>
        <NavLink to="/" end>Lista de Posts</NavLink>
        {/* Nova aba adicionada para todos */}
        <NavLink to="/calendario">Calendário</NavLink>
        
        {isTeacher && <NavLink to="/admin">Painel Admin</NavLink>}
      </GlassNav>

      <LeftSidebar>
        <UserCard>
          <UserName>{userName}</UserName>
          <Avatar>{AvatarIcon}</Avatar>
          <UserRoleBadge $isTeacher={isTeacher}>{roleText}</UserRoleBadge>
          <UserEmail>{userEmail}</UserEmail>
          <LogoutButton onClick={handleLogout}>Sair da conta</LogoutButton>
        </UserCard>

        <NoticeCard>
          <NoticeTitle>📌 Mural de Avisos</NoticeTitle>
          
          {notices.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '0.85em', color: '#7f8c8d' }}>Nenhum aviso no momento.</p>
          ) : (
            notices.map(notice => (
              <NoticeItem key={notice._id}>
                <NoticeText>{notice.text}</NoticeText>
                <NoticeDate>{formatarDataCurta(notice.createdAt)}</NoticeDate>
                
                {isTeacher && (
                  <DeleteNoticeBtn onClick={() => handleDeleteNotice(notice._id)}>Excluir</DeleteNoticeBtn>
                )}
              </NoticeItem>
            ))
          )}

          {isTeacher && (
            <NoticeForm onSubmit={handleAddNotice}>
              <NoticeInput 
                placeholder="Escreva um novo aviso..." 
                value={newNotice}
                onChange={(e) => setNewNotice(e.target.value)}
                required
              />
              <AddNoticeBtn type="submit">Publicar Aviso</AddNoticeBtn>
            </NoticeForm>
          )}
        </NoticeCard>
      </LeftSidebar>
    </>
  );
}

export default Header;