<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";


const router = useRouter();
const reservas = ref([]);

// Simulación de datos (luego esto vendrá del backend)
onMounted(() => {
  reservas.value = [
    {
      id: 1,
      fecha: "2026-03-10",
      destino: "Amazonas",
      evento: "Tour ecológico",
      personas: 4,
      total: 800000,
      estado: "pendiente",
    },
    {
      id: 2,
      fecha: "2026-04-15",
      destino: "Putumayo",
      evento: "Caminata natural",
      personas: 2,
      total: 400000,
      estado: "pagada",
    },
  ];
});

// Métodos
function editarReserva(id) {
  router.push(`/editar-reserva/${id}`);
}

function eliminarReserva(id) {
  reservas.value = reservas.value.filter(r => r.id !== id);
}

function pagarReserva(id) {
  const reserva = reservas.value.find(r => r.id === id);
  if (reserva) reserva.estado = "pagada";
}

// Color del estado
function claseEstado(estado) {
  if (estado === "pendiente") return "badge bg-warning";
  if (estado === "pagada") return "badge bg-success";
  if (estado === "cancelada") return "badge bg-danger";
  return "badge bg-secondary";
}
</script>

<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">Mis Reservas</h2>

    <div v-if="reservas.length === 0" class="text-center">
      <p>No tienes reservas registradas.</p>
    </div>

    <div class="row">
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
              <strong>Total:</strong> ${{ reserva.total }}
            </p>

            <span :class="claseEstado(reserva.estado)">
              {{ reserva.estado }}
            </span>

            <div class="mt-3 d-flex gap-2">
              <button
                class="btn btn-primary btn-sm"
                v-if="reserva.estado === 'pendiente'"
                @click="editarReserva(reserva.id)"
              >
                Editar
              </button>

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
                Pagar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>