<script setup>
import { ref } from 'vue'


const listaEventos = ref([
  {
    id: 1,
    titulo: 'Bodas',
    descripcion: 'Celebra tu unión rodeado de naturaleza con nuestra decoración exclusiva estilo Kofán.',
    imagen: 'https://static.wixstatic.com/media/3e114d_e307df93a25543d4aad88c536906ccbc~mv2.jpg/v1/fill/w_640,h_526,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/3e114d_e307df93a25543d4aad88c536906ccbc~mv2.jpg'
  },
  {
    id: 2,
    titulo: 'Retiros',
    descripcion: 'Desconecta a tu equipo de la rutina y conecta con la productividad en un ambiente relajado.',
    imagen: 'https://res.cloudinary.com/worldpackers/image/upload/c_limit,f_auto,q_auto,w_1140/uxpqmab6idt5eqqi1dg2'
  },
  {
    id: 3,
    titulo: 'Cenas',
    descripcion: 'Una velada inolvidable bajo las estrellas con lo mejor de la gastronomía del Putumayo.',
    imagen: 'https://img.freepik.com/foto-gratis/cena-lujo-hora-tarde-amigos-cenan-hermoso-lugar-al-aire-libre_146671-14453.jpg'
  }
])
</script>

<template>

  <div class="container py-5">
    
    <div class="text-center mb-5">
      <p class="lead text-muted">
        Vive momentos únicos en el corazón del Putumayo
      </p>
      <div style="height: 4px; width: 80px; background-color: var(--color-boton-cafe); margin: 0 auto;"></div>
    </div>

    <div class="row g-4">
      <div class="col-md-4" v-for="evento in listaEventos" :key="evento.id">
        <div class="card h-100 shadow-sm border-0 event-card">
          
          <img :src="evento.imagen" class="card-img-top" :alt="evento.titulo" style="height: 250px; object-fit: cover;">
          
          <div class="card-body p-4 text-center d-flex flex-column"> 
            
            <h3 class="card-title fw-bold mb-3">{{ evento.titulo }}</h3>
            
            <p class="card-text text-muted mb-4">
              {{ evento.descripcion }}
            </p>

            <div class="mt-auto">
                <router-link to="/reservar" class="btn btn-success px-4 text-uppercase fw-bold">
                  Reservar
                </router-link>
            </div>

          </div>
        </div>
      </div>
      </div>
  </div>
</template>

<style scoped>
.event-card:hover {
  transform: translateY(-5px);
  transition: 0.3s;
}

.btn-success {
    background-color: #9f8f5b !important;
    border-color: #9f8f5b !important;
}
.btn-success:hover {
    background-color: #8a7945 !important;
}
</style>
