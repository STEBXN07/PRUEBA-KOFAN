<script setup>
import { ref } from "vue";


// Definimos el evento para avisarle al padre
const emit = defineEmits(['confirmar-pago-final']);
const metodo = ref(""); // Variable local para los radios

function enviarConfirmacion() {
  if (metodo.value === "") {
    alert("Por favor, selecciona un método de pago");
    return;
  }
  // Enviamos el valor al padre (ConfirmarPago)
  emit('confirmar-pago-final', metodo.value);
}
</script>

<template>
  <main class="main-content d-flex justify-content-center align-items-center">

  <div class="form-card shadow">
    <h4 class="text-center mb-4" style="color: var(--verde); font-weight: bold;">
      Selecciona un método de pago
    </h4>

    <div class="opciones-pago">

      <div class="form-check mb-3 p-2 border rounded item-metodo">
        <input class="form-check-input ms-1" type="radio" id="nequi" value="Nequi" v-model="metodo">
        <label class="form-check-label ms-4 w-100" for="nequi" style="cursor: pointer;">
          Nequi
        </label>
      </div>

      <div class="form-check mb-3 p-2 border rounded item-metodo">
        <input class="form-check-input ms-1" type="radio" id="bancolombia" value="Bancolombia" v-model="metodo">
        <label class="form-check-label ms-4 w-100" for="bancolombia" style="cursor: pointer;">
          Bancolombia
        </label>
      </div>

      <div class="form-check mb-4 p-2 border rounded item-metodo">
        <input class="form-check-input ms-1" type="radio" id="transferencia" value="Transferencia" v-model="metodo">
        <label class="form-check-label ms-4 w-100" for="transferencia" style="cursor: pointer;">
          Transferencia Bancaria
        </label>
      </div>
    </div>

    <button class="btn btn-verde w-100 py-2 fw-bold" @click="enviarConfirmacion">
      PAGAR AHORA
    </button>
  </div>

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

.item-metodo:hover {
  background-color: #f1f1f1;
}

.btn-verde {
  background-color: var(--verde) !important;
  color: white;
  border: none;
  transition: 0.3s;
}

.btn-verde:hover {
  background-color: #256428 !important;
  transform: translateY(-2px);
}

/* Estilo para que el radio button use el color verde de Kofán */
.form-check-input:checked {
  background-color: var(--verde);
  border-color: var(--verde);
}
</style>