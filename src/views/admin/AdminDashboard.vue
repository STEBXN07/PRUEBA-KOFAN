<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getAllReservas } from '@/services/reservaService'

const router = useRouter()
const authStore = useAuthStore()
const reservas = ref([])
const loaded = ref(false)

/**
 * Mapea el estado del backend al vocabulario del frontend.
 * Backend usa "confirmado" y "expirada"; frontend usa "confirmada" y "cancelada".
 */
const mapEstado = (estado) => {
  const mapa = { confirmado: 'confirmada', expirada: 'cancelada' }
  return mapa[estado] || estado
}

onMounted(async () => {
  try {
    const data = await getAllReservas()
    reservas.value = data.map(r => ({ ...r, estado: mapEstado(r.estado) }))
  } catch {
    reservas.value = []
  }
  setTimeout(() => { loaded.value = true }, 100)
})

const totalReservas = computed(() => reservas.value.length)
const reservasPendientes = computed(() =>
  reservas.value.filter(r => r.estado === 'pendiente').length
)
const reservasConfirmadas = computed(() =>
  reservas.value.filter(r => r.estado === 'confirmada').length
)
const reservasCanceladas = computed(() =>
  reservas.value.filter(r => r.estado === 'cancelada').length
)

const reservasRecientes = computed(() =>
  [...reservas.value]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)
)

const porcentajeConfirmadas = computed(() => {
  if (totalReservas.value === 0) return 0
  return Math.round((reservasConfirmadas.value / totalReservas.value) * 100)
})

const irAReservas = () => {
  router.push('/admin/reservas')
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

const getBadgeClass = (estado) => {
  const clases = {
    pendiente: 'status-pendiente',
    confirmada: 'status-confirmada',
    cancelada: 'status-cancelada'
  }
  return clases[estado] || 'status-default'
}

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos dias'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
})
</script>

<template>
  <div class="dash" :class="{ loaded }">
    <!-- Welcome -->
    <div class="welcome-banner">
      <div class="welcome-content">
        <div class="welcome-text">
          <span class="welcome-greeting">{{ greeting }},</span>
          <h1 class="welcome-name">{{ authStore.user?.names || authStore.user?.surnames || 'Administrador' }}</h1>
          <p class="welcome-subtitle">Aqui tienes un resumen de las reservas de tu ecohotel.</p>
        </div>
        <div class="welcome-decoration d-none d-lg-block">
          <div class="deco-circle deco-1"></div>
          <div class="deco-circle deco-2"></div>
          <div class="deco-circle deco-3"></div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card stat-total" @click="irAReservas" role="button" style="--delay: 0.1s">
        <div class="stat-icon-wrap">
          <div class="stat-icon">
            <i class="bi bi-calendar2-week"></i>
          </div>
        </div>
        <div class="stat-data">
          <span class="stat-number">{{ totalReservas }}</span>
          <span class="stat-label">Total Reservas</span>
        </div>
        <div class="stat-corner">
          <i class="bi bi-arrow-up-right"></i>
        </div>
      </div>

      <div class="stat-card stat-pending" @click="irAReservas" role="button" style="--delay: 0.2s">
        <div class="stat-icon-wrap">
          <div class="stat-icon">
            <i class="bi bi-clock-history"></i>
          </div>
        </div>
        <div class="stat-data">
          <span class="stat-number">{{ reservasPendientes }}</span>
          <span class="stat-label">Pendientes</span>
        </div>
        <div class="stat-corner">
          <i class="bi bi-arrow-up-right"></i>
        </div>
      </div>

      <div class="stat-card stat-confirmed" @click="irAReservas" role="button" style="--delay: 0.3s">
        <div class="stat-icon-wrap">
          <div class="stat-icon">
            <i class="bi bi-check2-circle"></i>
          </div>
        </div>
        <div class="stat-data">
          <span class="stat-number">{{ reservasConfirmadas }}</span>
          <span class="stat-label">Confirmadas</span>
        </div>
        <div class="stat-corner">
          <i class="bi bi-arrow-up-right"></i>
        </div>
      </div>

      <div class="stat-card stat-cancelled" @click="irAReservas" role="button" style="--delay: 0.4s">
        <div class="stat-icon-wrap">
          <div class="stat-icon">
            <i class="bi bi-x-octagon"></i>
          </div>
        </div>
        <div class="stat-data">
          <span class="stat-number">{{ reservasCanceladas }}</span>
          <span class="stat-label">Canceladas</span>
        </div>
        <div class="stat-corner">
          <i class="bi bi-arrow-up-right"></i>
        </div>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="row g-4 mt-1">
      <!-- Recent Reservations -->
      <div class="col-lg-8">
        <div class="content-card" style="--delay: 0.5s">
          <div class="card-top">
            <div>
              <h3 class="card-heading">Reservas Recientes</h3>
              <p class="card-subheading">Ultimas reservas registradas</p>
            </div>
            <button class="btn-view-all" @click="irAReservas">
              Ver todas <i class="bi bi-arrow-right ms-1"></i>
            </button>
          </div>

          <div v-if="reservasRecientes.length === 0" class="empty-state">
            <div class="empty-icon">
              <i class="bi bi-calendar-x"></i>
            </div>
            <p class="empty-title">Sin reservas</p>
            <p class="empty-desc">Aun no hay reservas registradas en el sistema.</p>
          </div>

          <div v-else class="reserva-list">
            <div
              v-for="reserva in reservasRecientes"
              :key="reserva.id"
              class="reserva-item"
              @click="irAReservas"
              role="button"
            >
              <div class="reserva-avatar" :class="getBadgeClass(reserva.estado)">
                {{ getInitials(reserva) }}
              </div>
              <div class="reserva-info">
                <span class="reserva-name">{{ getNombreCliente(reserva) }}</span>
                <span class="reserva-detail">
                  {{ reserva.evento || 'Sin tipo' }} &middot; {{ reserva.personas }} personas
                </span>
              </div>
              <div class="reserva-meta">
                <span class="reserva-date">{{ formatearFecha(reserva.fecha) }}</span>
                <span class="reserva-status" :class="getBadgeClass(reserva.estado)">
                  {{ reserva.estado }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="col-lg-4">
        <div class="content-card" style="--delay: 0.6s">
          <div class="card-top">
            <div>
              <h3 class="card-heading">Tasa de Confirmacion</h3>
              <p class="card-subheading">Porcentaje de reservas confirmadas</p>
            </div>
          </div>

          <div class="rate-display">
            <div class="rate-circle">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" class="rate-track" />
                <circle
                  cx="60" cy="60" r="52"
                  class="rate-fill"
                  :style="{ strokeDashoffset: 327 - (327 * porcentajeConfirmadas / 100) }"
                />
              </svg>
              <div class="rate-value">
                <span class="rate-number">{{ porcentajeConfirmadas }}</span>
                <span class="rate-percent">%</span>
              </div>
            </div>
          </div>

          <div class="rate-legend">
            <div class="legend-item">
              <span class="legend-dot dot-confirmed"></span>
              <span class="legend-label">Confirmadas</span>
              <span class="legend-value">{{ reservasConfirmadas }}</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot dot-pending"></span>
              <span class="legend-label">Pendientes</span>
              <span class="legend-value">{{ reservasPendientes }}</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot dot-cancelled"></span>
              <span class="legend-label">Canceladas</span>
              <span class="legend-value">{{ reservasCanceladas }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════
   BASE
   ═══════════════════════════════════════════ */
.dash {
  font-family: 'DM Sans', sans-serif;
}

/* ═══════════════════════════════════════════
   WELCOME BANNER
   ═══════════════════════════════════════════ */
.welcome-banner {
  background: #264e36;
  border-radius: 20px;
  padding: 36px 40px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(12px);
  animation: slideUp 0.6s ease forwards;
}
.welcome-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}
.welcome-greeting {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 500;
}
.welcome-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.85rem;
  font-weight: 700;
  color: #fff;
  margin: 4px 0 8px;
}
.welcome-subtitle {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
}
.welcome-decoration {
  position: relative;
  width: 120px;
  height: 120px;
}
.deco-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.deco-1 { width: 120px; height: 120px; top: 0; left: 0; }
.deco-2 { width: 80px; height: 80px; top: 20px; left: 20px; border-color: rgba(197, 165, 90, 0.25); }
.deco-3 {
  width: 40px; height: 40px; top: 40px; left: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

/* ═══════════════════════════════════════════
   STATS CARDS
   ═══════════════════════════════════════════ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);
  opacity: 0;
  transform: translateY(16px);
}
.dash.loaded .stat-card {
  animation: slideUp 0.5s ease forwards;
  animation-delay: var(--delay);
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}
.stat-card:hover .stat-corner {
  opacity: 1;
  transform: translate(0, 0);
}
.stat-icon-wrap { flex-shrink: 0; }
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}
.stat-total .stat-icon {
  background: rgba(38, 78, 54, 0.08);
  color: #264e36;
}
.stat-pending .stat-icon {
  background: rgba(218, 165, 32, 0.1);
  color: #b8860b;
}
.stat-confirmed .stat-icon {
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.1), rgba(46, 125, 50, 0.04));
  color: #2e7d32;
}
.stat-cancelled .stat-icon {
  background: linear-gradient(135deg, rgba(192, 57, 43, 0.08), rgba(192, 57, 43, 0.03));
  color: #c0392b;
}
.stat-data {
  display: flex;
  flex-direction: column;
}
.stat-number {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c1810;
  line-height: 1;
}
.stat-label {
  font-size: 0.78rem;
  color: #999;
  margin-top: 4px;
  font-weight: 500;
}
.stat-corner {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 0.8rem;
  color: #999;
  opacity: 0;
  transform: translate(-4px, 4px);
  transition: all 0.3s;
}

/* ═══════════════════════════════════════════
   CONTENT CARDS
   ═══════════════════════════════════════════ */
.content-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  height: 100%;
  opacity: 0;
  transform: translateY(16px);
}
.dash.loaded .content-card {
  animation: slideUp 0.5s ease forwards;
  animation-delay: var(--delay);
}
.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}
.card-heading {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #2c1810;
  margin: 0;
}
.card-subheading {
  font-size: 0.78rem;
  color: #999;
  margin: 2px 0 0;
}
.btn-view-all {
  background: none;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding: 6px 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  color: #5d4037;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-view-all:hover {
  background: #5d4037;
  color: #fff;
  border-color: #5d4037;
}

/* ═══════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════ */
.empty-state {
  text-align: center;
  padding: 48px 20px;
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

/* ═══════════════════════════════════════════
   RESERVATION LIST
   ═══════════════════════════════════════════ */
.reserva-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.reserva-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.reserva-item:hover {
  background: #faf8f4;
}
.reserva-avatar {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: 0.5px;
}
.reserva-avatar.status-pendiente {
  background: rgba(218, 165, 32, 0.1);
  color: #b8860b;
}
.reserva-avatar.status-confirmada {
  background: rgba(46, 125, 50, 0.08);
  color: #2e7d32;
}
.reserva-avatar.status-cancelada {
  background: rgba(192, 57, 43, 0.06);
  color: #c0392b;
}
.reserva-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.reserva-name {
  font-weight: 600;
  font-size: 0.88rem;
  color: #2c1810;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.reserva-detail {
  font-size: 0.75rem;
  color: #999;
}
.reserva-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}
.reserva-date {
  font-size: 0.72rem;
  color: #999;
}
.reserva-status {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 3px 8px;
  border-radius: 6px;
}
.reserva-status.status-pendiente {
  background: rgba(218, 165, 32, 0.1);
  color: #b8860b;
}
.reserva-status.status-confirmada {
  background: rgba(46, 125, 50, 0.08);
  color: #2e7d32;
}
.reserva-status.status-cancelada {
  background: rgba(192, 57, 43, 0.06);
  color: #c0392b;
}

/* ═══════════════════════════════════════════
   RATE DISPLAY
   ═══════════════════════════════════════════ */
.rate-display {
  display: flex;
  justify-content: center;
  padding: 12px 0 28px;
}
.rate-circle {
  position: relative;
  width: 140px;
  height: 140px;
}
.rate-circle svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.rate-track {
  fill: none;
  stroke: #f0ece4;
  stroke-width: 8;
}
.rate-fill {
  fill: none;
  stroke: #2e7d32;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 327;
  transition: stroke-dashoffset 1s ease;
}
.rate-value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rate-number {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c1810;
  line-height: 1;
}
.rate-percent {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  color: #999;
  margin-top: 4px;
}
.rate-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 4px;
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 3px;
  flex-shrink: 0;
}
.dot-confirmed { background: #2e7d32; }
.dot-pending { background: #b8860b; }
.dot-cancelled { background: #c0392b; }
.legend-label {
  flex: 1;
  font-size: 0.82rem;
  color: #666;
}
.legend-value {
  font-weight: 600;
  font-size: 0.88rem;
  color: #2c1810;
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
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .welcome-banner {
    padding: 28px 24px;
  }
  .welcome-name {
    font-size: 1.5rem;
  }
}
@media (max-width: 575px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .welcome-banner {
    padding: 24px 20px;
  }
  .welcome-name {
    font-size: 1.3rem;
  }
  .content-card {
    padding: 20px 16px;
  }
}
</style>
