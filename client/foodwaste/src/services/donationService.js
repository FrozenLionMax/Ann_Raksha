import { API_URL } from '../config/api';
import axios from "axios";

const DONATIONS_URL = `${API_URL}/donations`;

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
    `${DONATIONS_URL}/create`,
    donationData,
    getTokenConfig()
  );

  return response.data;
};

export const getMyDonations = async () => {
  const response = await axios.get(
    `${DONATIONS_URL}/my-donations`,
    getTokenConfig()
  );

  return response.data;
};

export const getAllDonations = async () => {
  const response = await axios.get(
    `${DONATIONS_URL}/all`,
    getTokenConfig()
  );

  return response.data;
};

export const claimDonation = async (id) => {
  const response = await axios.post(
    `${DONATIONS_URL}/claim/${id}`,
    {},
    getTokenConfig()
  );

  return response.data;
};

export const completeDonation = async (id) => {
  const response = await axios.put(
    `${DONATIONS_URL}/complete/${id}`,
    {},
    getTokenConfig()
  );

  return response.data;
};