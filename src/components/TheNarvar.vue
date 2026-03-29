<script setup>
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ref, onMounted, onUnmounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const scrolled = ref(false)
const mobileOpen = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

function closeMobile() {
  mobileOpen.value = false
}

const logout = () => {
  authStore.logout()
  closeMobile()
  router.push('/')
}
</script>

<template>
  <nav class="kf-nav" :class="{ 'kf-nav--scrolled': scrolled }">
    <div class="kf-nav__inner">

      <!-- Brand -->
      <RouterLink class="kf-brand" to="/" @click="closeMobile">
        <span class="kf-brand__icon">
          <i class="bi bi-flower2"></i>
        </span>
        <div class="kf-brand__text">
          <span class="kf-brand__name">Ecohotel</span>
          <span class="kf-brand__accent">Kofán</span>
        </div>
      </RouterLink>

      <!-- Desktop Navigation -->
      <div class="kf-nav__links" :class="{ 'kf-nav__links--open': mobileOpen }">
        <div class="kf-nav__group kf-nav__group--main">
          <RouterLink
            class="kf-link"
            :class="{ 'kf-link--active': route.path === '/' }"
            to="/"
            @click="closeMobile"
          >
            <span class="kf-link__text">Inicio</span>
          </RouterLink>
          <RouterLink
            class="kf-link"
            :class="{ 'kf-link--active': route.path === '/eventos' }"
            to="/eventos"
            @click="closeMobile"
          >
            <span class="kf-link__text">Eventos</span>
          </RouterLink>
          <RouterLink
            v-if="authStore.isLogged"
            class="kf-link"
            :class="{ 'kf-link--active': route.path === '/misreservas' }"
            to="/misreservas"
            @click="closeMobile"
          >
            <span class="kf-link__text">Mis Reservas</span>
          </RouterLink>
        </div>

        <div class="kf-nav__separator"></div>

        <!-- Not Logged In -->
        <div v-if="!authStore.isLogged" class="kf-nav__group kf-nav__group--auth">
          <RouterLink class="kf-link" to="/login" @click="closeMobile">
            <i class="bi bi-box-arrow-in-right kf-link__icon"></i>
            <span class="kf-link__text">Iniciar Sesión</span>
          </RouterLink>
          <RouterLink class="kf-btn kf-btn--register" to="/register" @click="closeMobile">
            Registrarse
          </RouterLink>
        </div>

        <!-- Logged In -->
        <div v-else class="kf-nav__group kf-nav__group--user">
          <div class="kf-user">
            <div class="kf-user__avatar">
              <i class="bi bi-person-fill"></i>
            </div>
            <span class="kf-user__name">
              {{ (authStore.user?.names || authStore.user?.fullName || authStore.user?.email || 'Usuario').split(' ')[0] }}
            </span>
          </div>

          <RouterLink class="kf-btn kf-btn--reserve" to="/reservar" @click="closeMobile">
            <i class="bi bi-calendar-plus me-1"></i>
            Reservar
          </RouterLink>

          <RouterLink
            v-if="authStore.isAdmin"
            class="kf-link kf-link--admin"
            to="/admin/dashboard"
            @click="closeMobile"
          >
            <i class="bi bi-shield-lock kf-link__icon"></i>
            <span class="kf-link__text">Admin</span>
          </RouterLink>

          <button class="kf-link kf-link--logout" @click="logout">
            <i class="bi bi-power kf-link__icon"></i>
            <span class="kf-link__text">Salir</span>
          </button>
        </div>
      </div>

      <!-- Mobile Toggle -->
      <button
        class="kf-toggle"
        :class="{ 'kf-toggle--open': mobileOpen }"
        @click="toggleMobile"
        aria-label="Toggle navigation"
      >
        <span class="kf-toggle__bar"></span>
        <span class="kf-toggle__bar"></span>
        <span class="kf-toggle__bar"></span>
      </button>
    </div>

    <!-- Mobile Overlay -->
    <transition name="overlay-fade">
      <div v-if="mobileOpen" class="kf-overlay" @click="closeMobile"></div>
    </transition>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

/* ═══════════════════════════════════════════
   NAV BASE
   ═══════════════════════════════════════════ */
.kf-nav {
  position: relative;
  z-index: 1000;
  width: 100%;
  transition: background 0.4s ease, box-shadow 0.4s ease;
}

.kf-nav--scrolled {
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.12);
}

.kf-nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 32px;
  height: 72px;
}

/* ═══════════════════════════════════════════
   BRAND
   ═══════════════════════════════════════════ */
.kf-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  flex-shrink: 0;
}

.kf-brand__icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #c9a96e;
  transition: all 0.3s ease;
}

.kf-brand:hover .kf-brand__icon {
  background: rgba(201, 169, 110, 0.15);
  border-color: rgba(201, 169, 110, 0.3);
  transform: rotate(15deg);
}

.kf-brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.kf-brand__name {
  font-family: 'Outfit', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.kf-brand__accent {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
  margin-top: -1px;
}

/* ═══════════════════════════════════════════
   NAV LINKS CONTAINER
   ═══════════════════════════════════════════ */
.kf-nav__links {
  display: flex;
  align-items: center;
  gap: 6px;
}

.kf-nav__group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.kf-nav__separator {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.12);
  margin: 0 12px;
}

/* ═══════════════════════════════════════════
   NAV LINKS
   ═══════════════════════════════════════════ */
.kf-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.25s ease;
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
}

.kf-link::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  width: 0;
  height: 1.5px;
  background: #c9a96e;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-50%);
  border-radius: 1px;
}

.kf-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
}

.kf-link:hover::after {
  width: 60%;
}

.kf-link--active {
  color: #fff;
}

.kf-link--active::after {
  width: 60%;
  background: #c9a96e;
}

.kf-link__icon {
  font-size: 0.9rem;
  opacity: 0.7;
  transition: opacity 0.25s;
}

.kf-link:hover .kf-link__icon {
  opacity: 1;
}

/* Admin link */
.kf-link--admin {
  color: rgba(201, 169, 110, 0.8);
}

.kf-link--admin:hover {
  color: #c9a96e;
  background: rgba(201, 169, 110, 0.08);
}

.kf-link--admin::after {
  background: #c9a96e;
}

/* Logout */
.kf-link--logout {
  color: rgba(255, 255, 255, 0.5);
}

.kf-link--logout:hover {
  color: #ef9a9a;
  background: rgba(239, 154, 154, 0.08);
}

.kf-link--logout::after {
  background: #ef9a9a;
}

/* ═══════════════════════════════════════════
   BUTTONS
   ═══════════════════════════════════════════ */
.kf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 22px;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  border: none;
}

.kf-btn--register {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.kf-btn--register:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.kf-btn--reserve {
  background: linear-gradient(135deg, #c9a96e 0%, #b8944f 100%);
  color: #1a2a1f;
  box-shadow: 0 2px 8px rgba(201, 169, 110, 0.25);
}

.kf-btn--reserve:hover {
  background: linear-gradient(135deg, #d4b87d 0%, #c9a96e 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(201, 169, 110, 0.35);
  color: #1a2a1f;
}

/* ═══════════════════════════════════════════
   USER INFO
   ═══════════════════════════════════════════ */
.kf-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 14px 4px 4px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-right: 8px;
}

.kf-user__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c9a96e 0%, #b8944f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: #1a2a1f;
}

.kf-user__name {
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.3px;
}

/* ═══════════════════════════════════════════
   MOBILE TOGGLE (Hamburger)
   ═══════════════════════════════════════════ */
.kf-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 1001;
}

.kf-toggle:hover {
  background: rgba(255, 255, 255, 0.12);
}

.kf-toggle__bar {
  display: block;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.kf-toggle--open .kf-toggle__bar:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.kf-toggle--open .kf-toggle__bar:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.kf-toggle--open .kf-toggle__bar:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* ═══════════════════════════════════════════
   MOBILE OVERLAY
   ═══════════════════════════════════════════ */
.kf-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 998;
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* ═══════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════ */
@media (max-width: 991px) {
  .kf-toggle {
    display: flex;
  }

  .kf-nav__links {
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100vh;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 88px 24px 32px;
    background: linear-gradient(180deg, #2a4a38 0%, #1a3428 100%);
    box-shadow: -8px 0 32px rgba(0, 0, 0, 0.3);
    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;
    overflow-y: auto;
  }

  .kf-nav__links--open {
    transform: translateX(0);
  }

  .kf-nav__separator {
    width: 100%;
    height: 1px;
    margin: 16px 0;
    background: rgba(255, 255, 255, 0.08);
  }

  .kf-nav__group {
    flex-direction: column;
    gap: 4px;
  }

  .kf-link {
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 0.88rem;
  }

  .kf-link::after {
    display: none;
  }

  .kf-link--active {
    background: rgba(255, 255, 255, 0.08);
  }

  .kf-btn {
    width: 100%;
    justify-content: center;
    padding: 13px 20px;
    font-size: 0.85rem;
  }

  .kf-user {
    margin-right: 0;
    margin-bottom: 8px;
    padding: 10px 16px;
    border-radius: 12px;
    justify-content: flex-start;
  }
}

@media (max-width: 575px) {
  .kf-nav__inner {
    padding: 0 18px;
    height: 64px;
  }

  .kf-brand__icon {
    width: 34px;
    height: 34px;
    font-size: 0.9rem;
  }

  .kf-brand__accent {
    font-size: 1.2rem;
  }

  .kf-brand__name {
    font-size: 0.58rem;
  }

  .kf-nav__links {
    width: 280px;
    padding: 76px 20px 28px;
  }
}
</style>
