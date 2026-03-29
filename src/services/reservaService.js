import apiClient from '@/api/apiClient'

/**
 * Crear una reserva de evento.
 * POST /eventos/reservar
 */
export async function crearReserva(reservaData) {
  const response = await apiClient.post('/eventos/reservar', reservaData)
  return response.data
}

/**
 * Obtener ocupacion de un salon (incluye reservas del usuario).
 * GET /eventos/ocupacion/{salon_id}
 */
export async function getOcupacion(salonId) {
  const response = await apiClient.get(`/eventos/ocupacion/${salonId}`)
  return response.data
}

/**
 * Actualizar una reserva existente.
 * PUT /eventos/reservas/{id_reserva}
 */
export async function actualizarReserva(idReserva, reservaData) {
  const response = await apiClient.put(`/eventos/reservas/${idReserva}`, reservaData)
  return response.data
}

/**
 * Confirmar pago de una reserva.
 * PATCH /eventos/reservas/{id_reserva}/confirmar
 */
export async function confirmarPago(idReserva, metodoPago = 'TRANSFERENCIA') {
  const response = await apiClient.patch(`/eventos/reservas/${idReserva}/confirmar`, {
    metodo_pago: metodoPago
  })
  return response.data
}

/**
 * Listar salones disponibles.
 * GET /eventos/listar-salones
 */
export async function listarSalones() {
  const response = await apiClient.get('/eventos/listar-salones')
  return response.data
}

/**
 * Obtener todas las reservas (panel admin).
 * GET /eventos/admin/reservas
 */
export async function getAllReservas() {
  const response = await apiClient.get('/eventos/admin/reservas')
  return response.data
}

/**
 * Cambiar el estado de una reserva.
 * PATCH /eventos/reservas/{id}/estado
 */
export async function cambiarEstadoReserva(idReserva, estado) {
  const response = await apiClient.patch(`/eventos/reservas/${idReserva}/estado`, { estado })
  return response.data
}

/**
 * Eliminar una reserva.
 * DELETE /eventos/reservas/{id}
 */
export async function eliminarReserva(idReserva) {
  const response = await apiClient.delete(`/eventos/reservas/${idReserva}`)
  return response.data
}

/**
 * Obtener reservas del usuario autenticado.
 * GET /eventos/mis-reservas
 */
export async function getMisReservas() {
  const response = await apiClient.get('/eventos/mis-reservas')
  return response.data
}
