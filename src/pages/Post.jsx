import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  font-family: Arial, sans-serif;
`;

const TopActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 8px 15px;
  background-color: #2f88e1;
  color: rgb(254, 254, 254);
  text-decoration: none;
  font-weight: bold;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;

  &:hover {
    background-color: #1155ae;
  }
`;

const AdminActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  color: white;
  background-color: ${props => props.$delete ? '#e74c3c' : '#f39c12'};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.$delete ? '#c0392b' : '#d68910'};
  }
`;

// Título e Autor ficam em cima agora
const TitleBox = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 2em;
`;

const AuthorDate = styled.p`
  color: #7f8c8d;
  font-size: 0.95em;
  margin: 0;
`;

const CoverImage = styled.img`
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 30px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.95;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
`;

const CloseModalButton = styled.button`
  position: absolute;
  top: 20px;
  right: 30px;
  background: none;
  border: none;
  color: white;
  font-size: 40px;
  cursor: pointer;
`;

const Content = styled.div`
  color: #34495e;
  line-height: 1.6;
  font-size: 1.1em;
  margin-bottom: 30px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const AttachmentsSection = styled.div`
  margin-bottom: 40px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const SectionSubTitle = styled.strong`
  display: block;
  margin-bottom: 15px;
  color: #2c3e50;
`;

const AttachmentsGrid = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const AttachmentThumb = styled.img`
  width: 180px;
  height: 130px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  }
`;

const PdfCardBox = styled.a`
  width: 180px;
  height: 130px;
  background-color: #ffffff;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  color: #34495e;
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    border-color: #3498db;
  }

  .clip { font-size: 2em; }
  .label {
    font-size: 0.85em;
    font-weight: bold;
    color: #2980b9;
    background-color: #ebf5fb;
    padding: 4px 10px;
    border-radius: 4px;
  }
`;

const CommentsSection = styled.section`
  margin-top: 40px;
  border-top: 1px solid #ecf0f1;
  padding-top: 20px;
`;

const CommentsTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 20px;
`;

const CommentCard = styled.div`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  border-left: 4px solid #3498db;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  p { margin: 0 0 5px 0; color: #333; }
  small { color: #7f8c8d; }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.85em;
  &:hover { text-decoration: underline; }
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
  resize: vertical;
  min-height: 80px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  align-self: flex-start;
  &:hover { background-color: #2ecc71; }
`;

const formatarDataHora = (dataString) => {
  if (!dataString) return '';
  const data = new Date(dataString);
  const dataFormatada = data.toLocaleDateString('pt-BR');
  const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dataFormatada} às ${horaFormatada}`;
};

function Post() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [modalImg, setModalImg] = useState(null); 
  
  const userName = localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('userRole') || 'student';

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error("Error loading post:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Deseja realmente excluir esta postagem?")) return;
    try {
      await api.delete(`/posts/${id}`);
      alert("Postagem excluída com sucesso.");
      navigate('/'); 
    } catch (error) {
      console.error("Erro ao deletar post:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await api.post(`/posts/${id}/comments`, { text: newComment, author: userName });
      setPost(response.data);
      setNewComment('');
    } catch (error) {
      console.error("Error sending comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Deseja realmente excluir este comentário?")) return;
    try {
      const response = await api.delete(`/posts/${id}/comments/${commentId}`, { params: { userName, userRole } });
      setPost(response.data);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (!post) {
    return <Container><p>Carregando post...</p></Container>;
  }

  const listAttachments = post.attachments || [];
  const isEdited = post.updatedAt && post.createdAt && post.updatedAt !== post.createdAt;
  const dataExibicao = post.updatedAt || post.createdAt || Date.now();

  return (
    <>
      {modalImg && (
        <ModalOverlay onClick={() => setModalImg(null)}>
          <CloseModalButton onClick={() => setModalImg(null)}>&times;</CloseModalButton>
          <ModalImage src={modalImg} alt="Zoom" onClick={(e) => e.stopPropagation()} />
        </ModalOverlay>
      )}

      <Container>
        <TopActions>
          <BackButton to="/">&larr; Voltar</BackButton>
          
          {(userRole === 'teacher' || userRole === 'professor') && (
            <AdminActions>
              <ActionButton onClick={() => navigate(`/post/edit/${id}`)}>Editar</ActionButton>
              <ActionButton $delete onClick={handleDeletePost}>Excluir</ActionButton>
            </AdminActions>
          )}
        </TopActions>

        {/* 1. Título, Autor e Data agora ficam em cima */}
        <TitleBox>
          <Title>{post.title}</Title>
          <AuthorDate>
            Por <strong>{post.author}</strong> em {formatarDataHora(dataExibicao)} {isEdited ? '(Editado)' : ''}
          </AuthorDate>
        </TitleBox>

        {/* 2. Foto de Capa aparece logo abaixo do título */}
        {post.coverImage && (
          <CoverImage 
            src={post.coverImage} 
            alt="Capa do post" 
            onClick={() => setModalImg(post.coverImage)}
            title="Clique para ampliar"
          />
        )}
        
        {/* 3. Corpo do texto */}
        <Content>{post.content}</Content>

        {listAttachments.length > 0 && (
          <AttachmentsSection>
            <SectionSubTitle>Anexos ({listAttachments.length}):</SectionSubTitle>
            
            <AttachmentsGrid>
              {listAttachments.map((att, index) => {
                const isImg = att.startsWith('data:image');
                const isPdf = att.startsWith('data:application/pdf');

                return (
                  <React.Fragment key={index}>
                    {isImg && (
                      <AttachmentThumb 
                        src={att} 
                        alt={`Anexo ${index + 1}`} 
                        onClick={() => setModalImg(att)}
                      />
                    )}
                    {isPdf && (
                      <PdfCardBox href={att} download={`documento-${index + 1}.pdf`}>
                        <span className="clip">📎</span>
                        <span className="label">Baixar PDF</span>
                      </PdfCardBox>
                    )}
                  </React.Fragment>
                );
              })}
            </AttachmentsGrid>
          </AttachmentsSection>
        )}

        <CommentsSection>
          <CommentsTitle>Comentários ({post.comments ? post.comments.length : 0})</CommentsTitle>

          {post.comments && post.comments.length > 0 ? (
            post.comments.map((c) => {
              const canDelete = userRole === 'teacher' || c.author === userName;
              return (
                <CommentCard key={c._id || c.id}>
                  <div>
                    <p>{c.text}</p>
                    <small>Por <strong>{c.author}</strong> em {formatarDataHora(c.date)}</small>
                  </div>
                  {canDelete && (
                    <DeleteButton onClick={() => handleDeleteComment(c._id || c.id)}>Excluir</DeleteButton>
                  )}
                </CommentCard>
              );
            })
          ) : (
            <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>Nenhum comentário ainda.</p>
          )}

          <CommentForm onSubmit={handleAddComment}>
            <TextArea 
              placeholder={`Comentar como ${userName}...`}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <Button type="submit">Enviar comentário</Button>
          </CommentForm>
        </CommentsSection>

      </Container>
    </>
  );
}

export default Post;