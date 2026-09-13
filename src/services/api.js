import axios from 'axios';

// Aqui eu crio a instância principal de comunicação com o meu Back-end da Fase 2
const api = axios.create({
  // Coloco a URL e a porta padrão onde a nossa API Node.js costuma rodar localmente.
  // Se o seu back-end rodar em outra porta (ex: 8080 ou 5000), eu altero aqui.
  baseURL: 'http://localhost:3000', 
  
  // Defino um tempo limite de 10 segundos para a requisição não travar a minha tela
  timeout: 10000, 
});

// Futuramente, quando eu for fazer o login do professor, 
// eu vou injetar o token de autorização aqui para proteger as rotas!

export default api;