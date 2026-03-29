import apiClient from "@/api/apiClient";

// Público
export const getRoomsPublic = async () => {
  const response = await apiClient.get("/rooms/public");
  return response.data;
};

export const getRoomDetailPublic = async (id) => {
  const response = await apiClient.get(`/rooms/public/${id}`);
  return response.data;
};

// Admin

export const getRoomsAdmin = async () => {
  const response = await apiClient.get("/rooms");
  return response.data;
};

export const createRoom = async (roomData) => {
  const response = await apiClient.post("/rooms/", roomData);
  return response.data;
};

export const updateRoom = async (id, roomData) => {
  const response = await apiClient.put(`/rooms/${id}`, roomData);
  return response.data;
};

export const deleteRoom = async (id) => {
  const response = await apiClient.delete(`/rooms/${id}`);
  return response.data;
};