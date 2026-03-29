// src/services/authService.js
import apiClient from "@/api/apiClient";

// LOGIN
export const login = async (credentials) => {
  const formData = new URLSearchParams();
  formData.append("username", credentials.username);
  formData.append("password", credentials.password);

  const response = await apiClient.post("/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const { access_token, refresh_token, token_type } = response.data;

  localStorage.setItem("token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
  localStorage.setItem("token_type", token_type);

  return response.data;
};

// OBTENER PERFIL
export const getUserProfile = async () => {
  const response = await apiClient.get("/users/me");
  return response.data;
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("token_type");
};

// REGISTRO USUARIO GUEST
export const register = async (userData) => {
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
};