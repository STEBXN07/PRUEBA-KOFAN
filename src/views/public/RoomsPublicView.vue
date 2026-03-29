<script setup>
import { ref, onMounted } from 'vue';
import { getRoomsPublic } from '@/services/roomService';

const rooms = ref([]);
const isLoading = ref(true);

const base = import.meta.env.VITE_BACKEND_URL;

onMounted(async () => {
  try {
    rooms.value = await getRoomsPublic();
  } catch (error) {
    console.error("Error al cargar habitaciones públicas:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h1 class="fw-bold">Nuestras Habitaciones</h1>
      <p class="text-muted">Encuentra el espacio perfecto para tu descanso</p>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else class="row g-4">
      <div v-for="room in rooms" :key="room.id" class="col-md-4">
        <div class="card h-100 shadow-sm border-0 room-card">
          <div class="position-relative">
            <img 
              :src="room.images && room.images.length > 0 ? `${room.images[0]}` : 'https://via.placeholder.com/400x250'" 
              class="card-img-top" 
              alt="Room"
            >
            <span class="badge bg-primary position-absolute top-0 end-0 m-3 px-3 py-2">
              ${{ room.price_per_night.toLocaleString() }} / noche
            </span>
          </div>
          <div class="card-body">
            <h5 class="card-title fw-bold">{{ room.type }} #{{ room.room_number }}</h5>
            <p class="card-text text-muted small">{{ room.description.substring(0, 100) }}...</p>
            <div class="d-flex gap-2 mb-3">
              <span class="badge bg-light text-dark border"><i class="bi bi-people me-1"></i>{{ room.capacity }} pers.</span>
            </div>
          </div>
          <div class="card-footer bg-white border-0 pb-4">
            <router-link :to="{ name: 'room-detail', params: { id: room.id } }" class="btn btn-primary w-100">
              Ver Detalles
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.room-card { transition: transform 0.3s ease; }
.room-card:hover { transform: translateY(-10px); }
.card-img-top { height: 220px; object-fit: cover; border-radius: 8px 8px 0 0; }
</style>