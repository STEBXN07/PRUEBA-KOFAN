<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login, getUserProfile } from "@/services/authService"; // Importar las funciones del servicio de autenticación
import PasswordInput from "@/components/form/PasswordInput.vue";
import logo from "@/assets/img/turismonatural.png";

const router = useRouter();

const username = ref("");
const password = ref("");

const errorMessage = ref("");
const isLoading = ref(false);

const errors = ref({
  username: "",
  password: "",
});

const validate = () => {
  errors.value = { username: "", password: "" };

  if (!username.value) errors.value.username = "Correo requerido";
  if (!password.value) errors.value.password = "Contraseña requerida";

  return !errors.value.username && !errors.value.password;
};

const handleLogin = async () => {
  if (!validate()) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    // 1. Autenticación
    await login({
      username: username.value.trim(),
      password: password.value,
    });

    // 2. Obtener usuario autenticado
    const user = await getUserProfile();

    // 3. Redirección basada en rol
    if (user?.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      
      router.push("/app/profile");
    }

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

      <div class="card shadow-sm">
        <div class="card-body">

          <div class="text-center mb-4">
            <img :src="logo" width="150" />
          </div>

          <h2 class="mb-3 text-center">Ingresa a tu cuenta 👋</h2>

          <form class="mb-3" @submit.prevent="handleLogin">

            <div class="mb-3">
              <label class="form-label">Correo electrónico</label>
              <input
                v-model="username"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors.username }"
                placeholder="Ingresa tu correo electrónico"
                :disabled="isLoading"
              />
              <div class="invalid-feedback">
                {{ errors.username }}
              </div>
            </div>

            <div class="mb-3">
              <div class="d-flex justify-content-between">
                <label class="form-label">Contraseña</label>
                <router-link to="/forgot-password">
                  <small>¿Olvidaste tu contraseña?</small>
                </router-link>
              </div>

              <PasswordInput
                v-model="password"
                placeholder="••••••••"
                :error="errors.password"
                :disabled="isLoading"
              />
            </div>

            <div class="mb-3">
              <button
                class="btn btn-primary w-100 d-flex justify-content-center align-items-center"
                type="submit"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                <span>{{ isLoading ? "Ingresando..." : "Ingresar" }}</span>
              </button>
            </div>

            <div
              v-if="errorMessage"
              class="alert alert-danger alert-dismissible fade show"
            >
              {{ errorMessage }}
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
              ></button>
            </div>

          </form>

          <p class="text-center">
            Aún no tienes cuenta?
            <router-link to="/register">Registrarme</router-link>
          </p>

        </div>
      </div>

    </div>
  </div>
</div>
</template>
<style lang="css" scoped></style>