import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; 

export const registerUser = async (formData) => {
  return await axios.post(`${API_URL}/register/`, formData);
};

export const loginUser = async (credentials) => {
  return await axios.post(`${API_URL}/token/`, credentials);
};
