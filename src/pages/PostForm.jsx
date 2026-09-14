import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto 40px auto;
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
  margin-top: 10px;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
  min-height: 150px;
  resize: vertical;
`;

const CoverSection = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`;

const ColorPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: 0.85em;
    color: #555;
    font-weight: bold;
  }
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
  margin-top: 10px;

  &:hover {
    background-color: #2ecc71;
  }
`;

const PreviewBox = styled.div`
  margin-top: 10px;
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
  object-fit: contain;
`;

const RemoveAttachmentBtn = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
  font-weight: bold;

  &:hover {
    background-color: #c0392b;
  }
`;

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState('');
  const [coverColor, setCoverColor] = useState('#3498db');
  const [coverText, setCoverText] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Teacher';

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
      setCoverColor(response.data.coverColor || '#3498db');
      setCoverText(response.data.coverText || '');
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

  const handleRemoveAttachment = () => {
    if(window.confirm("Deseja remover o anexo desta postagem?")) {
      setAttachment('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const postData = { title, content, author: userName, attachment, coverColor, coverText };

      if (isEditing) {
        await api.put(`/posts/${id}`, postData);
        alert("Post atualizado com sucesso!");
      } else {
        await api.post('/posts', postData);
        alert("Post criado com sucesso!");
      }
      navigate('/');
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Erro ao salvar a postagem. Verifique os dados.");
    }
  };

  const isImage = attachment && attachment.startsWith('data:image');
  const isPdf = attachment && attachment.startsWith('data:application/pdf');

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

        <CoverSection>
          <ColorPickerContainer>
            <label>Cor da Capa:</label>
            <input 
              type="color" 
              value={coverColor} 
              onChange={(e) => setCoverColor(e.target.value)}
              style={{ width: '50px', height: '40px', border: 'none', cursor: 'pointer', background: 'none' }}
            />
          </ColorPickerContainer>

          <Input 
            type="text" 
            placeholder="Texto da capa (máx. 30 letras)" 
            value={coverText}
            maxLength={30}
            onChange={(e) => setCoverText(e.target.value)}
            style={{ flex: 1 }}
          />
        </CoverSection>
        
        <TextArea 
          placeholder="Escreva o conteúdo do seu post aqui..." 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {attachment ? (
          <PreviewBox>
            <strong>Anexo atual:</strong>
            {isImage && <PreviewImage src={attachment} alt="Pré-visualização do anexo" />}
            {isPdf && <p>📄 Documento PDF anexado.</p>}
            <RemoveAttachmentBtn type="button" onClick={handleRemoveAttachment}>
              Remover Anexo
            </RemoveAttachmentBtn>
          </PreviewBox>
        ) : (
          <FileLabel>
            Anexo (Apenas Imagens ou PDF):
            <Input 
              type="file" 
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
          </FileLabel>
        )}
        
        <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Publicar Postagem'}</Button>
      </Form>
    </Container>
  );
}

export default PostForm;