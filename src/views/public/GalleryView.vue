<script setup>
import { ref, onMounted } from 'vue';
import { getImages } from '@/services/galleryService';

const images = ref([]);

onMounted(async () => {
    images.value = await getImages();
});
</script>
<template>
   <h1>Galería de Imágenes</h1>
   <div class="row g-4">
       <div v-for="image in images" :key="image.id" class="col-lg-4 col-md-6">
            <div class="card shadow-sm border-0 overflow-hidden h-100">
                <div class="card-body overflow-hidden">
                    <img :src="image.url" :alt="image.alt" class="card-img-top img-fluid shadow rounded" />
                    <h5 class="card-title">{{ image.title }}</h5>
                 </div>
            </div>
       </div>
   </div>
</template>

