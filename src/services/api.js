import axios from 'axios';

// Define a URL base da API:
// se houver uma variável de ambiente do Vite (ex: configurada para produção/Docker), usa ela senão, usa o padrão local 'http://localhost:3000'.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000, 
});

export default api;