import apiClient from '@/api/apiClient';

export const getImages = async () => {
    try {
        const response = await apiClient.get('/gallery');
        return response.data;
    } catch (error) {
        console.error('Error al importar las imágenes de la galería:', error);
        throw error;
    }
};

export const uploadImage = async (formData) => { // Recibe directamente el formData
    try {
        const response = await apiClient.post('/gallery', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al subir la imagen a la galería:', error);
        throw error;
    }
};

export const deleteImage = async (imageId) => {
    try {
        await apiClient.delete(`/gallery/${imageId}`);
    } catch (error) {
        console.error('Error al eliminar la imagen de la galería:', error);
        throw error;
    }
};