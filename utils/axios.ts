import axios from "axios";

export const api = axios.create({
  baseURL: "https://cricfair-backend.onrender.com/api",
  withCredentials: true,
});