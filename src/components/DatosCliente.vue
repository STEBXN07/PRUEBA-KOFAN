<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["update:modelValue"]);

// Copia reactiva
const cliente = reactive({ ...props.modelValue });

// Emitir cambios al padre
watch(cliente, (newVal) => {
  emit("update:modelValue", { ...newVal });
}, { deep: true });
</script>

<template>
  <div>
    <div class="mb-3">
      <label class="form-label">Nombre</label>
      <input
        type="text"
        class="form-control"
        v-model="cliente.nombre"
        placeholder="Ingresa tu nombre"
      />
    </div>

    <div class="mb-3">
      <label class="form-label">Teléfono</label>
      <input
        type="text"
        class="form-control"
        v-model="cliente.telefono"
        placeholder="Ingresa tu teléfono"
      />
    </div>
  </div>
</template>