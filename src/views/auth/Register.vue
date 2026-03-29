<template>
  <div class="auth-page">
    <!-- Partículas decorativas -->
    <div class="auth-particles">
      <span v-for="n in 6" :key="n" class="particle" :style="{ '--i': n }"></span>
    </div>

    <div class="auth-container">
      <!-- Panel izquierdo: branding -->
      <div class="auth-brand">
        <div class="brand-overlay"></div>
        <div class="brand-content">
          <h2>Ecohotel Kofán</h2>
          <p>Crea tu cuenta y comienza a reservar experiencias inolvidables</p>
          <div class="brand-features">
            <div class="feature-item">
              <i class="bi bi-clock-history"></i>
              <span>Registro en menos de 1 minuto</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-calendar-check"></i>
              <span>Gestiona tus reservas fácilmente</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-percent"></i>
              <span>Accede a ofertas exclusivas</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel derecho: formulario -->
      <div class="auth-form-panel">
        <form @submit.prevent="submit" class="auth-form" novalidate>
          <div class="form-header">
            <h1>Crear cuenta</h1>
            <p>Completa tus datos para registrarte</p>
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

          <!-- Nombre completo -->
          <div class="form-group" :class="{ 'has-error': errors.fullName, 'is-focused': focused.fullName || fullName }">
            <div class="input-wrapper">
              <i class="bi bi-person input-icon"></i>
              <input
                v-model="fullName"
                type="text"
                id="reg-name"
                required
                autocomplete="name"
                @focus="focused.fullName = true"
                @blur="focused.fullName = false; validateField('fullName')"
              />
              <label for="reg-name">Nombre completo</label>
            </div>
            <transition name="slide-down">
              <span v-if="errors.fullName" class="field-error">{{ errors.fullName }}</span>
            </transition>
          </div>

          <!-- Email -->
          <div class="form-group" :class="{ 'has-error': errors.email, 'is-focused': focused.email || email }">
            <div class="input-wrapper">
              <i class="bi bi-envelope input-icon"></i>
              <input
                v-model="email"
                type="email"
                id="reg-email"
                required
                autocomplete="email"
                @focus="focused.email = true"
                @blur="focused.email = false; validateField('email')"
              />
              <label for="reg-email">Correo electrónico</label>
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
                id="reg-password"
                required
                autocomplete="new-password"
                @focus="focused.password = true"
                @blur="focused.password = false; validateField('password')"
                @input="validateField('password')"
              />
              <label for="reg-password">Contraseña</label>
              <button type="button" class="toggle-password" @click="showPassword = !showPassword" tabindex="-1">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <!-- Barra de fortaleza -->
            <div v-if="password" class="strength-bar">
              <div class="strength-track">
                <div class="strength-fill" :class="strengthClass" :style="{ width: strengthPercent + '%' }"></div>
              </div>
              <span class="strength-label" :class="strengthClass">{{ strengthLabel }}</span>
            </div>
            <transition name="slide-down">
              <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
            </transition>
          </div>

          <!-- Confirm Password -->
          <div class="form-group" :class="{ 'has-error': errors.confirmPassword, 'is-focused': focused.confirmPassword || confirmPassword }">
            <div class="input-wrapper">
              <i class="bi bi-shield-lock input-icon"></i>
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                id="reg-confirm"
                required
                autocomplete="new-password"
                @focus="focused.confirmPassword = true"
                @blur="focused.confirmPassword = false; validateField('confirmPassword')"
              />
              <label for="reg-confirm">Confirmar contraseña</label>
              <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword" tabindex="-1">
                <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <transition name="slide-down">
              <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
            </transition>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn-submit" :class="{ 'is-loading': isLoading }" :disabled="isLoading">
            <span v-if="!isLoading">
              Crear cuenta
              <i class="bi bi-arrow-right"></i>
            </span>
            <span v-else class="loader"></span>
          </button>

          <!-- Divider -->
          <div class="form-divider">
            <span>o</span>
          </div>

          <!-- Login link -->
          <div class="form-footer">
            <p>¿Ya tienes una cuenta? <router-link to="/login" class="link-accent">Iniciar sesión</router-link></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const auth = useAuthStore()
const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')
const router = useRouter()

const focused = reactive({ fullName: false, email: false, password: false, confirmPassword: false })
const errors = reactive({ fullName: '', email: '', password: '', confirmPassword: '' })

// Password strength
const passwordStrength = computed(() => {
  const p = password.value
  if (!p) return 0
  let score = 0
  if (p.length >= 6) score++
  if (p.length >= 10) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return Math.min(score, 4)
})

const strengthPercent = computed(() => (passwordStrength.value / 4) * 100)
const strengthClass = computed(() => ['weak', 'weak', 'medium', 'strong', 'very-strong'][passwordStrength.value])
const strengthLabel = computed(() => ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'][passwordStrength.value])

function validateField(field) {
  switch (field) {
    case 'fullName':
      errors.fullName = !fullName.value.trim() ? 'El nombre es obligatorio' : ''
      break
    case 'email':
      if (!email.value) {
        errors.email = 'El correo es obligatorio'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.email = 'Ingresa un correo válido'
      } else {
        errors.email = ''
      }
      break
    case 'password':
      if (!password.value) {
        errors.password = 'La contraseña es obligatoria'
      } else if (password.value.length < 6) {
        errors.password = 'Mínimo 6 caracteres'
      } else {
        errors.password = ''
      }
      // Re-validar confirmación si ya tiene valor
      if (confirmPassword.value) validateField('confirmPassword')
      break
    case 'confirmPassword':
      if (!confirmPassword.value) {
        errors.confirmPassword = 'Confirma tu contraseña'
      } else if (confirmPassword.value !== password.value) {
        errors.confirmPassword = 'Las contraseñas no coinciden'
      } else {
        errors.confirmPassword = ''
      }
      break
  }
}

function validateAll() {
  validateField('fullName')
  validateField('email')
  validateField('password')
  validateField('confirmPassword')
  return !errors.fullName && !errors.email && !errors.password && !errors.confirmPassword
}

async function submit() {
  errorMsg.value = ''
  if (!validateAll()) return

  isLoading.value = true
  await new Promise(r => setTimeout(r, 800))

  const userData = {
    fullName: fullName.value.trim(),
    email: email.value.trim(),
    password: password.value
  }
  localStorage.setItem('tempUser', JSON.stringify(userData))
  auth.login(email.value, password.value) // Se llama al login directamente

  isLoading.value = false

  Swal.fire({
    title: '¡Cuenta creada!',
    text: 'Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.',
    icon: 'success',
    confirmButtonColor: '#2e7d32'
  }).then(() => {
    router.push({ name: 'misreservas' })
  })
}
</script>

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

.auth-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
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
   CONTAINER
   ═══════════════════════════════════════ */
.auth-container {
  display: flex;
  width: 920px;
  max-width: 95vw;
  min-height: 620px;
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
   BRAND PANEL
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

.feature-item i { font-size: 15px; }

/* ═══════════════════════════════════════
   FORM PANEL
   ═══════════════════════════════════════ */
.auth-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 44px;
  background: #fff;
  overflow-y: auto;
}

.auth-form {
  width: 100%;
  max-width: 360px;
}

.form-header {
  margin-bottom: 28px;
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
  margin-bottom: 16px;
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
  margin-bottom: 18px;
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
  height: 50px;
  padding: 12px 48px 12px 44px;
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

.form-group.is-focused .input-icon { color: #2e7d32; }

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
   PASSWORD STRENGTH BAR
   ═══════════════════════════════════════ */
.strength-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  padding: 0 4px;
}

.strength-track {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: all 0.4s ease;
}

.strength-fill.weak { background: #ef4444; }
.strength-fill.medium { background: #f59e0b; }
.strength-fill.strong { background: #22c55e; }
.strength-fill.very-strong { background: #16a34a; }

.strength-label {
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.strength-label.weak { color: #ef4444; }
.strength-label.medium { color: #f59e0b; }
.strength-label.strong { color: #22c55e; }
.strength-label.very-strong { color: #16a34a; }

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
  margin-top: 6px;
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

.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

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

@keyframes spin { to { transform: rotate(360deg); } }

/* ═══════════════════════════════════════
   DIVIDER + FOOTER
   ═══════════════════════════════════════ */
.form-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 20px 0;
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

.form-footer { text-align: center; }

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

/* ═══════════════════════════════════════
   TRANSITIONS
   ═══════════════════════════════════════ */
.shake-enter-active { animation: shake-anim 0.4s ease; }
.shake-leave-active { transition: opacity 0.2s; }
.shake-leave-to { opacity: 0; }

.slide-down-enter-active { transition: all 0.25s ease; }
.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from { opacity: 0; transform: translateY(-6px); }
.slide-down-leave-to { opacity: 0; transform: translateY(-6px); }

/* ═══════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════ */
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

  .auth-form-panel { padding: 28px 24px; }
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

  .auth-form-panel { padding: 24px 20px; }
}
</style>
