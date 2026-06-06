import axios from "axios";

const API_URL = "http://localhost:5000/api/users/dashboard";

export const getDashboardStats = async () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};