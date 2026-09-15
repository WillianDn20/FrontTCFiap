import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto 40px auto;
  padding: 0 20px;
  font-family: Arial, sans-serif;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0;
`;

const CreateButton = styled(Link)`
  padding: 10px 20px;
  background-color: #27ae60;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.95em;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2ecc71;
  }
`;

// Card clicável que leva para o post
const AdminPostCard = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #e2e8f0;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
`;

const CardLeft = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 15px 20px;
  flex: 1;
  min-width: 0;
`;

const MiniCover = styled.img`
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  flex-shrink: 0;
`;

const PostInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const PostTitle = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 1.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PostSnippet = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 0.85em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardRight = styled.div`
  display: flex;
  gap: 10px;
  padding-right: 20px;
  flex-shrink: 0;
`;

const EditButton = styled(Link)`
  padding: 8px 16px;
  background-color: #f39c12;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.85em;
  transition: background-color 0.2s;

  &:hover {
    background-color: #d68910;
  }
`;

const DeleteButton = styled.button`
  padding: 8px 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.85em;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;

function Admin() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault(); // Impede que o clique abra o post ao apagar
    if (!window.confirm("Deseja realmente excluir esta postagem?")) return;

    try {
      await api.delete(`/posts/${id}`);
      loadPosts();
    } catch (error) {
      console.error("Erro ao deletar post:", error);
      alert("Erro ao excluir postagem.");
    }
  };

  return (
    <Container>
      <HeaderRow>
        <Title>Gerenciar postagens</Title>
        <CreateButton to="/post/novo">Nova postagem</CreateButton>
      </HeaderRow>

      {posts.length === 0 ? (
        <p style={{ color: '#7f8c8d' }}>Nenhuma postagem cadastrada.</p>
      ) : (
        posts.map(post => (
          <AdminPostCard to={`/post/${post._id || post.id}`} key={post._id || post.id}>
            <CardLeft>
              {post.coverImage && <MiniCover src={post.coverImage} alt="Capa" />}
              <PostInfo>
                <PostTitle>{post.title}</PostTitle>
                <PostSnippet>Por {post.author} — {post.content}</PostSnippet>
              </PostInfo>
            </CardLeft>

            <CardRight>
              <EditButton 
                to={`/post/edit/${post._id || post.id}`}
                onClick={(e) => e.stopPropagation()} // Evita conflito com o link do card
              >
                Editar
              </EditButton>
              <DeleteButton onClick={(e) => handleDelete(e, post._id || post.id)}>
                Excluir
              </DeleteButton>
            </CardRight>
          </AdminPostCard>
        ))
      )}
    </Container>
  );
}

export default Admin;