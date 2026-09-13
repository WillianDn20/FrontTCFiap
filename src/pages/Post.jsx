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

// Nova Barra de Ações (Alinha o voltar à esquerda e os botões à direita)
const TopActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

// Botão de voltar padronizado com os botões administrativos
const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 8px 15px;
  background-color: #1a7ee2;
  color: white;
  text-decoration: none;
  font-weight: bold;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;

  &:hover {
    background-color: #105fad;
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

const TitleBox = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 10px;
`;

const AuthorDate = styled.p`
  color: #7f8c8d;
  font-size: 0.9em;
  margin: 0;
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
  
  &:hover {
    color: #ccc;
  }
`;

const Content = styled.div`
  color: #34495e;
  line-height: 1.6;
  font-size: 1.1em;
  margin-bottom: 30px;
  white-space: pre-wrap;
`;

const AttachmentBox = styled.div`
  margin-bottom: 40px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e2e8f0;

  img {
    max-width: 100%;
    max-height: 400px;
    height: auto;
    object-fit: contain;
    border-radius: 4px;
    display: block;
    margin-top: 15px;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  img:hover {
    opacity: 0.85;
  }

  a {
    color: #3498db;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
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

  p {
    margin: 0 0 5px 0;
    color: #333;
  }

  small {
    color: #7f8c8d;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.85em;

  &:hover {
    text-decoration: underline;
  }
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

  &:hover {
    background-color: #2ecc71;
  }
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
      alert("Erro ao excluir postagem.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await api.post(`/posts/${id}/comments`, {
        text: newComment,
        author: userName
      });
      setPost(response.data);
      setNewComment('');
    } catch (error) {
      console.error("Error sending comment:", error);
      alert("Error sending comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Deseja realmente excluir este comentário?")) return;

    try {
      const response = await api.delete(`/posts/${id}/comments/${commentId}`, {
        params: { userName, userRole }
      });
      setPost(response.data);
    } catch (error) {
      console.error("Error deleting comment:", error);
      const errorMsg = error.response?.data?.error || "Erro ao deletar comentário.";
      alert(errorMsg);
    }
  };

  if (!post) {
    return <Container><p>Carregando post...</p></Container>;
  }

  const isImage = post.attachment && post.attachment.startsWith('data:image');
  const isPdf = post.attachment && post.attachment.startsWith('data:application/pdf');

  const isEdited = post.updatedAt && post.createdAt && post.updatedAt !== post.createdAt;
  const dataExibicao = post.updatedAt || post.createdAt || Date.now();

  return (
    <>
      {isModalOpen && isImage && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <CloseModalButton onClick={() => setIsModalOpen(false)}>&times;</CloseModalButton>
          <ModalImage src={post.attachment} alt="Anexo em tela cheia" onClick={(e) => e.stopPropagation()} />
        </ModalOverlay>
      )}

      <Container>
        
        {/* Nova Barra de Ações: Voltar na esquerda, Editar/Excluir na direita */}
        <TopActions>
          <BackButton to="/">&larr; Voltar</BackButton>
          
          {(userRole === 'teacher' || userRole === 'professor') && (
            <AdminActions>
              <ActionButton onClick={() => navigate(`/post/edit/${id}`)}>Editar</ActionButton>
              <ActionButton $delete onClick={handleDeletePost}>Excluir</ActionButton>
            </AdminActions>
          )}
        </TopActions>

        <TitleBox>
          <Title>{post.title}</Title>
          <AuthorDate>
            Por <strong>{post.author}</strong> em {formatarDataHora(dataExibicao)} {isEdited ? '(Editado)' : ''}
          </AuthorDate>
        </TitleBox>
        
        <Content>{post.content}</Content>

        {post.attachment && (
          <AttachmentBox>
            <strong>Anexo da Postagem:</strong>
            
            {isImage && (
              <img 
                src={post.attachment} 
                alt="Anexo do Post" 
                onClick={() => setIsModalOpen(true)}
                title="Clique para ampliar"
              />
            )}
            
            {isPdf && (
              <p style={{ marginTop: '10px' }}>
                📄 <a href={post.attachment} download="documento-anexado.pdf">Baixar Documento PDF</a>
              </p>
            )}
          </AttachmentBox>
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
                    <DeleteButton onClick={() => handleDeleteComment(c._id || c.id)}>
                      Excluir
                    </DeleteButton>
                  )}
                </CommentCard>
              );
            })
          ) : (
            <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
          )}

          <CommentForm onSubmit={handleAddComment}>
            <TextArea 
              placeholder={`Comentar como ${userName}...`}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <Button type="submit">Enviar Comentário</Button>
          </CommentForm>
        </CommentsSection>

      </Container>
    </>
  );
}

export default Post;