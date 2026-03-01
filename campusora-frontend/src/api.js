import axios from "axios";

const api = axios.create({
  baseURL: "https://campusora-2.onrender.com",
});

export default api;