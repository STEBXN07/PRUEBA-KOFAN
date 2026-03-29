import apiClient from "@/api/apiClient";

// src/services/configService.js

// Función temporal simulando la respuesta de FastAPI
export const fetchConfig = async () => {
  return {
    hotel_name: "Ecohotel Kofán",
    logo_url: "/logo.svg", // Asegúrate que este archivo exista en tu carpeta /public
    menu: [
      { title: "Inicio", path: "/" },
      { title: "Eventos", path: "/eventos" },
      { title: "Reservar Ahora", path: "/reservar" }
    ],
    social_networks: [
      { name: "Facebook", url: "#", icon: "bi-facebook" },
      { name: "Instagram", url: "#", icon: "bi-instagram" }
    ],
    // Datos del footer
    address: "Villagarzón, Putumayo",
    phone: "+57 3xx xxx xxxx",
    email: "contacto@kofan.com",
    nit: "---",
    check_in_time: "15:00",
    check_out_time: "11:00",
    google_maps_embed: "https://www.google.com/maps/embed?pb=..." // URL del mapa
  };
}

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