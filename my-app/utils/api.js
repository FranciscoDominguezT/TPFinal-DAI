import axios from 'axios';

const api = axios.create({
  baseURL: 'https://open-moderately-silkworm.ngrok-free.app/api/user',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
