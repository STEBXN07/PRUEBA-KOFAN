<script setup>
import { ref, onMounted } from 'vue';
import { getImages, uploadImage, deleteImage } from '@/services/galleryService';

const images = ref([]);
const isUploading = ref(false);
const fileInput = ref(null);
const base = import.meta.env.VITE_BACKEND_URL;

const loadImages = async () => {
  images.value = await getImages();
};

const handleUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  // CAMBIO AQUÍ: Debe decir 'file' para coincidir con el backend
  formData.append('file', file); 

  isUploading.value = true;
  try {
    // Enviamos el formData completo
    await uploadImage(formData); 
    await loadImages();
    if (fileInput.value) fileInput.value.value = '';
  } catch (error) {
    console.error("Error detallado:", error.response?.data);
    alert("Error al subir imagen");
  } finally {
    isUploading.value = false;
  }
};

const removeImage = async (id) => {
  if (confirm("¿Eliminar imagen?")) {
    await deleteImage(id);
    await loadImages();
  }
};

onMounted(loadImages);
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Gestión de Galería</h2>
      <div>
        <input type="file" ref="fileInput" @change="handleUpload" class="d-none" accept="image/*">
        <button @click="fileInput.click()" class="btn btn-primary" :disabled="isUploading">
          <span v-if="isUploading" class="spinner-border spinner-border-sm me-2"></span>
          <i class="bi bi-cloud-upload me-2"></i> Subir Imagen
        </button>
      </div>
    </div>

    <div class="row g-3">
      <div v-for="img in images" :key="img.id" class="col-md-3">
        <div class="card h-100 shadow-sm border-0 position-relative gallery-item">
          <img :src="`${base}${img.url}`" class="card-img-top img-thumbnail" style="height: 200px; object-fit: cover;">
          <div class="card-body p-2 text-center">
            <button @click="removeImage(img.id)" class="btn btn-sm btn-outline-danger w-100">
              <i class="bi bi-trash"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery-item img { transition: transform 0.2s; }
.gallery-item:hover img { transform: scale(1.02); }
</style>