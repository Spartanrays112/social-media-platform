// import axios from "axios";

// const API = "http://localhost:5000/api/user";

// const getAuthHeader = () => ({
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// });

// export const fetchSuggestions = async () => {
//   const res = await axios.get(`${API}/suggestions`, getAuthHeader());
//   return res.data;
// };

// export const fetchLatestActivity = async () => {
//   const res = await axios.get(`${API}/activity`, getAuthHeader());
//   return res.data;
// };


// export const searchUsers = async (query) => {
//   const token = localStorage.getItem("token");
//   const headers = { Authorization: `Bearer ${token}` };
//   const res = await API.get(`/users/search?q=${query}`, { headers });
//   return res.data;
// };
import axios from "axios";

// Base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api/user",
});

// Auth headers helper
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Existing services
export const fetchSuggestions = async () => {
  const res = await API.get("/suggestions", getAuthHeader());
  return res.data;
};

export const fetchLatestActivity = async () => {
  const res = await API.get("/activity", getAuthHeader());
  return res.data;
};

// ✅ Search users by query
export const searchUsers = async (query) => {
  const res = await API.get(`/search?q=${query}`, getAuthHeader());
  return res.data;
};
