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

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
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

  &:hover { background-color: #2980b9; }
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

  &:hover { background-color: #2ecc71; }
`;

const PostCard = styled(Link)`
  display: block;
  background-color: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 25px;
  border: 1px solid #e2e8f0;
  text-decoration: none; 
  color: inherit; 
  overflow: hidden; 
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.08);
  }
`;

// Capa
const CardCoverImage = styled.img`
  width: 100%;
  height: 180px; 
  object-fit: cover;
  display: block;
  background-color: #000; 
`;

const CardBody = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
`;

const PostContentArea = styled.div`
  flex: 1;
  min-width: 0;
`;

const PostTitle = styled.h2`
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1.3em;

  ${PostCard}:hover & {
    color: #3498db; 
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

const ThumbnailContainer = styled.div`
  position: relative;
  width: 120px;
  height: 90px;
  flex-shrink: 0;
`;

const PostThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; 
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`;

const PdfAttachmentBox = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f1f2f6;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #7f8c8d;
  font-size: 1.5em;

  span {
    font-size: 0.45em;
    font-weight: bold;
    color: #95a5a6;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
`;

const ExtraBadge = styled.div`
  position: absolute;
  bottom: 6px;
  right: 6px;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  font-size: 0.7em;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
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
            Nova postagem
          </CreateButton>
        )}
      </SearchForm>

      {posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Nenhuma postagem encontrada.</p>
      ) : (
        posts.map(post => {
          const dataExibicao = post.updatedAt || post.createdAt || Date.now();
          const isEdited = post.updatedAt && post.createdAt && post.updatedAt !== post.createdAt;
          
          let listAttachments = post.attachments || [];
          if (listAttachments.length === 0 && post.attachment) {
            listAttachments = [post.attachment];
          }

          const hasAttachments = listAttachments.length > 0;
          const firstAttachment = hasAttachments ? listAttachments[0] : null;
          const isFirstImage = firstAttachment && firstAttachment.startsWith('data:image');
          const isFirstPdf = firstAttachment && firstAttachment.startsWith('data:application/pdf');
          const extraCount = listAttachments.length - 1;

          return (
            <PostCard to={`/post/${post._id || post.id}`} key={post._id || post.id}>
              {/* Imagem de Capa compacta e elegante no topo */}
              {post.coverImage && (
                <CardCoverImage src={post.coverImage} alt="Capa" />
              )}

              <CardBody>
                <PostContentArea>
                  <PostTitle>{post.title}</PostTitle>
                  
                  <PostInfo>
                    Por <strong>{post.author}</strong> em {formatarDataHora(dataExibicao)} {isEdited ? '(Editado)' : ''}
                  </PostInfo>
                  <PostPreview>{post.content}</PostPreview>
                </PostContentArea>

                {hasAttachments && (
                  <ThumbnailContainer>
                    {isFirstImage && <PostThumbnail src={firstAttachment} alt="Anexo" />}
                    {isFirstPdf && (
                      <PdfAttachmentBox>
                        📎
                        <span>PDF</span>
                      </PdfAttachmentBox>
                    )}

                    {extraCount > 0 && (
                      <ExtraBadge>
                        +{extraCount} {extraCount === 1 ? 'anexo' : 'anexos'}
                      </ExtraBadge>
                    )}
                  </ThumbnailContainer>
                )}
              </CardBody>
            </PostCard>
          );
        })
      )}
    </Container>
  );
}

export default Home;