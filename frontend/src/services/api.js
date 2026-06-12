import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const recommendationAPI = {
  getRecommendation: (userData) => api.post('/recommendations', userData),
  getUserHistory: (email) => api.get(`/recommendations/history/${email}`),
  getAnalytics: () => api.get('/recommendations/analytics'),
};

export const gemstoneAPI = {
  getAllGemstones: () => api.get('/gemstones'),
  getGemstoneById: (id) => api.get(`/gemstones/${id}`),
  addGemstone: (gemstone) => api.post('/gemstones', gemstone),
  updateGemstone: (id, gemstone) => api.put(`/gemstones/${id}`, gemstone),
  deleteGemstone: (id) => api.delete(`/gemstones/${id}`),
  getZodiacMapping: () => api.get('/gemstones/mapping/zodiac'),
  updateZodiacMapping: (mapping) => api.put('/gemstones/mapping/zodiac', { mapping }),
};

export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (email) => api.get(`/users/${email}`),
  deleteUser: (email) => api.delete(`/users/${email}`),
};

export default api;
