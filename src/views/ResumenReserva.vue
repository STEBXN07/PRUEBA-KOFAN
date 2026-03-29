<script setup>
import TheNarvar from '@/components/TheNarvar.vue'
import Footer from '@/components/Footer.vue'
import { ref, onMounted } from 'vue'

const reserva = ref({})

onMounted(() => {
  const datos = localStorage.getItem("reservaTemp")
  if (datos) {
    reserva.value = JSON.parse(datos)
  }
})
</script>

<template>
  <div class="page-wrapper">
    <div style="background-color: var(--color-fondo-cafe);">
      <TheNarvar/>
    </div>
    <div class="container py-5 flex-grow-1">
      <h1 class="text-center mb-4">Resumen de tu Reserva</h1>

      <div class="card shadow p-4">
        <p><strong>Destino:</strong> {{ reserva.destino }}</p>
        <p><strong>Fecha:</strong> {{ reserva.fecha }}</p>
        <p><strong>Cliente:</strong> {{ reserva.cliente?.nombreCompleto || reserva.cliente?.razonSocial }}</p>
        <p><strong>Teléfono:</strong> {{ reserva.cliente?.telefono }}</p>

        <hr>

        <h4>Total a pagar: $ {{ reserva.total }}</h4>
      </div>
      <div>
        <button class="btn btn-success mt-4" @click="$router.push('/reservar')">
          Volver al Formulario
          <i class="bi bi-arrow-left ms-2"></i>
        </button>
        <button class="btn btn-brown mt-4 ms-3" @click="$router.push('/confirmarpago')">
          Confirmar Reserva
          <i class="bi bi-check-lg ms-2"></i>
        </button>
          <button class="btn btn-secondary mt-4 ms-3" @click="$router.push('/misreservas')">
          Mis Reservas
          <i class="bi bi-arrow-left ms-2"></i>
        </button>
      </div>
    </div>
    <Footer />
  </div>
</template>
<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.btn-brown {
  background-color: #6f4e37 !important;
  border-color: #6f4e37 !important;
  color: white !important;
}
</style>