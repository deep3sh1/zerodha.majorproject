// src/dashboard/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002", // backend URL
  withCredentials: true, // use this if you are using cookies
});

export default api;
