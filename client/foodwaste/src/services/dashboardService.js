import { API_URL } from '../config/api';
import axios from "axios";

const DASHBOARD_URL = `${API_URL}/users/dashboard`;

export const getDashboardStats = async () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  const response = await axios.get(DASHBOARD_URL, config);

  return response.data;
};