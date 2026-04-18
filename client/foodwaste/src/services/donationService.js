import axios from "axios";

const API_URL = "http://localhost:5000/api/donations";

const getTokenConfig = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
};

export const createDonation = async (donationData) => {
  const response = await axios.post(
    `${API_URL}/create`,
    donationData,
    getTokenConfig()
  );

  return response.data;
};

export const getMyDonations = async () => {
  const response = await axios.get(
    `${API_URL}/my-donations`,
    getTokenConfig()
  );

  return response.data;
};

export const getAllDonations = async () => {
  const response = await axios.get(
    `${API_URL}/all`,
    getTokenConfig()
  );

  return response.data;
};

export const claimDonation = async (id) => {
  const response = await axios.post(
    `${API_URL}/claim/${id}`,
    {},
    getTokenConfig()
  );

  return response.data;
};

export const completeDonation = async (id) => {
  const response = await axios.put(
    `${API_URL}/complete/${id}`,
    {},
    getTokenConfig()
  );

  return response.data;
};