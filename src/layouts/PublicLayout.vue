<script setup>
import { ref, onMounted } from 'vue';
import { fetchConfig } from '@/services/configService';

const site = ref({});
const isLoading = ref(true);

const base = import.meta.env.VITE_BACKEND_URL;

onMounted(async () => {
  try {
    site.value = await fetchConfig();
  } catch (error) {
    console.error("Error al cargar configuración global", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <img :src="`${base}${site.logo_url}`" alt="Logo" width="40" class="me-2">
          <span class="fw-bold">{{ site.hotel_name || 'Cargando...' }}</span>
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li v-for="item in site.menu" :key="item.path" class="nav-item">
              <router-link class="nav-link" :to="item.path">{{ item.title }}</router-link>
            </li>
            <li class="nav-item ms-lg-3">
              <router-link to="/login" class="btn btn-outline-light btn-sm px-4">Ingresar</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="flex-grow-1">
      <router-view />
    </main>

    <footer class="bg-dark text-white pt-5 pb-3 mt-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-4">
            <h5 class="fw-bold mb-3 text-primary">{{ site.hotel_name }}</h5>
            <p class="small text-muted mb-2">NIT: {{ site.nit }}</p>
            <p class="small text-muted">Disfruta de la mejor experiencia en Puerto Asís, conectando con la naturaleza y el confort.</p>
            <div class="d-flex gap-3 mt-3">
              <a v-for="social in site.social_networks" 
                 :key="social.name" 
                 :href="social.url" 
                 target="_blank"
                 class="text-white fs-5 hover-primary">
                <i :class="['bi', social.icon]"></i>
              </a>
            </div>
          </div>

          <div class="col-md-3">
            <h5 class="fw-bold mb-3">Contacto</h5>
            <ul class="list-unstyled small">
              <li class="mb-2 d-flex align-items-start">
                <i class="bi bi-geo-alt me-2 text-primary"></i>
                <span>{{ site.address }}</span>
              </li>
              <li class="mb-2">
                <i class="bi bi-telephone me-2 text-primary"></i>
                {{ site.phone }}
              </li>
              <li class="mb-2">
                <i class="bi bi-envelope me-2 text-primary"></i>
                {{ site.email }}
              </li>
              <li class="mt-3 text-muted">
                <small>Check-in: {{ site.check_in_time }} | Check-out: {{ site.check_out_time }}</small>
              </li>
            </ul>
          </div>

          <div class="col-md-5">
            <h5 class="fw-bold mb-3">Ubicación</h5>
            <div class="map-container shadow-sm rounded overflow-hidden">
              <iframe 
                v-if="site.google_maps_embed"
                :src="site.google_maps_embed" 
                width="100%" 
                height="200" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
              <div v-else class="bg-secondary d-flex align-items-center justify-content-center text-white" style="height: 200px;">
                <small>Mapa no disponible</small>
              </div>
            </div>
          </div>
        </div>

        <hr class="my-4 border-secondary">
        <p class="text-center small mb-0 text-muted">
          © {{ new Date().getFullYear() }} {{ site.hotel_name }}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/*.navbar-brand img {
  filter: brightness(0) invert(1); /* Opcional: si el logo es oscuro, hacerlo blanco 
}*/

.map-container {
  background: #333;
  line-height: 0;
}

.hover-primary:hover {
  color: #0d6efd !important;
  transition: color 0.3s ease;
}

.nav-link.router-link-exact-active {
  color: #fff !important;
  font-weight: bold;
}
</style>