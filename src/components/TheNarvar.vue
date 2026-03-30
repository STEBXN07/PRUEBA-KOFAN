<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth' // Importamos tu store

const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  // Aquí podrías redirigir a '/' si quieres
}

</script>

<template>
<nav class="navbar navbar-expand-lg navbar-dark pt-3 px-4">
    <RouterLink class="navbar-brand text-uppercase fw-bold" to="/">Ecohotel Kofán</RouterLink>
    
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto align-items-center">
        <li class="nav-item">
            <RouterLink class="nav-link" to="/">Inicio</RouterLink>
        </li>
        <li class="nav-item">
            <RouterLink class="nav-link" to="/eventos">Eventos</RouterLink>
        </li>

        <template v-if="!authStore.isLogged">
          <li class="nav-item">
              <RouterLink class="nav-link" to="/login">Iniciar Sesión</RouterLink>
          </li>
          <li class="nav-item">
              <RouterLink class="nav-link" to="/register">Registrarse</RouterLink>
          </li>
        </template>

        <template v-else>
          <li class="nav-item">
<span class="nav-link text-white fw-bold">
  HOLA, {{ authStore.user?.nombre?.toUpperCase() || 'USUARIO' }}
</span>          </li>
          <li class="nav-item">
              <RouterLink class="nav-link" to="/reservar">Reservar Ahora</RouterLink>
          </li>
          <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="logout">Salir</a>
          </li>
        </template>
      </ul>
    </div>
</nav>
</template>

<style scoped>
/* Forzamos el Navbar para que sea oscuro/transparente */
nav, .navbar {
  background-color: rgba(30, 40, 30, 0.9) !important; /* Un verde súper oscuro casi negro */
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

/* Arreglamos las letras azules por blancas/doradas */
nav a, .navbar-brand {
  color: #f1ebd9 !important; /* Color hueso/dorado */
  text-decoration: none !important;
}

nav a:hover {
  color: #d4af37 !important; /* Dorado al pasar el mouse */
}

</style>