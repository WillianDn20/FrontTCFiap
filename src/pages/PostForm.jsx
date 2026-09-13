import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

// --- ESTILOS DO COMPONENTE ---
const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
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
  font-size: 16px;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  min-height: 200px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 15px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2ecc71;
  }
`;

// --- LÓGICA DO COMPONENTE ---
function PostForm() {
  const { id } = useParams();
  
  // Utilizo o useNavigate para redirecionar o usuário de tela automaticamente após salvar
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  // Se eu estiver na tela de edição (tem ID), busco os dados do post assim que a tela abrir
  useEffect(() => {
    if (id) {
      const carregarPost = async () => {
        try {
          const response = await api.get(`/posts/${id}`);
          setTitle(response.data.title);
          setAuthor(response.data.author);
          setContent(response.data.content);
        } catch (error) {
          console.error("Erro ao carregar o post para edição:", error);
          alert("Não foi possível carregar os dados do post.");
        }
      };
      carregarPost();
    }
  }, [id]);

  // Função disparada ao clicar no botão de salvar/publicar
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Crio o objeto com os dados exatos que o meu Back-end espera receber
    const postData = {
      title,
      author,
      content
    };

    try {
      if (id) {
        // Se tem ID, eu faço um PUT (Atualizar)
        await api.put(`/posts/${id}`, postData);
        alert("Post atualizado com sucesso!");
      } else {
        // Se não tem ID, eu faço um POST (Criar)
        await api.post('/posts', postData);
        alert("Novo post publicado com sucesso!");
      }
      
      // Após o sucesso, eu redireciono o usuário de volta para o Painel Admin
      navigate('/admin');
      
    } catch (error) {
      console.error("Erro ao salvar a postagem:", error);
      alert("Ocorreu um erro ao salvar. Verifique o console.");
    }
  };

  return (
    <Container>
      <Title>{id ? 'Editar Postagem' : 'Nova Postagem'}</Title>
      
      <Form onSubmit={handleSubmit}>
        <Input 
          type="text" 
          placeholder="Título do Post" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <Input 
          type="text" 
          placeholder="Nome do Autor" 
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        
        <TextArea 
          placeholder="Escreva o conteúdo do post aqui..." 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        
        <Button type="submit">
          {id ? 'Salvar Alterações' : 'Publicar Postagem'}
        </Button>
      </Form>
    </Container>
  );
}

export default PostForm;