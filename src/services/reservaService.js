import apiClient from '@/api/apiClient'

export async function crearReserva(reservaData) {
  const response = await apiClient.post('/eventos/reservar', reservaData)
  return response.data
}

export async function getOcupacion(salonId) {
  const response = await apiClient.get(`/eventos/ocupacion/${salonId}`)
  return response.data
}

export async function actualizarReserva(idReserva, reservaData) {
  const response = await apiClient.put(`/eventos/reservas/${idReserva}`, reservaData)
  return response.data
}

export async function confirmarPago(idReserva, metodoPago = 'TRANSFERENCIA') {
  const response = await apiClient.patch(`/eventos/reservas/${idReserva}/confirmar`, {
    metodo_pago: metodoPago
  })
  return response.data
}

export async function listarSalones() {
  const response = await apiClient.get('/eventos/listar-salones')
  return response.data
}

export async function getAllReservas() {
  const response = await apiClient.get('/eventos/admin/reservas')
  return response.data
}

export async function eliminarReserva(idReserva) {
  const response = await apiClient.delete(`/eventos/reservas/${idReserva}`)
  return response.data
}

export async function getMisReservas() {
  const response = await apiClient.get('/eventos/mis-reservas')
  return response.data
}