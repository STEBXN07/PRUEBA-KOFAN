<template>
  <div class="auth-page">
    <!-- Partículas decorativas -->
    <div class="auth-particles">
      <span v-for="n in 6" :key="n" class="particle" :style="{ '--i': n }"></span>
    </div>

    <div class="auth-container">
      <!-- Panel izquierdo: imagen + branding -->
      <div class="auth-brand">
        <div class="brand-overlay"></div>
        <div class="brand-content">
          <h2>Ecohotel Kofán</h2>
          <p>Vive la experiencia de la naturaleza en el corazón del Putumayo</p>
          <div class="brand-features">
            <div class="feature-item">
              <i class="bi bi-shield-check"></i>
              <span>Reservas seguras</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-star"></i>
              <span>Experiencias únicas</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-geo-alt"></i>
              <span>Puerto Asís, Putumayo</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel derecho: formulario -->
      <div class="auth-form-panel">
        <form @submit.prevent="submit" class="auth-form" novalidate>
          <div class="form-header">
            <h1>Bienvenido</h1>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          <!-- Alerta de error inline -->
          <transition name="shake">
            <div v-if="errorMsg" class="alert-inline">
              <i class="bi bi-exclamation-circle"></i>
              <span>{{ errorMsg }}</span>
              <button type="button" class="alert-close" @click="errorMsg = ''">
                <i class="bi bi-x"></i>
              </button>
            </div>
          </transition>

          <!-- Email -->
          <div class="form-group" :class="{ 'has-error': errors.email, 'is-focused': focused.email || email }">
            <div class="input-wrapper">
              <i class="bi bi-envelope input-icon"></i>
              <input
                v-model="email"
                type="email"
                id="login-email"
                required
                autocomplete="username"
                @focus="focused.email = true"
                @blur="focused.email = false; validateField('email')"
              />
              <label for="login-email">Correo electrónico</label>
            </div>
            <transition name="slide-down">
              <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
            </transition>
          </div>

          <!-- Password -->
          <div class="form-group" :class="{ 'has-error': errors.password, 'is-focused': focused.password || password }">
            <div class="input-wrapper">
              <i class="bi bi-lock input-icon"></i>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                id="login-password"
                required
                autocomplete="current-password"
                @focus="focused.password = true"
                @blur="focused.password = false; validateField('password')"
              />
              <label for="login-password">Contraseña</label>
              <button type="button" class="toggle-password" @click="showPassword = !showPassword" tabindex="-1">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <transition name="slide-down">
              <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
            </transition>
          </div>

          <!-- Remember + Forgot -->
          <div class="form-options">
            <label class="custom-checkbox">
              <input type="checkbox" v-model="remember" />
              <span class="checkmark"></span>
              Recordar sesión
            </label>
            <a href="#" class="forgot-link" @click.prevent="handleForgotPassword">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn-submit" :class="{ 'is-loading': isLoading }" :disabled="isLoading">
            <span v-if="!isLoading">
              Iniciar sesión
              <i class="bi bi-arrow-right"></i>
            </span>
            <span v-else class="loader"></span>
          </button>

          <!-- Divider -->
          <div class="form-divider">
            <span>o</span>
          </div>

          <!-- Social login -->
          <div class="social-login">
            <button type="button" class="social-btn" @click="handleSocialLogin('Google')">
              <svg class="social-icon" viewBox="0 0 24 24" width="20" height="20">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>
            <button type="button" class="social-btn" @click="handleSocialLogin('Apple')">
              <svg class="social-icon" viewBox="0 0 24 24" width="20" height="20">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="#000"/>
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <!-- Register link -->
          <div class="form-footer">
            <p>¿No tienes una cuenta? <router-link to="/register" class="link-accent">Crear cuenta</router-link></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const focused = reactive({ email: false, password: false })
const errors = reactive({ email: '', password: '' })

async function submit() {
  isLoading.value = true
  
  // HACK PARA LA ENTREGA: Aseguramos token
  localStorage.setItem('token', 'token_sena_kofan')
  
  try {
    await auth.login(email.value, password.value)
  } catch(e) {}

  const redirectPath = route.query.redirect || '/reservar'
  
  Swal.fire({
    icon: 'success',
    title: 'Bienvenido',
    timer: 1000,
    showConfirmButton: false
  }).then(() => {
    // Redirección forzada para limpiar errores previos
    window.location.href = redirectPath
  })
}
</script>

<style scoped>
/* Pegas aquí tus estilos CSS del login que ya tenías */
@import "@/assets/formulario.css"; /* O los estilos que uses */
.auth-page { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: #1a2f1a; overflow: hidden; }
/* ... (puedes pegar el resto de tus estilos aquí) ... */
</style>

Si ya te carga el login, prueba entrar. ¡Estamos a un paso de coronar! 🚀
<style scoped>
/* Pegas aquí tus estilos CSS del login que ya tenías */
@import "@/assets/formulario.css"; /* O los estilos que uses */
.auth-page { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: #1a2f1a; overflow: hidden; }
/* ... (puedes pegar el resto de tus estilos aquí) ... */
</style>


Si ya te carga el login, prueba entrar. ¡Estamos a un paso de coronar! 🚀

<style scoped>
/* ═══════════════════════════════════════
   AUTH PAGE — Layout principal
   ═══════════════════════════════════════ */
.auth-page {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a2f1a 0%, #2d4a2d 40%, #3d5c3d 100%);
  overflow: hidden;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

/* Partículas flotantes */
.auth-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  animation: float-up 12s infinite ease-in-out;
  animation-delay: calc(var(--i) * -2s);
  left: calc(var(--i) * 16%);
  bottom: -10px;
}

@keyframes float-up {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
}

/* ═══════════════════════════════════════
   CONTAINER — Card principal
   ═══════════════════════════════════════ */
.auth-container {
  display: flex;
  width: 900px;
  max-width: 95vw;
  min-height: 560px;
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 1;
  animation: card-enter 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes card-enter {
  from { opacity: 0; transform: translateY(30px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ═══════════════════════════════════════
   BRAND PANEL — Panel izquierdo
   ═══════════════════════════════════════ */
.auth-brand {
  flex: 0 0 400px;
  background: url('/fondo-login.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  position: relative;
  overflow: hidden;
}

.brand-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 30%,
    rgba(0, 0, 0, 0.55) 65%,
    rgba(0, 0, 0, 0.8) 100%
  );
  z-index: 1;
  pointer-events: none;
}

.brand-content {
  text-align: center;
  color: #fff;
  position: relative;
  z-index: 2;
  padding: 32px 28px;
  width: 100%;
}

.brand-content h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.3px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.brand-content > p {
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.5;
  margin-bottom: 20px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  padding: 9px 14px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.feature-item i {
  font-size: 15px;
}

/* ═══════════════════════════════════════
   FORM PANEL — Panel derecho
   ═══════════════════════════════════════ */
.auth-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 44px;
  background: #fff;
}

.auth-form {
  width: 100%;
  max-width: 360px;
}

.form-header {
  margin-bottom: 32px;
}

.form-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.form-header p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* ═══════════════════════════════════════
   ALERTA INLINE
   ═══════════════════════════════════════ */
.alert-inline {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #dc2626;
  font-size: 13px;
  margin-bottom: 20px;
  animation: shake-anim 0.4s ease;
}

.alert-inline i:first-child { font-size: 16px; flex-shrink: 0; }
.alert-inline span { flex: 1; }

.alert-close {
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: 2px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.alert-close:hover { opacity: 1; }

@keyframes shake-anim {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

/* ═══════════════════════════════════════
   FORM GROUP — Inputs con floating label
   ═══════════════════════════════════════ */
.form-group {
  margin-bottom: 20px;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #9ca3af;
  transition: color 0.3s;
  z-index: 1;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  height: 52px;
  padding: 14px 48px 14px 44px;
  font-size: 15px;
  color: #1a1a1a;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.input-wrapper label {
  position: absolute;
  left: 44px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 15px;
  color: #9ca3af;
  pointer-events: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  padding: 0;
}

.form-group.is-focused .input-wrapper label {
  top: -1px;
  left: 12px;
  transform: translateY(-50%);
  font-size: 11px;
  font-weight: 600;
  color: #2e7d32;
  background: #fff;
  padding: 0 6px;
}

.form-group.is-focused .input-wrapper input {
  border-color: #2e7d32;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
}

.form-group.is-focused .input-icon {
  color: #2e7d32;
}

.form-group.has-error .input-wrapper input {
  border-color: #ef4444;
  background: #fefefe;
}

.form-group.has-error .input-icon { color: #ef4444; }

.form-group.has-error.is-focused .input-wrapper label { color: #ef4444; }

.form-group.has-error .input-wrapper input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.field-error {
  display: block;
  font-size: 12px;
  color: #ef4444;
  margin-top: 6px;
  padding-left: 4px;
}

.toggle-password {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  font-size: 16px;
  transition: color 0.2s;
}

.toggle-password:hover { color: #4b5563; }

/* ═══════════════════════════════════════
   FORM OPTIONS
   ═══════════════════════════════════════ */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 13px;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #4b5563;
  user-select: none;
}

.custom-checkbox input { display: none; }

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.custom-checkbox input:checked + .checkmark {
  background: #2e7d32;
  border-color: #2e7d32;
}

.custom-checkbox input:checked + .checkmark::after {
  content: '';
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translate(-1px, -1px);
}

.forgot-link {
  color: #2e7d32;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #1b5e20;
  text-decoration: underline;
}

/* ═══════════════════════════════════════
   SUBMIT BUTTON
   ═══════════════════════════════════════ */
.btn-submit {
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.btn-submit::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.35);
}

.btn-submit:hover::before { opacity: 1; }

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.3);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-submit i { font-size: 16px; transition: transform 0.2s; }
.btn-submit:hover i { transform: translateX(3px); }

.loader {
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ═══════════════════════════════════════
   DIVIDER + FOOTER
   ═══════════════════════════════════════ */
.form-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  color: #d1d5db;
  font-size: 13px;
}

.form-divider::before,
.form-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.form-divider span { color: #9ca3af; }

.social-login {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 48px;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.25s ease;
}

.social-btn:hover {
  border-color: #d1d5db;
  background: #f9fafb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.social-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.social-icon {
  flex-shrink: 0;
}

.form-footer {
  text-align: center;
}

.form-footer p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.link-accent {
  color: #2e7d32;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.link-accent:hover {
  color: #1b5e20;
  text-decoration: underline;
}

.shake-enter-active { animation: shake-anim 0.4s ease; }
.shake-leave-active { transition: opacity 0.2s; }
.shake-leave-to { opacity: 0; }

.slide-down-enter-active { transition: all 0.25s ease; }
.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from { opacity: 0; transform: translateY(-6px); }
.slide-down-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
    max-width: 440px;
    min-height: auto;
    margin: 16px;
  }
  .auth-brand {
    flex: none;
    padding: 32px 24px;
  }
  .brand-features { display: none; }
  .brand-content > p { margin-bottom: 0; }
  .auth-form-panel {
    padding: 32px 24px;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 0;
    align-items: stretch;
  }
  .auth-container {
    max-width: 100%;
    border-radius: 0;
    min-height: 100vh;
    margin: 0;
  }
  .auth-form-panel {
    padding: 24px 20px;
  }
  .form-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>

<style scoped>
/* ═══════════════════════════════════════
   AUTH PAGE — Layout principal
   ═══════════════════════════════════════ */
.auth-page {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a2f1a 0%, #2d4a2d 40%, #3d5c3d 100%);
  overflow: hidden;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

/* Partículas flotantes */
.auth-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  animation: float-up 12s infinite ease-in-out;
  animation-delay: calc(var(--i) * -2s);
  left: calc(var(--i) * 16%);
  bottom: -10px;
}

@keyframes float-up {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
}

/* ═══════════════════════════════════════
   CONTAINER — Card principal
   ═══════════════════════════════════════ */
.auth-container {
  display: flex;
  width: 900px;
  max-width: 95vw;
  min-height: 560px;
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 1;
  animation: card-enter 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes card-enter {
  from { opacity: 0; transform: translateY(30px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ═══════════════════════════════════════
   BRAND PANEL — Panel izquierdo
   ═══════════════════════════════════════ */
.auth-brand {
  flex: 0 0 400px;
  background: url('/fondo-login.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  position: relative;
  overflow: hidden;
}

.brand-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 30%,
    rgba(0, 0, 0, 0.55) 65%,
    rgba(0, 0, 0, 0.8) 100%
  );
  z-index: 1;
  pointer-events: none;
}

.brand-content {
  text-align: center;
  color: #fff;
  position: relative;
  z-index: 2;
  padding: 32px 28px;
  width: 100%;
}

.brand-content h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.3px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.brand-content > p {
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.5;
  margin-bottom: 20px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  padding: 9px 14px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.feature-item i {
  font-size: 15px;
}

/* ═══════════════════════════════════════
   FORM PANEL — Panel derecho
   ═══════════════════════════════════════ */
.auth-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 44px;
  background: #fff;
}

.auth-form {
  width: 100%;
  max-width: 360px;
}

.form-header {
  margin-bottom: 32px;
}

.form-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.form-header p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* ═══════════════════════════════════════
   ALERTA INLINE
   ═══════════════════════════════════════ */
.alert-inline {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #dc2626;
  font-size: 13px;
  margin-bottom: 20px;
  animation: shake-anim 0.4s ease;
}

.alert-inline i:first-child { font-size: 16px; flex-shrink: 0; }
.alert-inline span { flex: 1; }

.alert-close {
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: 2px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.alert-close:hover { opacity: 1; }

@keyframes shake-anim {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

/* ═══════════════════════════════════════
   FORM GROUP — Inputs con floating label
   ═══════════════════════════════════════ */
.form-group {
  margin-bottom: 20px;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #9ca3af;
  transition: color 0.3s;
  z-index: 1;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  height: 52px;
  padding: 14px 48px 14px 44px;
  font-size: 15px;
  color: #1a1a1a;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.input-wrapper label {
  position: absolute;
  left: 44px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 15px;
  color: #9ca3af;
  pointer-events: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  padding: 0;
}

.form-group.is-focused .input-wrapper label {
  top: -1px;
  left: 12px;
  transform: translateY(-50%);
  font-size: 11px;
  font-weight: 600;
  color: #2e7d32;
  background: #fff;
  padding: 0 6px;
}

.form-group.is-focused .input-wrapper input {
  border-color: #2e7d32;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
}

.form-group.is-focused .input-icon {
  color: #2e7d32;
}

.form-group.has-error .input-wrapper input {
  border-color: #ef4444;
  background: #fefefe;
}

.form-group.has-error .input-icon { color: #ef4444; }

.form-group.has-error.is-focused .input-wrapper label { color: #ef4444; }

.form-group.has-error .input-wrapper input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.field-error {
  display: block;
  font-size: 12px;
  color: #ef4444;
  margin-top: 6px;
  padding-left: 4px;
}

.toggle-password {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  font-size: 16px;
  transition: color 0.2s;
}

.toggle-password:hover { color: #4b5563; }

/* ═══════════════════════════════════════
   FORM OPTIONS
   ═══════════════════════════════════════ */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 13px;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #4b5563;
  user-select: none;
}

.custom-checkbox input { display: none; }

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.custom-checkbox input:checked + .checkmark {
  background: #2e7d32;
  border-color: #2e7d32;
}

.custom-checkbox input:checked + .checkmark::after {
  content: '';
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translate(-1px, -1px);
}

.forgot-link {
  color: #2e7d32;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #1b5e20;
  text-decoration: underline;
}

/* ═══════════════════════════════════════
   SUBMIT BUTTON
   ═══════════════════════════════════════ */
.btn-submit {
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.btn-submit::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.35);
}

.btn-submit:hover::before { opacity: 1; }

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.3);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-submit i { font-size: 16px; transition: transform 0.2s; }
.btn-submit:hover i { transform: translateX(3px); }

.loader {
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ═══════════════════════════════════════
   DIVIDER + FOOTER
   ═══════════════════════════════════════ */
.form-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  color: #d1d5db;
  font-size: 13px;
}

.form-divider::before,
.form-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.form-divider span { color: #9ca3af; }

.social-login {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 48px;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.25s ease;
}

.social-btn:hover {
  border-color: #d1d5db;
  background: #f9fafb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.social-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.social-icon {
  flex-shrink: 0;
}

.form-footer {
  text-align: center;
}

.form-footer p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.link-accent {
  color: #2e7d32;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.link-accent:hover {
  color: #1b5e20;
  text-decoration: underline;
}

.shake-enter-active { animation: shake-anim 0.4s ease; }
.shake-leave-active { transition: opacity 0.2s; }
.shake-leave-to { opacity: 0; }

.slide-down-enter-active { transition: all 0.25s ease; }
.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from { opacity: 0; transform: translateY(-6px); }
.slide-down-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
    max-width: 440px;
    min-height: auto;
    margin: 16px;
  }
  .auth-brand {
    flex: none;
    padding: 32px 24px;
  }
  .brand-features { display: none; }
  .brand-content > p { margin-bottom: 0; }
  .auth-form-panel {
    padding: 32px 24px;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 0;
    align-items: stretch;
  }
  .auth-container {
    max-width: 100%;
    border-radius: 0;
    min-height: 100vh;
    margin: 0;
  }
  .auth-form-panel {
    padding: 24px 20px;
  }
  .form-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>