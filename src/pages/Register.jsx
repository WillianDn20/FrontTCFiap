import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Container = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
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

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
`;

const Button = styled.button`
  padding: 12px;
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

const LoginLink = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 0.9em;

  a {
    color: #3498db;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      // Envia explicitamente name, email, password e role em inglês
      await api.post('/register', { 
        name, 
        email, 
        password, 
        role 
      });
      alert("Conta criada com sucesso! Faça login para continuar.");
      navigate('/login');
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      const errorMessage = error.response?.data?.error || "Ocorreu um erro ao criar a conta.";
      alert(errorMessage);
    }
  };

  return (
    <Container>
      <Title>Criar Nova Conta</Title>
      
      <Form onSubmit={handleRegister}>
        <Input 
          type="text" 
          placeholder="Seu nome completo" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input 
          type="email" 
          placeholder="Seu e-mail" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input 
          type="password" 
          placeholder="Sua senha" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {/* Valores em inglês exigidos pelo enum do Mongoose: student ou teacher */}
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Acesso de Aluno</option>
          <option value="teacher">Acesso de Professor (Docente)</option>
        </Select>
        
        <Button type="submit">Cadastrar</Button>
      </Form>

      <LoginLink>
        Já tem uma conta? <Link to="/login">Faça login aqui</Link>
      </LoginLink>
    </Container>
  );
}

export default Register;