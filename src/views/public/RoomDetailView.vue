<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getRoomDetailPublic } from '@/services/roomService';

const route = useRoute();
const room = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  room.value = await getRoomDetailPublic(route.params.id);
  isLoading.value = false;
});
</script>

<template>
  <div class="container py-5" v-if="room">
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/rooms">Habitaciones</router-link></li>
        <li class="breadcrumb-item active">{{ room.type }}</li>
      </ol>
    </nav>

    <div class="row g-5">
      <div class="col-lg-7">
        <div id="roomCarousel" class="carousel slide shadow rounded overflow-hidden" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div v-for="(img, index) in room.images" :key="index" :class="['carousel-item', { active: index === 0 }]">
              <img :src="img" class="d-block w-100" style="height: 450px; object-fit: cover;">
            </div>
          </div>
          <button class="carousel-control-prev" data-bs-target="#roomCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" data-bs-target="#roomCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>

      <div class="col-lg-5">
        <h1 class="fw-bold mb-3">{{ room.type }}</h1>
        <h3 class="text-primary mb-4">${{ room.price_per_night }} <small class="text-muted fs-6">/ noche</small></h3>
        
        <p class="text-muted mb-4">{{ room.description }}</p>

        <h5 class="fw-bold">Comodidades:</h5>
        <div class="d-flex flex-wrap gap-2 mb-5">
          <span v-for="a in room.amenities" :key="a" class="badge bg-light text-primary border px-3 py-2">
            <i class="bi bi-check2-circle me-1"></i>{{ a }}
          </span>
        </div>

        <div class="card bg-light border-0 p-4">
          <p class="mb-3 text-center">Para reservar esta habitación, por favor inicia sesión.</p>
          <router-link to="/login" class="btn btn-primary btn-lg w-100 shadow">
            Reservar Ahora
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>