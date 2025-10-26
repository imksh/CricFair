import axios from "axios";

export const api = axios.create({
  baseURL: "https://cricfair-backend.onrender.com/api",
  // baseURL: "http://10.144.23.71:3000/api",
  withCredentials: true,
});