<script setup>
defineProps({
  metodo: String
});
defineEmits(["volver"]);
</script>

<template>
  <div class="confirm-card animate-fade-in">

    <div class="icon-check animate-pop">
      ✓
    </div>

    <h4 class="text-success fw-bold mt-2">
      ¡Pago confirmado con éxito!
    </h4>

    <p class="mt-2">
      Has pagado con <span class="fw-bold text-primary">{{ metodo }}</span>.
    </p>

    <p class="text-muted small">
      Recibirás un correo con los detalles de tu reserva.
    </p>

    <button class="btn btn-success px-4 mt-3" @click="$emit('volver')">
      Volver al inicio
    </button>

  </div>
</template>

<style scoped>
/* Contenedor elegante */
.confirm-card {
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  max-width: 420px;
  margin: 40px auto;
}

/* Icono grande */
.icon-check {
  width: 70px;
  height: 70px;
  background: #28a745;
  color: white;
  font-size: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

/* Animación de aparición */
.animate-fade-in {
  animation: fadeIn 0.7s ease-in-out;
}

/* Animación del icono */
.animate-pop {
  animation: pop 0.4s ease-out;
}

/* Keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pop {
  0% {
    transform: scale(0.5);
  }
  80% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
