import apiClient from '@/api/apiClient'

export async function listarCotizaciones() {
  const response = await apiClient.get('/cotizaciones/')
  return response.data
}

export async function obtenerCotizacion(id) {
  const response = await apiClient.get(`/cotizaciones/${id}`)
  return response.data
}

export async function crearCotizacion(data) {
  const response = await apiClient.post('/cotizaciones/', data)
  return response.data
}

export async function crearCotizacionFormulario(data) {
  const response = await apiClient.post('/cotizaciones/formulario', data)
  return response.data
}

export async function actualizarCotizacion(id, data) {
  const response = await apiClient.put(`/cotizaciones/${id}`, data)
  return response.data
}

export async function eliminarCotizacion(id) {
  const response = await apiClient.delete(`/cotizaciones/${id}`)
  return response.data
}
