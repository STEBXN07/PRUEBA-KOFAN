<script setup>
import { ref } from "vue";
import TheNarvar from '../components/TheNarvar.vue';
import MensajeConfirmacion from "../components/MensajeConfirmacion.vue";
import Footer from '@/components/Footer.vue';
import { useAuthStore } from '../stores/auth';
import { confirmarPago as confirmarPagoApi } from '@/services/reservaService';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const metodoSeleccionado = ref("");
const confirmado = ref(false);
const isProcessing = ref(false);

async function confirmarPago() {
  if (metodoSeleccionado.value === "") {
    Swal.fire({
      title: 'Atención',
      text: 'Por favor, selecciona un método de pago',
      icon: 'warning',
      confirmButtonColor: '#2e7d32'
    });
    return;
  }

  isProcessing.value = true;

  try {
    const reservaTemp = JSON.parse(localStorage.getItem("reservaTemp") || "null");
    const reservaId = localStorage.getItem("reservaBackendId") || reservaTemp?.id;

    if (reservaId) {
      await confirmarPagoApi(reservaId, metodoSeleccionado.value.toUpperCase());
    }

    confirmado.value = true;
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: error.response?.data?.detail || 'No se pudo confirmar el pago. Intenta de nuevo.',
      icon: 'error',
      confirmButtonColor: '#2e7d32'
    });
  } finally {
    isProcessing.value = false;
  }
}

function volver() {
  confirmado.value = false;
  metodoSeleccionado.value = "";
}
</script>

<template>
  <div style="background-color: var(--color-fondo-cafe);">
    <TheNarvar />
  </div>

    <main class="main-content d-flex justify-content-center align-items-center">

      <div v-if="!confirmado" class="form-card shadow">
        <h4 class="text-center mb-4" style="color: var(--verde); font-weight: bold;">
          Selecciona un método de pago
        </h4>

        <div class="opciones-pago">
          <div class="form-check mb-3 p-2 border rounded">
            <input class="form-check-input ms-1" type="radio" id="nequi" value="Nequi" v-model="metodoSeleccionado">
            <label class="form-check-label ms-4 w-100" for="nequi" style="cursor:pointer">Nequi</label>
          </div>

          <div class="form-check mb-3 p-2 border rounded">
            <input class="form-check-input ms-1" type="radio" id="bancolombia" value="Bancolombia" v-model="metodoSeleccionado">
            <label class="form-check-label ms-4 w-100" for="bancolombia" style="cursor:pointer">Bancolombia</label>
          </div>

          <div class="form-check mb-4 p-2 border rounded">
            <input class="form-check-input ms-1" type="radio" id="transfe" value="Transferencia" v-model="metodoSeleccionado">
            <label class="form-check-label ms-4 w-100" for="transfe" style="cursor:pointer">Transferencia Bancaria</label>
          </div>
        </div>

        <button class="btn  w-100 py-2 fw-bold" @click="confirmarPago" :disabled="isProcessing">
          {{ isProcessing ? 'Procesando...' : 'CONFIRMAR PAGO' }}
        </button>
      </div>

      <MensajeConfirmacion 
        v-else 
        :metodo="metodoSeleccionado" 
        @volver="volver" 
      />
    </main>

    <Footer />
  
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--gris-claro);
}

.main-content {
  flex: 1;
  padding: 50px 20px;
}

.form-card {
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  max-width: 420px;
  width: 100%;
}

.btn-verde {
  background-color: var(--verde) !important;
  color: white;
  border: none;
}
</style>