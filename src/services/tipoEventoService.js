import apiClient from '@/api/apiClient'

export async function listarTiposEvento() {
  const response = await apiClient.get('/tipo-evento/')
  return response.data
}

export async function obtenerTipoEvento(id) {
  const response = await apiClient.get(`/tipo-evento/${id}`)
  return response.data
}
