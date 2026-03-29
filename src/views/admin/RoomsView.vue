<script setup>
import { ref, onMounted } from 'vue';
import { getRoomsAdmin, createRoom, updateRoom, deleteRoom } from '@/services/roomService';
import { uploadImage } from '@/services/galleryService'; // Reutilizamos tu servicio de subida

const rooms = ref([]);
const isLoading = ref(false);
const isSaving = ref(false);
const showModal = ref(false);
const editMode = ref(false);

const base = import.meta.env.VITE_BACKEND_URL;

// Estado del formulario
const form = ref({
  id: null,
  room_number: '',
  type: 'Sencilla',
  description: '',
  price_per_night: 0,
  capacity: 1,
  amenities: '',
  status: 'disponible',
  images: []
});

const loadRooms = async () => {
  isLoading.value = true;
  try {
    rooms.value = await getRoomsAdmin();
  } finally {
    isLoading.value = false;
  }
};

const openModal = (room = null) => {
  if (room) {
    editMode.value = true;
    form.value = { ...room, amenities: room.amenities.join(', ') };
  } else {
    editMode.value = false;
    form.value = { 
      room_number: '', type: 'Sencilla', description: '', 
      price_per_night: 0, capacity: 1, amenities: '', 
      status: 'disponible', images: [] 
    };
  }
  showModal.value = true;
};

const handleFileUpload = async (event) => {
  const files = event.target.files;
  if (!files.length) return;

  for (let file of files) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await uploadImage(formData);
      form.value.images.push(`${base}${res.url}`);
    } catch (e) {
      alert("Error al subir una de las imágenes");
    }
  }
};

const saveRoom = async () => {
  isSaving.value = true;
  const payload = {
    ...form.value,
    amenities: form.value.amenities.split(',').map(a => a.trim()).filter(a => a)
  };

  try {
    if (editMode.value) {
      await updateRoom(form.value.id, payload);
    } else {
      await createRoom(payload);
    }
    showModal.value = false;
    loadRooms();
  } catch (e) {
    alert(e.response?.data?.detail || "Error al guardar");
  } finally {
    isSaving.value = false;
  }
};

const removeRoom = async (id) => {
  if (confirm("¿Estás seguro de eliminar esta habitación?")) {
    await deleteRoom(id);
    loadRooms();
  }
};

onMounted(loadRooms);
</script>

<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="bi bi-door-open me-2"></i>Gestión de Habitaciones</h2>
      <button @click="openModal()" class="btn btn-primary">
        <i class="bi bi-plus-lg me-2"></i>Nueva Habitación
      </button>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>N°</th>
                <th>Tipo</th>
                <th>Precio</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Última Edición</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="7" class="text-center py-5">
                  <div class="spinner-border text-primary"></div>
                </td>
              </tr>
              <tr v-for="room in rooms" :key="room.id">
                <td class="fw-bold">{{ room.room_number }}</td>
                <td>{{ room.type }}</td>
                <td>${{ room.price_per_night.toLocaleString() }}</td>
                <td><i class="bi bi-people me-1"></i>{{ room.capacity }}</td>
                <td>
                  <span :class="['badge', room.status === 'disponible' ? 'bg-success' : 'bg-warning text-dark']">
                    {{ room.status }}
                  </span>
                </td>
                <td class="small text-muted">
                   {{ room.updated_by }}<br>{{ new Date(room.updated_at).toLocaleDateString() }}
                </td>
                <td class="text-end">
                  <button @click="openModal(room)" class="btn btn-sm btn-outline-info me-2">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button @click="removeRoom(room.id)" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop fade show"></div>
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">{{ editMode ? 'Editar Habitación' : 'Nueva Habitación' }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="showModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveRoom" class="row g-3">
              <div class="col-md-4">
                <label class="form-label">Número de Habitación</label>
                <input v-model="form.room_number" type="text" class="form-control" required :disabled="editMode">
              </div>
              <div class="col-md-4">
                <label class="form-label">Tipo</label>
                <select v-model="form.type" class="form-select">
                  <option>Sencilla</option>
                  <option>Doble</option>
                  <option>Suite</option>
                  <option>Familiar</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Estado</label>
                <select v-model="form.status" class="form-select">
                  <option value="disponible">Disponible</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="ocupada">Ocupada</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Precio por Noche</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input v-model.number="form.price_per_night" type="number" class="form-control" required>
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Capacidad (Personas)</label>
                <input v-model.number="form.capacity" type="number" class="form-control" required>
              </div>
              <div class="col-12">
                <label class="form-label">Descripción</label>
                <textarea v-model="form.description" class="form-control" rows="2"></textarea>
              </div>
              <div class="col-12">
                <label class="form-label">Comodidades (separadas por coma)</label>
                <input v-model="form.amenities" type="text" class="form-control" placeholder="WiFi, TV, Aire Acondicionado...">
              </div>
              
              <div class="col-12">
                <label class="form-label">Fotos de la habitación</label>
                <input type="file" @change="handleFileUpload" class="form-control mb-2" multiple accept="image/*">
                <div class="d-flex gap-2 flex-wrap">
                  <div v-for="(img, idx) in form.images" :key="idx" class="position-relative">
                    <img :src="img" class="img-thumbnail" style="width: 80px; height: 80px; object-fit: cover;">
                    <button type="button" @click="form.images.splice(idx, 1)" class="btn btn-danger btn-sm position-absolute top-0 end-0 py-0 px-1">×</button>
                  </div>
                </div>
              </div>

              <div class="col-12 text-end mt-4">
                <button type="button" class="btn btn-light me-2" @click="showModal = false">Cancelar</button>
                <button type="submit" class="btn btn-primary" :disabled="isSaving">
                  {{ isSaving ? 'Guardando...' : 'Guardar Habitación' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop { background-color: rgba(0,0,0,0.5); }
.table th { font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
</style>