<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import TheNarvar from '@/components/TheNarvar.vue';
import Footer from '@/components/Footer.vue';
import { getMisReservas, confirmarPago, eliminarReserva as apiEliminarReserva } from '@/services/reservaService'
import Swal from 'sweetalert2'

const router = useRouter();
const reservas = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    // Obtener solo las reservas del usuario autenticado
    const misReservas = await getMisReservas()

    reservas.value = misReservas.map(r => ({
      id: r.id,
      destino: r.destino || r.salon_id,
      fecha: r.fecha || r.fecha_inicio?.split('T')[0] || '-',
      evento: r.evento || r.nombre_evento || 'Evento',
      estado: r.estado || 'pendiente',
      personas: r.personas || '-',
      total: r.total || '-'
    }))
  } catch {
    // Si falla la conexion al backend, cargar datos locales como fallback
    const local = JSON.parse(localStorage.getItem("reservaTemp") || "null")
    if (local) {
      reservas.value = [{
        id: 1,
        fecha: local.fecha,
        destino: local.destino,
        evento: local.evento,
        personas: local.personas,
        total: local.total,
        estado: "pendiente"
      }]
    }
  } finally {
    loading.value = false
  }
});

async function eliminarReserva(id) {
  try {
    await apiEliminarReserva(id)
    reservas.value = reservas.value.filter(r => r.id !== id)
    Swal.fire({
      title: 'Reserva eliminada',
      text: 'La reserva se ha eliminado correctamente.',
      icon: 'success',
      confirmButtonColor: '#2e7d32'
    })
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.detail || 'No se pudo eliminar la reserva.',
      icon: 'error',
      confirmButtonColor: '#2e7d32'
    })
  }
}

async function pagarReserva(id) {
  try {
    await confirmarPago(id)
    const reserva = reservas.value.find(r => r.id === id)
    if (reserva) reserva.estado = "confirmado"
    Swal.fire({
      title: 'Pago confirmado',
      text: 'La reserva ha sido confirmada exitosamente.',
      icon: 'success',
      confirmButtonColor: '#2e7d32'
    })
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.detail || 'No se pudo confirmar el pago.',
      icon: 'error',
      confirmButtonColor: '#2e7d32'
    })
  }
}

function claseEstado(estado) {
  if (estado === "pendiente") return "badge bg-warning";
  if (estado === "confirmado") return "badge bg-success";
  if (estado === "cancelada") return "badge bg-danger";
  if (estado === "expirada") return "badge bg-secondary";
  return "badge bg-secondary";
}
</script>

<template>
  <div class="misreservas-page">
  <div style="background-color: var(--color-fondo-cafe);">
    <TheNarvar />
  </div>

  <div class="container mt-5 misreservas-content">
    <h2 class="mb-4 text-center">Mis Reservas</h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-muted">Cargando reservas...</p>
    </div>

    <div v-else-if="reservas.length === 0" class="text-center">
      <p>No tienes reservas registradas.</p>
      <button class="btn btn-success" @click="$router.push('/reservar')">
        Crear una reserva
      </button>
    </div>

    <div v-else class="row">
      <div
        class="col-md-6 mb-4"
        v-for="reserva in reservas"
        :key="reserva.id"
      >
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ reserva.destino }}</h5>
            <p class="card-text">
              <strong>Fecha:</strong> {{ reserva.fecha }} <br />
              <strong>Evento:</strong> {{ reserva.evento }} <br />
              <strong>Personas:</strong> {{ reserva.personas }} <br />
              <strong>Total:</strong> {{ reserva.total !== '-' ? '$' + reserva.total : '-' }}
            </p>

            <span :class="claseEstado(reserva.estado)">
              {{ reserva.estado }}
            </span>

            <div class="mt-3 d-flex gap-2">
              <button
                class="btn btn-danger btn-sm"
                v-if="reserva.estado === 'pendiente'"
                @click="eliminarReserva(reserva.id)"
              >
                Eliminar
              </button>

              <button
                class="btn btn-success btn-sm"
                v-if="reserva.estado === 'pendiente'"
                @click="pagarReserva(reserva.id)"
              >
                Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer />
  </div>
</template>

<style scoped>
.misreservas-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.misreservas-content {
  flex: 1;
}
</style>
