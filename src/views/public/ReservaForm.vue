<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

//Datos del formulario
const fecha = ref("");
const destino = ref("");
const evento = ref("");
const personas = ref(1);
const elementos = ref([]);
const total = ref("150000");

const cliente = ref({
  tipoPersona: "",

  // Persona Natural
  nombreCompleto: "",
  cedula: "",

  // Persona Jurídica
  razonSocial: "",
  nit: "",
  representanteLegal: "",

  // Comunes
  telefono: "",
  email: ""
});

//cargar datos guardados al montar el componente
onMounted(() => {
  const datosGuardados = localStorage.getItem("reservaTemp");

  if (datosGuardados) {
    const reserva = JSON.parse(datosGuardados);

    fecha.value = reserva.fecha || "";
    destino.value = reserva.destino || "";
    evento.value = reserva.evento || "";
    personas.value = reserva.personas || 1;
    cliente.value = { ...cliente.value, ...(reserva.cliente || {}) };
    elementos.value = reserva.elementos || [];
    total.value = reserva.total || "150000";
  }
});

function enviarFormulario() {
  const reservaData = {
    fecha: fecha.value,
    destino: destino.value,
    evento: evento.value,
    personas: personas.value,
    cliente: cliente.value,
    elementos: elementos.value,
    total: total.value
  };

  localStorage.setItem("reservaTemp", JSON.stringify(reservaData));

  router.push("/resumen");
}

function irCotizacion() {
  const reservaData = {
    fecha: fecha.value,
    destino: destino.value,
    evento: evento.value,
    personas: personas.value,
    cliente: cliente.value,
    elementos: elementos.value,
    total: total.value
  };

  localStorage.setItem("cotizacionTemp", JSON.stringify(reservaData));

  router.push("/cotizacion");
}
</script>

<template>
  <main class="formulario-container my-5">
    <h2 class="text-center text-success mb-4">
      Formulario de Reserva de Eventos
    </h2>

    <div class="form-card p-4">
      <form @submit.prevent="enviarFormulario">
        <div class="row">
          <div class="col-lg-6 mb-4">
            <h4 class="text-success mb-3">Datos del Cliente</h4>

            <div class="mb-3">
              <label class="form-label">Tipo de Persona</label>
              <select class="form-select"
                      v-model="cliente.tipoPersona"
                      required>
                <option value="">Seleccione</option>
                <option value="natural">Persona Natural</option>
                <option value="juridica">Persona Jurídica</option>
              </select>
            </div>

            <!-- PERSONA NATURAL -->
            <div v-if="cliente.tipoPersona === 'natural'">

              <div class="mb-3">
                <label class="form-label">Nombre Completo</label>
                <input type="text"
                      class="form-control"
                      v-model="cliente.nombreCompleto"
                      required>
              </div>

              <div class="mb-3">
                <label class="form-label">Cédula</label>
                <input type="text"
                      class="form-control"
                      v-model="cliente.cedula"
                      required>
              </div>

            </div>

            <!-- PERSONA JURÍDICA -->
            <div v-if="cliente.tipoPersona === 'juridica'">

              <div class="mb-3">
                <label class="form-label">Razón Social</label>
                <input type="text"
                      class="form-control"
                      v-model="cliente.razonSocial"
                      required>
              </div>

              <div class="mb-3">
                <label class="form-label">NIT</label>
                <input type="text"
                      class="form-control"
                      v-model="cliente.nit"
                      required>
              </div>

              <div class="mb-3">
                <label class="form-label">Representante Legal</label>
                <input type="text"
                      class="form-control"
                      v-model="cliente.representanteLegal"
                      required>
              </div>

            </div>

            <!-- CAMPOS COMUNES -->
            <div class="mb-3">
              <label class="form-label">Correo Electrónico</label>
              <input type="email"
                    class="form-control"
                    v-model="cliente.email"
                    required>
            </div>

            <div class="mb-3">
              <label class="form-label">Teléfono</label>
              <input type="tel"
                    class="form-control"
                    v-model="cliente.telefono"
                    required>
            </div>

            <div class="mb-3">
              <label class="form-label">Dirección del Evento</label>
              <input type="text"
                    class="form-control"
                    v-model="destino"
                    required>
            </div>

          </div>
          <div class="col-lg-6 mb-4">
            <h4 class="text-success mb-3">Detalles del Evento</h4>

            <div class="mb-3">
              <label class="form-label">Cantidad de Personas</label>
              <input type="number"
                    class="form-control"
                    v-model="personas"
                    min="1"
                    required>
            </div>

            <div class="mb-3">
              <label class="form-label">Tipo de Evento</label>
              <select class="form-select"
                      v-model="evento"
                      required>
                <option value="">Seleccione una opción</option>
                <option>Reunión</option>
                <option>Boda</option>
                <option>Reunión Familiar</option>
                <option>Otro</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Elementos a utilizar</label>
              <div class="form-check"
                  v-for="e in ['Sillas','Mesas','Sonido','Proyector','Micrófono']"
                  :key="e">
                <input class="form-check-input"
                      type="checkbox"
                      :value="e"
                      v-model="elementos"
                      :id="e">
                <label class="form-check-label"
                      :for="e">
                  {{ e }}
                </label>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Fecha del Evento</label>
              <input type="date"
                    class="form-control"
                    v-model="fecha"
                    required>
            </div>

            <div class="d-flex justify-content-center mt-4">
              <button type="submit"
                      class="btn btn-success px-4">
                Reservar
              </button>

              <button type="button"
                      class="btn btn-brown"
                      @click="irCotizacion">
                Realizar Cotización
              </button>
            </div>

          </div>

        </div>
      </form>
      
    </div>
    
  </main>
</template>

<style scoped>
.btn-brown {
  background-color: #6f4e37;   /* Café principal */
  border-color: #6f4e37;
  color: white;
  margin-left: 15px;
}

.form-card {
  background-color: white;
  border-radius: 8px;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .form-card {
    padding: 1.5rem !important;
  }
}
</style>