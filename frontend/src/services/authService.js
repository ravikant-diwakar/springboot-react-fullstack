import api from './api';

const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  checkUsernameAvailability: async (username) => {
    try {
      const response = await api.get(`/auth/check-username?username=${username}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  checkEmailAvailability: async (email) => {
    try {
      const response = await api.get(`/auth/check-email?email=${email}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default authService;