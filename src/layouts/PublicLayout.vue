<script setup>
import { ref, onMounted } from 'vue';
import { fetchConfig } from '@/services/configService'; 
import { useAuthStore } from '@/stores/auth'; // Si usas auth
import { RouterView, RouterLink } from 'vue-router';

const authStore = useAuthStore();
const site = ref({});
const isLoading = ref(true);

const base = import.meta.env.VITE_BACKEND_URL;

onMounted(async () => {
  try {
    site.value = await fetchConfig();
  } catch (error) {
    console.error("Error al cargar configuración global", error);
    // Fallback por si acaso
    site.value = { hotel_name: "Ecohotel Kofán" };
  } finally {
    isLoading.value = false;
  }
});

const logout = () => {
  if(authStore) authStore.logout();
};
</script>

<template>
  <div class="d-flex flex-column min-vh-100 kofan-layout">
    
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm pt-2 pb-2 px-3 fixed-top">
      <div class="container-fluid">
        <RouterLink class="navbar-brand d-flex align-items-center" to="/">
          <img src="@/assets/img/kofan-logo-overlay.png" alt="Logo" width="50" class="me-6 rounded-circle">
          <span class="fw-bold fs-5 tracking-tight"> {{ site.hotel_name || 'Cargando...' }}</span>
        </RouterLink>
        
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-center text-uppercase fs-7 pt-lg-0 pt-3">
            
            <li v-for="item in site.menu" :key="item.path" class="nav-item">
              <router-link class="nav-link px-3" :to="item.path">{{ item.title }}</router-link>
            </li>

            <template v-if="authStore && !authStore.isLogged">
              <li class="nav-item">
                <RouterLink class="nav-link px-3" to="/auth/login">Ingresar</RouterLink>
              </li>
              <li class="nav-item ms-lg-2 mt-lg-0 mt-2">
                <RouterLink to="/auth/register" class="btn btn-outline-light btn-sm px-4 rounded-pill fs-8">Registrarse</RouterLink>
              </li>
            </template>

            <template v-else-if="authStore">
              <li class="nav-item">
                <span class="nav-link text-white-50 fs-8 px-3 fw-bold">HOLA, {{ authStore.user?.nombre?.toUpperCase() || 'USUARIO' }}</span>
              </li>
              <li class="nav-item">
                <router-link class="nav-link px-3" to="/app/mis-reservas">Mis Reservas</router-link>
              </li>
              <li class="nav-item ms-lg-2 mt-lg-0 mt-2">
                <a href="#" @click.prevent="logout" class="btn btn-danger btn-sm px-3 rounded-pill fs-8">Salir</a>
              </li>
            </template>

          </ul>
        </div>
      </div>
    </nav>

    <main class="flex-grow-1 main-content-wrapper">
      <RouterView />
    </main>

    <footer class="bg-dark text-white pt-5 pb-3 mt-auto">
      <div class="container">
        <div class="row g-4 text-center text-md-start">
          
          <div class="col-md-4">
            <h5 class="fw-bold mb-3 text-warning-kofan">{{ site.hotel_name || 'Ecohotel Kofán' }}</h5>
            <p class="small text-white-50 mb-2">NIT: {{ site.nit || '---' }}</p>
            <p class="small text-white-50">Descubre un paraíso natural en Putumayo, donde el confort se une con la selva.</p>
            <div class="d-flex gap-3 mt-3 justify-content-center justify-content-md-start">
              <a v-for="social in site.social_networks" :key="social.name" :href="social.url" target="_blank" class="text-white fs-5 social-link">
                <i :class="['bi', social.icon]"></i>
              </a>
            </div>
          </div>

          <div class="col-md-3">
            <h5 class="fw-bold mb-3">Contacto</h5>
            <ul class="list-unstyled small text-white-50">
              <li class="mb-2 d-flex align-items-center justify-content-center justify-content-md-start">
                <i class="bi bi-geo-alt me-2 text-warning-kofan"></i>{{ site.address || 'Villagarzón' }}
              </li>
              <li class="mb-2"><i class="bi bi-telephone me-2 text-warning-kofan"></i>{{ site.phone || '---' }}</li>
              <li class="mb-2"><i class="bi bi-envelope me-2 text-warning-kofan"></i>{{ site.email || '---' }}</li>
              <li class="mt-3 fs-8"><small>In: {{ site.check_in_time }} | Out: {{ site.check_out_time }}</small></li>
            </ul>
          </div>

          <div class="col-md-5 ubicacion-col">
            <h5 class="fw-bold mb-3">Ubicación</h5>
            <div v-if="site.google_maps_embed" class="map-wrapper shadow-sm rounded overflow-hidden">
              <iframe :src="site.google_maps_embed" width="100%" height="180" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            </div>
            <div v-else class="text-center text-white-50 small bg-secondary rounded p-3 map-fallback">Mapa no disponible por ahora.</div>
          </div>

        </div>

        <hr class="my-4 border-secondary">
        <p class="text-center small mb-0 text-white-50">
          © {{ new Date().getFullYear() }} {{ site.hotel_name || 'Ecohotel Kofán' }}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  </div>
</template>
<style scoped>
.navbar{
  background-color: #8a7945 !important;
    border-color: #9f8f5b !important;
}

.navbar-kofan {
  background-color: #6f4e37 !important; /* FORZAMOS TU COLOR */
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}
.btn-ingresar {
  border: 1px solid white;
  color: white;
  border-radius: 20px;
  padding: 5px 20px;
}
.btn-ingresar:hover {
  background: white;
  color: #6f4e37 !important;
}
footer{
  background-color: #8a7945 !important;
    border-color: #9f8f5b !important;
}
</style>