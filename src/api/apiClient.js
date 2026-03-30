import axios from "axios";
import apiClient from '@/api/apiClient'

export const enviarReserva = async (datos) => {
  // Ajusta la ruta '/salones/reservar' según como la tengas en tu router de Python
    const response = await apiClient.post('/salones/reservar', datos)
    return response.data
}
const base = import.meta.env.VITE_BACKEND_URL;

const apiClient = axios.create({
    baseURL: base,
    headers: {
        'Content-Type': 'application/json',
    },})
//Agregar un interceptor para agregar el token de autenticacion a cada solicitud
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const tokenType = localStorage.getItem('token_type');
    if (token && tokenType) {
        config.headers['Authorization'] = `${tokenType} ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;