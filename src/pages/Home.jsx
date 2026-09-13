import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { Link } from 'react-router-dom';

// --- ESTILOS DO COMPONENTE ---
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
`;

// Transformei a área de busca em um formulário para o "Enter" funcionar
const SearchContainer = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
`;

const SearchButton = styled.button`
  padding: 12px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

const PostCard = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  }
`;

const PostTitle = styled.h2`
  margin-top: 0;
  color: #34495e;
`;

const PostAuthor = styled.span`
  font-size: 0.9em;
  color: #7f8c8d;
  font-weight: bold;
`;

const PostDescription = styled.p`
  color: #555;
  line-height: 1.5;
`;

// --- LÓGICA DO COMPONENTE ---
function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);

  // Função para carregar todos os posts iniciais
  const carregarPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error("Erro ao buscar os posts do back-end:", error);
    }
  };

  // Disparo a busca inicial assim que a tela abre
  useEffect(() => {
    carregarPosts();
  }, []);

  // Função que roda quando eu aperto "Enter" ou clico em Buscar
  const handleSearch = async (e) => {
    e.preventDefault(); // Evito que a tela pisque/recarregue
    
    try {
      if (searchTerm.trim() === '') {
        // Se a busca estiver vazia, carrego todos os posts de novo
        carregarPosts(); 
      } else {
        // Se tiver texto, chamo a rota de busca do back-end
        const response = await api.get(`/posts/search?term=${searchTerm}`);
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar postagens específicas:", error);
    }
  };

  return (
    <Container>
      <Title>Blog da Comunidade Educacional</Title>
      
      <SearchContainer onSubmit={handleSearch}>
        <SearchInput 
          type="text" 
          placeholder="Buscar postagens por palavra-chave..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchButton type="submit">Buscar</SearchButton>
      </SearchContainer>
      
      {/* Mapeio os posts reais vindos do banco de dados */}
      {posts.map((post) => (
        // Transformo o card inteiro em um link clicável
        <Link to={`/post/${post._id}`} key={post._id} style={{ textDecoration: 'none' }}>
          <PostCard>
            <PostTitle>{post.title}</PostTitle>
            <PostAuthor>Autor: {post.author}</PostAuthor>
            <PostDescription>
              {post.content ? post.content.substring(0, 150) : ""}...
            </PostDescription>
          </PostCard>
        </Link>
      ))}

      {/* Aviso se o banco estiver vazio ou a busca não achar nada */}
      {posts.length === 0 && (
        <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
          Nenhuma postagem encontrada.
        </p>
      )}
    </Container>
  );
}

export default Home;