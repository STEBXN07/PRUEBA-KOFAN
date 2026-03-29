<script setup>
import { ref, onMounted } from 'vue'

const cotizacion = ref({
  destino: "",
  fecha: "",
  evento: "",
  personas: 0,
  cliente: { nombre: "", telefono: "" },
  elementos: [],
  total: 0
})

onMounted(() => {
  const datos = localStorage.getItem("cotizacionTemp")
  if (datos) {
    cotizacion.value = JSON.parse(datos)
  }
})

function imprimir() {
  window.print()
}
</script>

<template>
  <div class="container py-5">
    <div class="card shadow p-4">

      <h2 class="text-center mb-4">Cotización KOFAN</h2>

      <p><strong>Cliente:</strong> {{ cotizacion.cliente.nombre }}</p>
      <p><strong>Teléfono:</strong> {{ cotizacion.cliente.telefono }}</p>
      <p><strong>Destino:</strong> {{ cotizacion.destino }}</p>
      <p><strong>Fecha:</strong> {{ cotizacion.fecha }}</p>
      <p><strong>Evento:</strong> {{ cotizacion.evento }}</p>
      <p><strong>Personas:</strong> {{ cotizacion.personas }}</p>

      <hr>

      <h4>Total estimado: $ {{ cotizacion.total }}</h4>

      <div class="mt-4 d-flex gap-3">
        <button class="btn btn-brown" @click="imprimir">
          Imprimir / Descargar PDF
        </button>

        <button class="btn btn-success" @click="$router.push('/reservar')">
          Volver
        </button>
      </div>
    </div>
  
  </div>
</template>