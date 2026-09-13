import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
`;

const SearchButton = styled.button`
  padding: 12px 25px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

const CreateButton = styled.button`
  padding: 12px 25px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2ecc71;
  }
`;

// Transformamos a div em um Link (clicável por inteiro)
const PostCard = styled(Link)`
  display: block;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  text-decoration: none; /* Remove o sublinhado do link */
  color: inherit; /* Mantém a cor original do texto */
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }
`;

const PostTitle = styled.h2`
  margin: 0 0 10px 0;
  color: #2c3e50;

  ${PostCard}:hover & {
    color: #3498db; /* O título fica azul quando passa o mouse no card */
  }
`;

const PostInfo = styled.p`
  color: #7f8c8d;
  font-size: 0.9em;
  margin: 0 0 15px 0;
`;

const PostPreview = styled.p`
  color: #34495e;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const formatarDataHora = (dataString) => {
  if (!dataString) return '';
  const data = new Date(dataString);
  const dataFormatada = data.toLocaleDateString('pt-BR');
  const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dataFormatada} às ${horaFormatada}`;
};

function Home() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const userRole = localStorage.getItem('userRole') || 'student';

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (searchTerm.trim() === '') {
        loadPosts();
      } else {
        const response = await api.get(`/posts/search?term=${searchTerm}`);
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  };

  return (
    <Container>
      <Title>Blog da Comunidade Educacional</Title>
      
      <SearchForm onSubmit={handleSearch}>
        <SearchInput 
          type="text"
          placeholder="Buscar postagens por palavra-chave ou autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchButton type="submit">Buscar</SearchButton>
        
        {(userRole === 'teacher' || userRole === 'professor') && (
          <CreateButton type="button" onClick={() => navigate('/post/novo')}>
            Novo Post
          </CreateButton>
        )}
      </SearchForm>

      {posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Nenhuma postagem encontrada.</p>
      ) : (
        posts.map(post => {
          const dataExibicao = post.updatedAt || post.createdAt || Date.now();
          const isEdited = post.updatedAt && post.createdAt && post.updatedAt !== post.createdAt;

          return (
            <PostCard to={`/post/${post._id || post.id}`} key={post._id || post.id}>
              <PostTitle>{post.title}</PostTitle>
              <PostInfo>
                Por <strong>{post.author}</strong> em {formatarDataHora(dataExibicao)} {isEdited ? '(Editado)' : ''}
              </PostInfo>
              <PostPreview>{post.content}</PostPreview>
            </PostCard>
          );
        })
      )}
    </Container>
  );
}

export default Home;