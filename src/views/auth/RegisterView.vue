<script setup>
import {ref, computed} from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/services/authService';
import PasswordInput from '@/components/form/PasswordInput.vue';
import logo from '@/assets/img/turismonatural.png';


const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref("");

const form = ref({
   names: "",
   surnames: "",
   document_type: "",
   document_number: "",
   email: "",
   password: "",
});

const confirmPassword = ref(""); // Para confirmar la contraseña
//verificar las contraseñas con la propiedad computada
const passwordsMatch = computed(() => {
   if (!form.value.password || !confirmPassword.value) return true; // No mostrar error si alguno está vacío
   return form.value.password === confirmPassword.value;
});

const isFormInvalid = computed(() => {
   return (
      !form.value.names ||
      !form.value.surnames ||
      !form.value.document_type ||
      !form.value.document_number ||
      !form.value.email ||
      !form.value.password ||      
      !passwordsMatch.value
   );
}); // deshabilitar el botón si el formulario no es válido

// funcion para el registro de usuario
const handleRegister = async () => {
   if(!passwordsMatch.value) {
      errorMessage.value = "Las contraseñas no coinciden.";
      return;
   }
   
   isLoading.value = true;
   errorMessage.value = "";

   try {
      await register(form.value);
      router.push("/login");
   } catch (error) {
      errorMessage.value =
         error.response?.data?.detail ||
         error.response?.data?.message ||
         error.message ||
         "Error en la conexión";
   } finally {
      isLoading.value = false;
   }
};
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-12 col-lg-12">
         <div class="card shadow border-0 p-4 p-md-5">
            <h2 class="text-center mb-4 fw-bold text-primary">Crear Cuenta</h2>
            <div class="text-center mb-4">
               <img :src="logo" width="150" />
            </div>
            <p class="text-center text-muted mb-4">Regístrate como huésped para gestionar tus reservas.</p>          
            <form @submit.prevent="handleRegister">            
               <div class="row g-3 mb-3">
                  <div class="col-md-12">
                     <label class="form-label small fw-bold">Nombres</label>
                     <input v-model="form.names" type="text" class="form-control" placeholder="Juan" required>
                  </div>
                  <div class="col-md-12">
                     <label class="form-label small fw-bold">Apellidos</label>
                     <input v-model="form.surnames" type="text" class="form-control" placeholder="Pérez" required>
                  </div>
               </div>

               <div class="row g-3 mb-3">
                  <div class="col-md-5">
                     <label class="form-label small fw-bold">Tipo Documento</label>
                     <select v-model="form.document_type" class="form-select">
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="PAS">Pasaporte</option>
                        <option value="TI">Tarjeta de Identidad</option>
                        <option value="RC">Registro Civil</option>
                     </select>
                  </div>
                  <div class="col-md-7">
                     <label class="form-label small fw-bold">Número de Documento</label>
                     <input v-model="form.document_number" type="text" class="form-control" placeholder="12345678" required>
                  </div>
               </div>

               <div class="mb-3">
                  <label class="form-label small fw-bold">Correo Electrónico</label>
                  <input v-model="form.email" type="email" class="form-control" placeholder="juan.perez@correo.com" required>
               </div>

               <div class="row g-3 mb-4">
                  <div class="col-md-12">
                     <label class="form-label small fw-bold">Contraseña</label>
                     <PasswordInput v-model="form.password" required/>
                  </div>
                  <div class="col-md-12">
                     <label class="form-label small fw-bold">Confirmar Contraseña</label>
                     <PasswordInput v-model="confirmPassword" required :class="{'is-invalid': !passwordsMatch}"
                     />
                     <div v-if="!passwordsMatch" class="invalid-feedback">
                        Las contraseñas no coinciden.
                     </div>
                  </div>
               </div>

               <button 
                  type="submit" 
                  class="btn btn-primary w-100 py-2 mb-3 shadow-sm"
                  :disabled="isLoading || isFormInvalid"
               >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <span v-if="isLoading">Creando cuenta...</span>
                  <span v-else>Crear mi cuenta</span>
               </button>

               <div v-if="errorMessage" class="alert alert-danger small py-2 text-center" role="alert">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
               </div>

               <hr class="my-4 text-muted">

               <p class="text-center mb-0 text-muted">
                  ¿Ya tienes una cuenta activa? 
                  <router-link to="/login" class="fw-bold text-decoration-none">Inicia sesión aquí</router-link>
               </p>
            </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales opcionales para mejorar el aspecto */
.card {
  border-radius: 15px;
}
.form-control, .form-select {
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
}
/* Asegura que el componente PasswordInput respete el estilo de error */
:deep(.is-invalid input) {
  border-color: #dc3545;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

</style>