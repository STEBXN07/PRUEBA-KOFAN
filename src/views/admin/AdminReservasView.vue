<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import {
  getAllReservas,
  cambiarEstadoReserva as apiCambiarEstado,
  eliminarReserva as apiEliminarReserva
} from '@/services/reservaService'

const reservas = ref([])
const busqueda = ref('')
const filtroEstado = ref('')
const reservaSeleccionada = ref(null)
const mostrarModal = ref(false)
const loaded = ref(false)

/**
 * Mapea el estado del backend al vocabulario del frontend.
 * Backend usa "confirmado" y "expirada"; frontend usa "confirmada" y "cancelada".
 */
const mapEstado = (estado) => {
  const mapa = { confirmado: 'confirmada', expirada: 'cancelada' }
  return mapa[estado] || estado
}

/**
 * Mapea el estado del frontend al vocabulario del backend.
 */
const mapEstadoToBackend = (estado) => {
  const mapa = { confirmada: 'confirmado', cancelada: 'expirada' }
  return mapa[estado] || estado
}

onMounted(async () => {
  await cargarReservas()
  setTimeout(() => { loaded.value = true }, 100)
})

const cargarReservas = async () => {
  try {
    const data = await getAllReservas()
    reservas.value = data.map(r => ({ ...r, estado: mapEstado(r.estado) }))
  } catch {
    reservas.value = []
  }
}

const reservasFiltradas = computed(() => {
  let resultado = [...reservas.value]

  if (filtroEstado.value) {
    resultado = resultado.filter(r => r.estado === filtroEstado.value)
  }

  if (busqueda.value.trim()) {
    const termino = busqueda.value.toLowerCase().trim()
    resultado = resultado.filter(r => {
      const nombre = getNombreCliente(r).toLowerCase()
      const evento = (r.evento || '').toLowerCase()
      const id = String(r.id)
      return nombre.includes(termino) || evento.includes(termino) || id.includes(termino)
    })
  }

  resultado.sort((a, b) => b.id - a.id)
  return resultado
})

const getNombreCliente = (reserva) => {
  if (!reserva.cliente) return 'Sin nombre'
  if (reserva.cliente.tipoPersona === 'juridica') {
    return reserva.cliente.razonSocial || 'Sin nombre'
  }
  return reserva.cliente.nombreCompleto || 'Sin nombre'
}

const getInitials = (reserva) => {
  const nombre = getNombreCliente(reserva)
  return nombre.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha'
  const d = new Date(fecha + 'T00:00:00')
  return d.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatearTotal = (total) => {
  if (!total) return '$0'
  const numero = parseInt(total)
  if (isNaN(numero)) return total
  return '$' + numero.toLocaleString('es-CO')
}

const verDetalle = (reserva) => {
  reservaSeleccionada.value = reserva
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  reservaSeleccionada.value = null
}

const cambiarEstado = async (reserva, nuevoEstado) => {
  try {
    const estadoBackend = mapEstadoToBackend(nuevoEstado)
    await apiCambiarEstado(reserva.id, estadoBackend)

    const index = reservas.value.findIndex(r => r.id === reserva.id)
    if (index !== -1) {
      reservas.value[index].estado = nuevoEstado
    }

    Swal.fire({
      icon: 'success',
      title: 'Estado actualizado',
      text: `La reserva ahora esta "${nuevoEstado}".`,
      timer: 2000,
      showConfirmButton: false
    })
  } catch (error) {
    const msg = error.response?.data?.detail || 'Error al actualizar el estado'
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: msg,
      confirmButtonColor: '#2e7d32'
    })
  }
}

const eliminarReserva = (reserva) => {
  Swal.fire({
    title: 'Eliminar reserva',
    text: `¿Esta seguro de eliminar la reserva de ${getNombreCliente(reserva)}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#c0392b',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Si, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await apiEliminarReserva(reserva.id)
        reservas.value = reservas.value.filter(r => r.id !== reserva.id)

        Swal.fire({
          icon: 'success',
          title: 'Eliminada',
          text: 'La reserva ha sido eliminada correctamente.',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        const msg = error.response?.data?.detail || 'Error al eliminar la reserva'
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: msg,
          confirmButtonColor: '#2e7d32'
        })
      }
    }
  })
}

const contadorTotal = computed(() => reservas.value.length)
const contadorPendientes = computed(() => reservas.value.filter(r => r.estado === 'pendiente').length)
const contadorConfirmadas = computed(() => reservas.value.filter(r => r.estado === 'confirmada').length)
const contadorCanceladas = computed(() => reservas.value.filter(r => r.estado === 'cancelada').length)
</script>

<template>
  <div class="reservas-admin" :class="{ loaded }">
    <!-- Header -->
    <div class="page-header" style="--delay: 0s">
      <div>
        <h1 class="page-title">Gestion de Reservas</h1>
        <p class="page-subtitle">Administra, filtra y gestiona las reservas de eventos</p>
      </div>
      <div class="header-badge">
        <span class="badge-count">{{ contadorTotal }}</span>
        <span class="badge-label">Total</span>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs" style="--delay: 0.1s">
      <button
        class="filter-tab"
        :class="{ active: filtroEstado === '' }"
        @click="filtroEstado = ''"
      >
        <span class="tab-label">Todas</span>
        <span class="tab-count">{{ contadorTotal }}</span>
      </button>
      <button
        class="filter-tab tab-pending"
        :class="{ active: filtroEstado === 'pendiente' }"
        @click="filtroEstado = 'pendiente'"
      >
        <span class="tab-dot dot-pending"></span>
        <span class="tab-label">Pendientes</span>
        <span class="tab-count">{{ contadorPendientes }}</span>
      </button>
      <button
        class="filter-tab tab-confirmed"
        :class="{ active: filtroEstado === 'confirmada' }"
        @click="filtroEstado = 'confirmada'"
      >
        <span class="tab-dot dot-confirmed"></span>
        <span class="tab-label">Confirmadas</span>
        <span class="tab-count">{{ contadorConfirmadas }}</span>
      </button>
      <button
        class="filter-tab tab-cancelled"
        :class="{ active: filtroEstado === 'cancelada' }"
        @click="filtroEstado = 'cancelada'"
      >
        <span class="tab-dot dot-cancelled"></span>
        <span class="tab-label">Canceladas</span>
        <span class="tab-count">{{ contadorCanceladas }}</span>
      </button>
    </div>

    <!-- Search Bar -->
    <div class="search-bar" style="--delay: 0.15s">
      <div class="search-input-wrap">
        <i class="bi bi-search search-icon"></i>
        <input
          type="text"
          class="search-input"
          placeholder="Buscar por nombre, evento o ID..."
          v-model="busqueda"
        >
        <button
          v-if="busqueda"
          class="search-clear"
          @click="busqueda = ''"
        >
          <i class="bi bi-x"></i>
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="table-card" style="--delay: 0.2s">
      <!-- Empty -->
      <div v-if="reservasFiltradas.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-calendar-x"></i>
        </div>
        <p class="empty-title" v-if="reservas.length === 0">Sin reservas</p>
        <p class="empty-title" v-else>Sin resultados</p>
        <p class="empty-desc" v-if="reservas.length === 0">
          Aun no hay reservas registradas en el sistema.
        </p>
        <p class="empty-desc" v-else>
          No se encontraron reservas con los filtros aplicados.
        </p>
      </div>

      <!-- Table -->
      <div v-else class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Reserva</th>
              <th>Evento</th>
              <th>Fecha</th>
              <th class="text-center">Personas</th>
              <th class="text-end">Total</th>
              <th class="text-center">Estado</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reserva in reservasFiltradas" :key="reserva.id">
              <td>
                <div class="client-cell">
                  <div class="client-avatar" :class="'avatar-' + reserva.estado">
                    {{ getInitials(reserva) }}
                  </div>
                  <div class="client-info">
                    <span class="client-name">{{ getNombreCliente(reserva) }}</span>
                    <span class="client-email">{{ reserva.cliente?.email || 'Sin email' }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="event-type">{{ reserva.evento || 'Sin tipo' }}</span>
              </td>
              <td>
                <span class="date-cell">{{ formatearFecha(reserva.fecha) }}</span>
              </td>
              <td class="text-center">
                <span class="people-count">
                  <i class="bi bi-people me-1"></i>{{ reserva.personas }}
                </span>
              </td>
              <td class="text-end">
                <span class="total-cell">{{ formatearTotal(reserva.total) }}</span>
              </td>
              <td class="text-center">
                <span class="status-pill" :class="'pill-' + reserva.estado">
                  {{ reserva.estado }}
                </span>
              </td>
              <td class="text-center">
                <div class="action-group">
                  <button
                    class="action-btn action-view"
                    title="Ver detalle"
                    @click="verDetalle(reserva)"
                  >
                    <i class="bi bi-eye"></i>
                  </button>

                  <div class="dropdown">
                    <button
                      class="action-btn action-status"
                      data-bs-toggle="dropdown"
                      title="Cambiar estado"
                    >
                      <i class="bi bi-arrow-repeat"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end status-dropdown">
                      <li class="dropdown-header-label">Cambiar estado</li>
                      <li>
                        <button
                          class="dropdown-item status-option"
                          :class="{ current: reserva.estado === 'pendiente' }"
                          :disabled="reserva.estado === 'pendiente'"
                          @click="cambiarEstado(reserva, 'pendiente')"
                        >
                          <span class="option-dot dot-pending"></span>
                          Pendiente
                        </button>
                      </li>
                      <li>
                        <button
                          class="dropdown-item status-option"
                          :class="{ current: reserva.estado === 'confirmada' }"
                          :disabled="reserva.estado === 'confirmada'"
                          @click="cambiarEstado(reserva, 'confirmada')"
                        >
                          <span class="option-dot dot-confirmed"></span>
                          Confirmada
                        </button>
                      </li>
                      <li>
                        <button
                          class="dropdown-item status-option"
                          :class="{ current: reserva.estado === 'cancelada' }"
                          :disabled="reserva.estado === 'cancelada'"
                          @click="cambiarEstado(reserva, 'cancelada')"
                        >
                          <span class="option-dot dot-cancelled"></span>
                          Cancelada
                        </button>
                      </li>
                    </ul>
                  </div>

                  <button
                    class="action-btn action-delete"
                    title="Eliminar"
                    @click="eliminarReserva(reserva)"
                  >
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Detail Modal -->
    <Transition name="modal">
      <div
        v-if="mostrarModal && reservaSeleccionada"
        class="modal-overlay"
        @click.self="cerrarModal"
      >
        <div class="modal-panel">
          <!-- Modal Header -->
          <div class="modal-head">
            <div>
              <span class="modal-tag">Detalle de Reserva</span>
              <h2 class="modal-title">Reserva #{{ reservaSeleccionada.id }}</h2>
            </div>
            <button class="modal-close" @click="cerrarModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Status -->
          <div class="modal-status-bar">
            <span class="status-pill" :class="'pill-' + reservaSeleccionada.estado">
              {{ reservaSeleccionada.estado }}
            </span>
            <span class="modal-id">#{{ reservaSeleccionada.id }}</span>
          </div>

          <!-- Client Section -->
          <div class="modal-section">
            <div class="section-header">
              <i class="bi bi-person"></i>
              <span>Datos del Cliente</span>
            </div>
            <div class="section-grid">
              <div class="info-item">
                <span class="info-label">Tipo</span>
                <span class="info-value">
                  {{ reservaSeleccionada.cliente?.tipoPersona === 'juridica' ? 'Persona Juridica' : 'Persona Natural' }}
                </span>
              </div>
              <template v-if="reservaSeleccionada.cliente?.tipoPersona === 'juridica'">
                <div class="info-item">
                  <span class="info-label">Razon Social</span>
                  <span class="info-value">{{ reservaSeleccionada.cliente?.razonSocial }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">NIT</span>
                  <span class="info-value">{{ reservaSeleccionada.cliente?.nit }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Representante</span>
                  <span class="info-value">{{ reservaSeleccionada.cliente?.representanteLegal }}</span>
                </div>
              </template>
              <template v-else>
                <div class="info-item">
                  <span class="info-label">Nombre</span>
                  <span class="info-value">{{ reservaSeleccionada.cliente?.nombreCompleto }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Cedula</span>
                  <span class="info-value">{{ reservaSeleccionada.cliente?.cedula }}</span>
                </div>
              </template>
              <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">{{ reservaSeleccionada.cliente?.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Telefono</span>
                <span class="info-value">{{ reservaSeleccionada.cliente?.telefono }}</span>
              </div>
            </div>
          </div>

          <!-- Event Section -->
          <div class="modal-section">
            <div class="section-header">
              <i class="bi bi-calendar-event"></i>
              <span>Datos del Evento</span>
            </div>
            <div class="section-grid">
              <div class="info-item">
                <span class="info-label">Tipo de Evento</span>
                <span class="info-value">{{ reservaSeleccionada.evento }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Fecha</span>
                <span class="info-value">{{ formatearFecha(reservaSeleccionada.fecha) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Destino</span>
                <span class="info-value">{{ reservaSeleccionada.destino }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Personas</span>
                <span class="info-value">{{ reservaSeleccionada.personas }}</span>
              </div>
              <div class="info-item info-highlight">
                <span class="info-label">Total</span>
                <span class="info-value">{{ formatearTotal(reservaSeleccionada.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Section -->
          <div v-if="reservaSeleccionada.metodo_pago" class="modal-section">
            <div class="section-header">
              <i class="bi bi-credit-card"></i>
              <span>Metodo de Pago</span>
            </div>
            <div class="section-grid">
              <div class="info-item">
                <span class="info-label">Metodo</span>
                <span class="info-value pago-badge">
                  <i class="bi bi-check-circle-fill me-1" style="color: #2e7d32;"></i>
                  {{ reservaSeleccionada.metodo_pago }}
                </span>
              </div>
            </div>
          </div>

          <!-- Elements Section -->
          <div
            v-if="reservaSeleccionada.elementos && reservaSeleccionada.elementos.length > 0"
            class="modal-section"
          >
            <div class="section-header">
              <i class="bi bi-box-seam"></i>
              <span>Elementos Solicitados</span>
            </div>
            <div class="elements-wrap">
              <span
                v-for="elem in reservaSeleccionada.elementos"
                :key="elem"
                class="element-chip"
              >
                <i class="bi bi-check2 me-1"></i>{{ elem }}
              </span>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-foot">
            <button class="btn-modal-close" @click="cerrarModal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════
   BASE
   ═══════════════════════════════════════════ */
.reservas-admin {
  font-family: 'DM Sans', sans-serif;
}

/* ═══════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════ */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  opacity: 0;
  transform: translateY(12px);
}
.reservas-admin.loaded .page-header,
.reservas-admin.loaded .filter-tabs,
.reservas-admin.loaded .search-bar,
.reservas-admin.loaded .table-card {
  animation: slideUp 0.5s ease forwards;
  animation-delay: var(--delay);
}
.page-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c1810;
  margin: 0;
}
.page-subtitle {
  font-size: 0.85rem;
  color: #999;
  margin: 4px 0 0;
}
.header-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #264e36;
  padding: 12px 20px;
  border-radius: 14px;
  min-width: 72px;
}
.badge-count {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}
.badge-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 2px;
}

/* ═══════════════════════════════════════════
   FILTER TABS
   ═══════════════════════════════════════════ */
.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  opacity: 0;
  transform: translateY(12px);
  flex-wrap: wrap;
}
.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  background: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.25s;
}
.filter-tab:hover {
  border-color: rgba(0, 0, 0, 0.12);
  color: #2c1810;
}
.filter-tab.active {
  background: #264e36;
  border-color: #264e36;
  color: #fff;
}
.filter-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
.tab-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-pending { background: #b8860b; }
.dot-confirmed { background: #2e7d32; }
.dot-cancelled { background: #c0392b; }
.tab-count {
  background: rgba(0, 0, 0, 0.04);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
}

/* ═══════════════════════════════════════════
   SEARCH
   ═══════════════════════════════════════════ */
.search-bar {
  margin-bottom: 20px;
  opacity: 0;
  transform: translateY(12px);
}
.search-input-wrap {
  position: relative;
  max-width: 420px;
}
.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 0.88rem;
}
.search-input {
  width: 100%;
  padding: 11px 40px 11px 42px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  background: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  color: #2c1810;
  transition: all 0.2s;
  outline: none;
}
.search-input::placeholder {
  color: #bbb;
}
.search-input:focus {
  border-color: rgba(38, 78, 54, 0.4);
  box-shadow: 0 0 0 3px rgba(38, 78, 54, 0.08);
}
.search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px;
}

/* ═══════════════════════════════════════════
   TABLE CARD
   ═══════════════════════════════════════════ */
.table-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  overflow: hidden;
  opacity: 0;
  transform: translateY(12px);
}

/* Empty */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}
.empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: rgba(38, 78, 54, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 1.8rem;
  color: #264e36;
}
.empty-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: #2c1810;
  margin-bottom: 4px;
}
.empty-desc {
  font-size: 0.82rem;
  color: #999;
}

/* Table */
.admin-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.admin-table thead th {
  font-size: 0.72rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  background: #faf8f4;
}
.admin-table tbody tr {
  transition: background 0.15s;
}
.admin-table tbody tr:hover {
  background: #fdfcf9;
}
.admin-table tbody td {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  vertical-align: middle;
}

/* Client Cell */
.client-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.client-avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: 0.5px;
}
.avatar-pendiente {
  background: rgba(218, 165, 32, 0.1);
  color: #b8860b;
}
.avatar-confirmada {
  background: rgba(46, 125, 50, 0.08);
  color: #2e7d32;
}
.avatar-cancelada {
  background: rgba(192, 57, 43, 0.06);
  color: #c0392b;
}
.client-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.client-name {
  font-weight: 600;
  font-size: 0.88rem;
  color: #2c1810;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.client-email {
  font-size: 0.72rem;
  color: #999;
}
.event-type {
  font-size: 0.85rem;
  color: #555;
}
.date-cell {
  font-size: 0.85rem;
  color: #555;
}
.people-count {
  font-size: 0.82rem;
  color: #666;
}
.total-cell {
  font-weight: 700;
  font-size: 0.9rem;
  color: #2c1810;
}

/* Status Pill */
.status-pill {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 12px;
  border-radius: 8px;
}
.pill-pendiente {
  background: rgba(218, 165, 32, 0.1);
  color: #b8860b;
}
.pill-confirmada {
  background: rgba(46, 125, 50, 0.08);
  color: #2e7d32;
}
.pill-cancelada {
  background: rgba(192, 57, 43, 0.06);
  color: #c0392b;
}

/* Actions */
.action-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.action-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #888;
}
.action-view:hover {
  background: rgba(38, 78, 54, 0.06);
  border-color: rgba(38, 78, 54, 0.15);
  color: #264e36;
}
.action-status:hover {
  background: rgba(218, 165, 32, 0.06);
  border-color: rgba(218, 165, 32, 0.2);
  color: #b8860b;
}
.action-delete:hover {
  background: rgba(192, 57, 43, 0.04);
  border-color: rgba(192, 57, 43, 0.15);
  color: #c0392b;
}

/* Status Dropdown */
.status-dropdown {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 6px;
  min-width: 180px;
}
.dropdown-header-label {
  font-size: 0.68rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 8px 12px 4px;
}
.status-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
}
.status-option.current {
  opacity: 0.4;
}
.option-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ═══════════════════════════════════════════
   MODAL
   ═══════════════════════════════════════════ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 10, 5, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-panel {
  width: 100%;
  max-width: 640px;
  max-height: 88vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.15);
}
.modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 28px 28px 0;
}
.modal-tag {
  font-size: 0.68rem;
  font-weight: 600;
  color: #264e36;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}
.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c1810;
  margin: 4px 0 0;
}
.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.85rem;
  color: #999;
  transition: all 0.2s;
}
.modal-close:hover {
  background: #f5f2ec;
  color: #2c1810;
}
.modal-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 28px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}
.modal-id {
  font-size: 0.78rem;
  color: #999;
  font-weight: 500;
}

/* Modal Sections */
.modal-section {
  padding: 20px 28px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #2c1810;
  margin-bottom: 16px;
}
.section-header i {
  color: #264e36;
}
.section-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.info-label {
  font-size: 0.68rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.info-value {
  font-size: 0.9rem;
  color: #2c1810;
  font-weight: 500;
}
.info-highlight .info-value {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: #2e7d32;
}

/* Elements */
.elements-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.element-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  background: #f5f2ec;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 500;
  color: #555;
}

/* Modal Footer */
.modal-foot {
  padding: 20px 28px;
  display: flex;
  justify-content: flex-end;
}
.btn-modal-close {
  padding: 10px 24px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  background: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-modal-close:hover {
  background: #f5f2ec;
  border-color: rgba(0, 0, 0, 0.12);
}

/* ═══════════════════════════════════════════
   MODAL TRANSITION
   ═══════════════════════════════════════════ */
.modal-enter-active {
  transition: opacity 0.3s ease;
}
.modal-enter-active .modal-panel {
  animation: modalIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ═══════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════ */
@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ═══════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════ */
@media (max-width: 991px) {
  .section-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 575px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  .filter-tabs {
    gap: 6px;
  }
  .filter-tab {
    padding: 6px 12px;
    font-size: 0.75rem;
  }
  .modal-panel {
    border-radius: 16px 16px 0 0;
  }
  .modal-overlay {
    align-items: flex-end;
    padding: 0;
  }
  .modal-head,
  .modal-section,
  .modal-foot,
  .modal-status-bar {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
