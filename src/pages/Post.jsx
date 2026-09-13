import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 10px;
`;

const AuthorDate = styled.p`
  color: #7f8c8d;
  font-size: 0.9em;
  margin-bottom: 30px;
`;

const Content = styled.div`
  color: #34495e;
  line-height: 1.6;
  font-size: 1.1em;
  margin-bottom: 40px;
  white-space: pre-wrap;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  color: #3498db;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
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

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  
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
    return <Container><p>Loading post...</p></Container>;
  }

  return (
    <Container>
      <Title>{post.title}</Title>
      <AuthorDate>By <strong>{post.author}</strong> on {new Date(post.createdAt || Date.now()).toLocaleDateString()}</AuthorDate>
      
      <Content>{post.content}</Content>

      <CommentsSection>
        <CommentsTitle>Comments ({post.comments ? post.comments.length : 0})</CommentsTitle>

        {post.comments && post.comments.length > 0 ? (
          post.comments.map((c) => {
            // Verifica se o usuário logado é o autor do comentário OU se é professor
            const canDelete = userRole === 'teacher' || c.author === userName;

            return (
              <CommentCard key={c._id || c.id}>
                <div>
                  <p>{c.text}</p>
                  <small>By <strong>{c.author}</strong> on {new Date(c.date).toLocaleDateString()}</small>
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
          <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>No comments yet. Be the first to comment!</p>
        )}

        <CommentForm onSubmit={handleAddComment}>
          <TextArea 
            placeholder={`Comment as ${userName}...`}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <Button type="submit">Submit Comment</Button>
        </CommentForm>
      </CommentsSection>

      <BackLink to="/">&larr; Back to posts list</BackLink>
    </Container>
  );
}

export default Post;