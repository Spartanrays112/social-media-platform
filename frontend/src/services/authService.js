import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const signup = (data) => {
  return axios.post(`${API_URL}/signup`, data);
};

export const login = (data) => {
  return axios.post(`${API_URL}/login`, data);
};
