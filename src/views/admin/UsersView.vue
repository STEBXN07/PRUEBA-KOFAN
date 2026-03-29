<script setup>
import { ref, onMounted } from 'vue';
import { getAllUsers, createUser, updateUser, deleteUser } from '@/services/userService';

const users = ref([]);
const isLoading = ref(false);
const showModal = ref(false);
const isEditing = ref(false);

const userForm = ref({
  id: null,
  names: '',
  surnames: '',
  document_type: 'CC',
  document_number: '',
  email: '',
  role: 'guest',  //guest
  password: ''
});

const loadUsers = async () => {
  isLoading.value = true;
  try {
    const data = await getAllUsers();
    users.value = data;
  } catch (error) {
    console.error("Error cargando usuarios:", error);
  } finally {
    isLoading.value = false;
  }
};

const openModal = (user = null) => {
  if (user) {
    isEditing.value = true;
    userForm.value = { ...user, password: '' };
  } else {
    isEditing.value = false;
    userForm.value = { 
      names: '', surnames: '', document_type: 'CC', 
      document_number: '', email: '', role: 'user', password: '' 
    };
  }
  showModal.value = true;
};

const saveUser = async () => {
  try {
    if (isEditing.value) {
      await updateUser(userForm.value);
    } else {
      await createUser(userForm.value);
    }
    showModal.value = false;
    loadUsers();
  } catch (error) {
    alert(error.response?.data?.detail || "Error al procesar la solicitud");
  }
};

const confirmDelete = async (id) => {
  if (confirm("¿Estás seguro de eliminar este usuario?")) {
    await deleteUser(id);
    loadUsers();
  }
};

onMounted(loadUsers);
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Gestión de Usuarios</h2>
      <button @click="openModal()" class="btn btn-primary shadow-sm">
        <i class="bi bi-person-plus-fill me-2"></i>Nuevo Usuario
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Cargando usuarios...</p>
    </div>

    <div v-else class="card shadow-sm border-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="ps-4">Nombre Completo</th>
              <th>Identificación</th>
              <th>Correo Electrónico</th>
              <th>Rol</th>
              <th class="text-end pe-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.id">
              <td class="ps-4">
                <div class="fw-bold">{{ u.names }} {{ u.surnames }}</div>
              </td>
              <td>
                <span class="badge bg-light text-dark border">{{ u.document_type }}</span>
                <span class="ms-2">{{ u.document_number }}</span>
              </td>
              <td>{{ u.email }}</td>
              <td>
                <span :class="['badge', u.role === 'admin' ? 'bg-primary' : 'bg-secondary']">
                  {{ u.role }}
                </span>
              </td>
              <td class="text-end pe-4">
                <button @click="openModal(u)" class="btn btn-sm btn-outline-primary me-2">
                  <i class="bi bi-pencil"></i>
                </button>
                <button @click="confirmDelete(u.id)" class="btn btn-sm btn-outline-danger">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">No se encontraron usuarios registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">{{ isEditing ? 'Actualizar' : 'Registrar' }} Usuario</h5>
            <button type="button" class="btn-close btn-close-white" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="saveUser" class="row g-3">
              <div class="col-md-6">
                <label class="form-label small fw-bold">Nombres</label>
                <input v-model="userForm.names" type="text" class="form-control" required>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold">Apellidos</label>
                <input v-model="userForm.surnames" type="text" class="form-control" required>
              </div>
              <div class="col-12">
                <label class="form-label small fw-bold">Email</label>
                <input v-model="userForm.email" type="email" class="form-control" required>
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-bold">Tipo</label>
                <select v-model="userForm.document_type" class="form-select">
                  <option value="CC">CC</option>
                  <option value="CE">CE</option>
                  <option value="PAS">PAS</option>
                  <option value="TI">TI</option>
                  <option value="RC">RC</option>
                </select>
              </div>
              <div class="col-md-8">
                <label class="form-label small fw-bold">Número de Documento</label>
                <input v-model="userForm.document_number" type="text" class="form-control" required>
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-bold">Rol</label>
                <select v-model="userForm.role" class="form-select">
                  <option value="guest">Usuario Standard</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div v-if="!isEditing" class="col-md-6">
                <label class="form-label small fw-bold">Contraseña</label>
                <input v-model="userForm.password" type="password" class="form-control" required>
              </div>
              <div class="col-12 mt-4 text-end">
                <button type="button" class="btn btn-light me-2" @click="showModal = false">Cancelar</button>
                <button type="submit" class="btn btn-dark px-4">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos consistentes con tu AdminLayout */
.card {
  border-radius: 12px;
}
.table thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}
</style>