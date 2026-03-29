<script setup>
import { ref, onMounted } from 'vue';
import { fetchConfig, saveConfig, uploadLogo } from '@/services/configService'; // Nombres corregidos

const isLoading = ref(true);
const isSaving = ref(false);
const message = ref({ text: '', type: '' });
const fileInput = ref(null);

const base = import.meta.env.VITE_BACKEND_URL;

const config = ref({
  hotel_name: '',
  logo_url: '',
  contact_email: '',
  phone: '',
  address: '',
  check_in_time: '15:00',
  check_out_time: '11:00',
  currency: 'COP',
  social_facebook: '',
  social_instagram: '',
  tax_percentage: 0
});

// Función para la subida del logo
const handleLogoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await uploadLogo(formData);
    config.value.logo_url = res.logo_url; // Actualiza la vista previa
    message.value = { text: 'Logo subido correctamente', type: 'success' };
  } catch (error) {
    message.value = { text: 'Error al subir el logo', type: 'danger' };
  }
};

const loadSettings = async () => {
  try {
    const data = await fetchConfig(); // Nombre corregido
    if (data) config.value = { ...config.value, ...data };
  } catch (error) {
    console.error("Error cargando configuración", error);
  } finally {
    isLoading.value = false;
  }
};

const handleSave = async () => {
  isSaving.value = true;
  message.value = { text: '', type: '' };
  
  try {
    await saveConfig(config.value); // Nombre corregido
    message.value = { text: 'Configuración actualizada con éxito', type: 'success' };
  } catch (error) {
    message.value = { text: 'Error al guardar los cambios', type: 'danger' };
  } finally {
    isSaving.value = false;
    setTimeout(() => message.value.text = '', 3000);
  }
};

onMounted(loadSettings);
</script>

<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="bi bi-gear-fill me-2"></i>Configuración del Sistema</h2>
      <button 
        @click="handleSave" 
        class="btn btn-primary px-4" 
        :disabled="isSaving || isLoading"
      >
        <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
        <i v-else class="bi bi-cloud-check me-2"></i>
        Guardar Cambios
      </button>
    </div>

    <div v-if="message.text" :class="['alert alert-dismissible fade show', `alert-${message.type}`]">
      {{ message.text }}
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted">Cargando parámetros...</p>
    </div>

    <div v-else class="card shadow-sm border-0">
      <div class="card-body p-0">
        <div class="row g-0">
          <div class="col-md-3 border-end bg-light p-3">
            <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist">
              <button class="nav-link active text-start" data-bs-toggle="pill" data-bs-target="#general">
                <i class="bi bi-info-circle me-2"></i>General
              </button>
              <button class="nav-link text-start" data-bs-toggle="pill" data-bs-target="#hotel">
                <i class="bi bi-building me-2"></i>Operaciones
              </button>
              <button class="nav-link text-start" data-bs-toggle="pill" data-bs-target="#social">
                <i class="bi bi-share me-2"></i>Redes Sociales
              </button>
            </div>
          </div>

          <div class="col-md-9 p-4">
            <form @submit.prevent="handleSave">
              <div class="tab-content">
                
                <div class="tab-pane fade show active" id="general">
                  <h5 class="mb-4">Información del Hotel</h5>
                  <div class="row g-3">
                    <div class="col-md-12 mb-4 text-center">
                      <label class="form-label d-block fw-bold">Logo del Hotel</label>
                      <div class="mb-3">
                        <img 
                          :src="config.logo_url ? `${base}${config.logo_url}` : '/assets/img/turismonatural.png'" 
                          alt="Logo Preview" 
                          class="img-thumbnail shadow-sm"
                          style="max-height: 120px;"
                        >
                      </div>
                      <input 
                        type="file" 
                        ref="fileInput" 
                        @change="handleLogoUpload" 
                        class="d-none" 
                        accept="image/*"
                      >
                      <button type="button" class="btn btn-outline-secondary btn-sm" @click="fileInput.click()">
                        <i class="bi bi-camera me-2"></i>Cambiar Logo
                      </button>
                    </div>
                    <div class="col-md-12">
                      <label class="form-label">Nombre del Hotel</label>
                      <input v-model="config.hotel_name" type="text" class="form-control">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Email de Contacto</label>
                      <input v-model="config.contact_email" type="email" class="form-control">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Teléfono</label>
                      <input v-model="config.phone" type="text" class="form-control">
                    </div>
                    <div class="col-md-12">
                      <label class="form-label">Dirección Física</label>
                      <input v-model="config.address" type="text" class="form-control">
                    </div>
                  </div>
                </div>

                <div class="tab-pane fade" id="hotel">
                  <h5 class="mb-4">Parámetros de Reserva</h5>
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Hora de Check-in</label>
                      <input v-model="config.check_in_time" type="time" class="form-control">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Hora de Check-out</label>
                      <input v-model="config.check_out_time" type="time" class="form-control">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Moneda</label>
                      <select v-model="config.currency" class="form-select">
                        <option value="COP">Peso Colombiano (COP)</option>
                        <option value="USD">Dólar (USD)</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Impuesto / IVA (%)</label>
                      <input v-model.number="config.tax_percentage" type="number" class="form-control">
                    </div>
                  </div>
                </div>

                <div class="tab-pane fade" id="social">
                  <h5 class="mb-4">Presencia Digital</h5>
                  <div class="row g-3">
                    <div class="col-md-12">
                      <label class="form-label">Facebook URL</label>
                      <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-facebook"></i></span>
                        <input v-model="config.social_facebook" type="url" class="form-control" placeholder="https://facebook.com/...">
                      </div>
                    </div>
                    <div class="col-md-12">
                      <label class="form-label">Instagram URL</label>
                      <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-instagram"></i></span>
                        <input v-model="config.social_instagram" type="url" class="form-control" placeholder="https://instagram.com/...">
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-pills .nav-link {
  color: #495057;
  border-radius: 8px;
  margin-bottom: 5px;
}
.nav-pills .nav-link.active {
  background-color: #0d6efd;
}
.card {
  border-radius: 12px;
  overflow: hidden;
}
</style>