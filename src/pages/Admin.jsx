import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import api from '../services/api';

// --- ESTILOS DO COMPONENTE ---
const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin: 0;
`;

const AddButton = styled(Link)`
  background-color: #27ae60;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2ecc71;
  }
`;

const PostRow = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PostInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostTitle = styled.h3`
  margin: 0 0 5px 0;
  color: #34495e;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  background-color: ${props => props.$delete ? '#e74c3c' : '#f39c12'};

  &:hover {
    background-color: ${props => props.$delete ? '#c0392b' : '#d35400'};
  }
`;

// Criei uma versão do ActionButton que funciona como um Link para a página de edição
const EditLink = styled(Link)`
  padding: 8px 15px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  color: white;
  background-color: #f39c12;

  &:hover {
    background-color: #d35400;
  }
`;

// --- LÓGICA DO COMPONENTE ---
function Admin() {
  const [posts, setPosts] = useState([]);

  // Quando eu abro a tela do Admin, busco todos os posts no banco
  useEffect(() => {
    const carregarPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error("Erro ao carregar postagens para o Admin:", error);
      }
    };
    carregarPosts();
  }, []);

  // Minha função que dispara a rota de exclusão no back-end
  const handleDelete = async (id) => {
    // Adiciono uma confirmação dupla para eu não excluir sem querer
    const confirmacao = window.confirm("Tem certeza que deseja excluir esta postagem?");
    
    if (confirmacao) {
      try {
        // Faço o pedido de exclusão (DELETE) para a API
        await api.delete(`/posts/${id}`);
        
        // Atualizo a minha tela tirando o post excluído da lista, sem precisar recarregar a página
        setPosts(posts.filter(post => post._id !== id));
        alert("Post excluído com sucesso!");
        
      } catch (error) {
        console.error("Erro ao excluir a postagem:", error);
        alert("Ocorreu um erro ao excluir.");
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>Gerenciar Postagens</Title>
        <AddButton to="/post/novo">Novo Post</AddButton>
      </Header>

      {/* Faço um map para criar uma linha para cada post real do banco */}
      {posts.map((post) => (
        <PostRow key={post._id}>
          <PostInfo>
            <PostTitle>{post.title}</PostTitle>
            <span>Autor: {post.author}</span>
          </PostInfo>
          <ActionGroup>
            {/* O link de editar agora aponta para a rota dinâmica enviando o _id */}
            <EditLink to={`/post/editar/${post._id}`}>Editar</EditLink>
            
            {/* O botão de excluir dispara a minha função handleDelete passando o _id */}
            <ActionButton $delete onClick={() => handleDelete(post._id)}>
              Excluir
            </ActionButton>
          </ActionGroup>
        </PostRow>
      ))}

      {posts.length === 0 && (
        <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
          Nenhuma postagem encontrada no sistema.
        </p>
      )}
    </Container>
  );
}

export default Admin;