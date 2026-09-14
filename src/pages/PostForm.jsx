import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const Container = styled.div`
  max-width: 650px;
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
  margin-top: 5px;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
  min-height: 200px;
  resize: vertical;
  font-family: inherit;
`;

const CoverImageSection = styled.div`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    font-size: 0.9em;
    font-weight: bold;
    color: #2c3e50;
  }
`;

const CoverPreviewBox = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  background: #edf2f7;
  border-radius: 4px;
  overflow: hidden;
  border: 1px dashed #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    color: #64748b;
    font-size: 0.9em;
  }
`;

const RemoveCoverBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.7);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8em;
  cursor: pointer;

  &:hover {
    background: #e74c3c;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px;
  background-color: ${props => props.$delete ? '#e74c3c' : '#27ae60'};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.$delete ? '#c0392b' : '#2ecc71'};
  }
`;

const PreviewContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 5px;
`;

const PreviewCard = styled.div`
  position: relative;
  width: 100px;
  height: 80px;
  background: #f8f9fa;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(0,0,0,0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e74c3c;
  }
`;

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [attachments, setAttachments] = useState([]);
  
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
      setContent(response.data.content || '');
      setCoverImage(response.data.coverImage || '');
      
      let loadedAttachments = response.data.attachments || [];
      if (loadedAttachments.length === 0 && response.data.attachment) {
        loadedAttachments = [response.data.attachment];
      }
      setAttachments(loadedAttachments);
    } catch (error) {
      console.error("Error loading post:", error);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Apenas imagens são permitidas como capa.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImage(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (attachments.length + files.length > 3) {
      alert("Você pode enviar no máximo 3 anexos na lateral.");
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('video/')) {
        alert("Vídeos não são permitidos como anexo.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachments(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemoveAttachment = (indexToRemove) => {
    setAttachments(attachments.filter((_, index) => index !== indexToRemove));
  };

  const handleDelete = async () => {
    if (!window.confirm("Deseja realmente excluir esta postagem?")) return;

    try {
      await api.delete(`/posts/${id}`);
      alert("Postagem excluída com sucesso.");
      navigate('/admin');
    } catch (error) {
      console.error("Erro ao deletar post:", error);
      alert("Erro ao excluir postagem.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const postData = { title, content, author: userName, attachments, coverImage };

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

        <CoverImageSection>
          <label>Foto de Capa do Post:</label>
          <CoverPreviewBox>
            {coverImage ? (
              <>
                <img src={coverImage} alt="Capa" />
                <RemoveCoverBtn type="button" onClick={() => setCoverImage('')}>Remover Capa</RemoveCoverBtn>
              </>
            ) : (
              <span>Nenhuma capa selecionada</span>
            )}
          </CoverPreviewBox>
          <Input 
            type="file" 
            accept="image/*"
            onChange={handleCoverChange}
          />
        </CoverImageSection>
        
        <TextArea 
          placeholder="Escreva o conteúdo do seu post aqui..." 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <FileLabel>
          Anexos Laterais (Máximo de 3 arquivos):
          {attachments.length < 3 && (
            <Input 
              type="file" 
              accept="image/*,application/pdf"
              multiple
              onChange={handleFileChange}
            />
          )}
        </FileLabel>

        {attachments.length > 0 && (
          <PreviewContainer>
            {attachments.map((att, index) => {
              const isImg = att.startsWith('data:image');
              return (
                <PreviewCard key={index}>
                  {isImg ? <img src={att} alt="Preview" /> : <span style={{fontSize: '12px'}}>📄 PDF</span>}
                  <RemoveBtn type="button" onClick={() => handleRemoveAttachment(index)}>&times;</RemoveBtn>
                </PreviewCard>
              );
            })}
          </PreviewContainer>
        )}
        
        <ButtonGroup>
          <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Publicar Postagem'}</Button>
          {isEditing && (
            <Button type="button" $delete onClick={handleDelete}>
              Excluir Post
            </Button>
          )}
        </ButtonGroup>
      </Form>
    </Container>
  );
}

export default PostForm;