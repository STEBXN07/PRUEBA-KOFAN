// src/services/userService.js
import apiClient from "@/api/apiClient";

export const getAllUsers = async (page = 1, limit = 10) => {
  const response = await apiClient.get(`/users/?page=${page}&limit=${limit}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await apiClient.post("/users/", userData);
  return response.data;
};

export const updateUser = async (userData) => {
  const response = await apiClient.put("/users/", userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}`);
  return response.data;
};