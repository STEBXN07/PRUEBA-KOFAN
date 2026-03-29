<script setup>
// No necesita lógica por ahora
</script>

<template>
  <div class="min-vh-100 bg-light">
    <div class="container-fluid p-3">
      <h1 class="mb-4 text-center">Bienvenido a la sección de autenticación</h1>

       <!-- Fondo opcional -->
      <div class="auth-background"></div>

      <!-- Contenido -->
      <div class="auth-container">
        <router-view />
      </div>

    </div>
  </div>

   
</template>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  position: relative;
}

.auth-container {
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  z-index: 2;
}

.auth-background {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle at 20% 30%,
    rgba(13, 110, 253, 0.08),
    transparent 40%
  );
}
</style>