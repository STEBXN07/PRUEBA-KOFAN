import apiClient from '@/api/apiClient'

export async function listarFacturas() {
  const response = await apiClient.get('/facturas/')
  return response.data
}

export async function obtenerFactura(id) {
  const response = await apiClient.get(`/facturas/${id}`)
  return response.data
}

export async function crearFactura(data) {
  const response = await apiClient.post('/facturas/', data)
  return response.data
}

export async function agregarPago(facturaId, pagoData) {
  const response = await apiClient.post(`/facturas/${facturaId}/pagos`, pagoData)
  return response.data
}

export async function actualizarEstadoPago(facturaId, pagoId, estado) {
  const response = await apiClient.put(`/facturas/${facturaId}/pagos/${pagoId}/estado`, { estado })
  return response.data
}
