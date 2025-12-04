import axios from 'axios';

// Configuração base do axios
axios.defaults.baseURL = 'http://localhost:3002';

// Adiciona o token JWT a todas as requisições automaticamente
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token');
      // Aqui você pode redirecionar para a página de login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;