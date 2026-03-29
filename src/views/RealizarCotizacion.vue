<script setup>
import TheNarvar from '@/components/TheNarvar.vue'
import { ref, computed, onMounted } from 'vue'
import Footer from '@/components/Footer.vue'

const cotizacion = ref({
  destino: "",
  fecha: "",
  evento: "",
  personas: 0,
  cliente: {},
  elementos: [],
  total: 0
})

onMounted(() => {
  const datos = localStorage.getItem("cotizacionTemp")
  if (datos) {
    cotizacion.value = JSON.parse(datos)
  }
})

const nombreCliente = computed(() => {
  const c = cotizacion.value.cliente
  if (!c) return 'Sin nombre'
  if (c.tipoPersona === 'juridica') return c.razonSocial || 'Sin nombre'
  return c.nombreCompleto || 'Sin nombre'
})

const formatTotal = computed(() => {
  const num = parseInt(cotizacion.value.total)
  if (isNaN(num)) return cotizacion.value.total
  return num.toLocaleString('es-CO')
})

function imprimir() {
  window.print()
}
</script>

<template>
<div style="background-color: var(--color-fondo-cafe);">
    <TheNarvar />
  </div>
  <div class="container py-5">
    <div class="card shadow p-4">

      <h2 class="text-center mb-4">Cotización KOFAN</h2>

      <p><strong>Cliente:</strong> {{ nombreCliente }}</p>
      <p v-if="cotizacion.cliente?.cedula"><strong>Cédula:</strong> {{ cotizacion.cliente.cedula }}</p>
      <p v-if="cotizacion.cliente?.nit"><strong>NIT:</strong> {{ cotizacion.cliente.nit }}</p>
      <p><strong>Email:</strong> {{ cotizacion.cliente?.email }}</p>
      <p><strong>Teléfono:</strong> {{ cotizacion.cliente?.telefono }}</p>
      <p><strong>Destino:</strong> {{ cotizacion.destino }}</p>
      <p><strong>Fecha:</strong> {{ cotizacion.fecha }}</p>
      <p><strong>Evento:</strong> {{ cotizacion.evento }}</p>
      <p><strong>Personas:</strong> {{ cotizacion.personas }}</p>
      <p v-if="cotizacion.elementos?.length"><strong>Elementos:</strong> {{ cotizacion.elementos.join(', ') }}</p>

      <hr>

      <h4>Total estimado: $ {{ formatTotal }}</h4>

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
  <Footer />

</template>