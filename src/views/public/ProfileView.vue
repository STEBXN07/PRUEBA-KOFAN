
<script setup>
import {ref, onMounted} from 'vue';
import { useRouter } from "vue-router";
import { getUserProfile, logout } from "@/services/authService";

const router = useRouter();

const user = ref(); 
const errorMessage = ref(''); 
const isLoading = ref(false);

const loadProfile = async () => {
  try {
    const profile = await getUserProfile();
    user.value = profile;
  } catch (error) {
    errorMessage.value = "Sesión expirada o inválida";

    // Limpieza controlada
    logout();

    // Redirección usando router (NO window.location)
    router.push("/login");
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = () => {
  logout();
  router.push("/login");
};

onMounted(() => {
  loadProfile();
});
</script>

<template>
  <div v-if="isLoading" class="container-xxl">
    <p>Cargando perfil...</p>
  </div>

  <div v-else-if="user" class="container-xxl">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Perfil del Usuario</h1>
      <button class="btn btn-outline-danger" @click="handleLogout">
        Salir
      </button>
    </div>

    <p><strong>Nombre:</strong> {{ user.names }} {{ user.surnames }}</p>
    <p><strong>Email:</strong> {{ user.email }}</p>

  </div>

  <div v-else class="container-xxl">
    <p>{{ errorMessage }}</p>
  </div>
</template>
<style lang="css" scoped></style>