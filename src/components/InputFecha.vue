<template>
  <div>
  <div class="form-group">
    <label for="fecha">Fecha de la reserva:</label>
    <input
      id="fecha"
      type="date"
      class="form-control"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      required
    />
  </div>
</div>
</template>

<script>
export default {
  name: "InputFecha",
  props: {
    modelValue: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
</style>

