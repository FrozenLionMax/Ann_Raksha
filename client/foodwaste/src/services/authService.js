import { API_URL } from '../config/api';
import axios from "axios";

const AUTH_URL = `${API_URL}/auth`;

export const loginUser = async (userData) => {
  const response = await axios.post(
    `${AUTH_URL}/login`,
    userData
  );

  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(
    `${AUTH_URL}/register`,
    userData
  );

  return response.data;
};