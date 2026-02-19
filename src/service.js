import axios from 'axios';

const api = axios.create({
  // Se a variável não existir (localmente), ele usa o localhost
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000'
});

export default api;