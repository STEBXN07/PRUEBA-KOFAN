import apiClient from '@/api/apiClient'

export async function listarClientes() {
  const response = await apiClient.get('/clientes/')
  return response.data
}

export async function obtenerCliente(clienteId) {
  const response = await apiClient.get(`/clientes/${clienteId}`)
  return response.data
}

export async function crearCliente(clienteData) {
  const response = await apiClient.post('/clientes/', clienteData)
  return response.data
}

export async function actualizarCliente(clienteId, clienteData) {
  const response = await apiClient.put(`/clientes/${clienteId}`, clienteData)
  return response.data
}

export async function eliminarCliente(clienteId) {
  const response = await apiClient.delete(`/clientes/${clienteId}`)
  return response.data
}
