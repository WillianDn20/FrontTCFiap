import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
`;

const FileLabel = styled.label`
  font-size: 0.9em;
  color: #555;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
  min-height: 150px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 12px;
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

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Teacher';

  // Verifica se o ID passado na URL é realmente um ID válido do MongoDB (24 caracteres hexadecimais)
  const isEditing = id && id.length === 24;

  useEffect(() => {
    if (isEditing) {
      loadPostForEditing();
    }
  }, [id]);

  const loadPostForEditing = async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      setTitle(response.data.title);
      setContent(response.data.content);
      setAttachment(response.data.attachment || '');
    } catch (error) {
      console.error("Error loading post:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      alert("Vídeos não são permitidos como anexo. Apenas imagens e arquivos PDF.");
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachment(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const postData = { title, content, author: userName, attachment };

      if (isEditing) {
        await api.put(`/posts/${id}`, postData);
        alert("Post atualizado com sucesso!");
      } else {
        await api.post('/posts', postData);
        alert("Post criado com sucesso!");
      }
      navigate('/admin');
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Erro ao salvar a postagem. Verifique os dados.");
    }
  };

  return (
    <Container>
      <Title>{isEditing ? 'Editar Postagem' : 'Nova Postagem'}</Title>
      
      <Form onSubmit={handleSubmit}>
        <Input 
          type="text" 
          placeholder="Título do post" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <TextArea 
          placeholder="Escreva o conteúdo do seu post aqui..." 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <FileLabel>
          Anexo (Apenas Imagens ou PDF):
          <Input 
            type="file" 
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
        </FileLabel>
        
        <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Publicar Postagem'}</Button>
      </Form>
    </Container>
  );
}

export default PostForm;