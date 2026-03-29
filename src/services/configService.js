import apiClient from "@/api/apiClient";

export const fetchConfig = async () => {
    const response = await apiClient.get('/config');
    return response.data;
};

export const saveConfig = async (data) => {
    const response = await apiClient.put('/config', data);
    return response.data;
};

// función para el logo
export const uploadLogo = async (formData) => {
    const response = await apiClient.post('/config/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};