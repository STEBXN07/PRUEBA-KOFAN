<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const sidebarCollapsed = ref(false)
const loaded = ref(false)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

const currentDate = new Date().toLocaleDateString('es-CO', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

onMounted(() => {
  setTimeout(() => { loaded.value = true }, 50)
})
</script>

<template>
  <div class="admin-shell" :class="{ loaded }">
    <!-- SIDEBAR -->
    <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <!-- Brand -->
      <div class="sidebar-brand">
        <div class="brand-icon">
          <i class="bi bi-flower3"></i>
        </div>
        <transition name="fade-text">
          <div v-if="!sidebarCollapsed" class="brand-text">
            <span class="brand-name">Ecohotel</span>
            <span class="brand-accent">Kofan</span>
          </div>
        </transition>
      </div>

      <!-- Divider -->
      <div class="sidebar-divider">
        <div class="divider-line"></div>
        <div class="divider-ornament" v-if="!sidebarCollapsed">
          <i class="bi bi-diamond-fill"></i>
        </div>
        <div class="divider-line"></div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <span class="nav-section-label" v-if="!sidebarCollapsed">PRINCIPAL</span>
        <RouterLink
          class="sidebar-link"
          to="/admin/dashboard"
          :class="{ active: route.path === '/admin/dashboard' || route.path === '/admin' }"
        >
          <div class="link-icon">
            <i class="bi bi-grid-1x2"></i>
          </div>
          <span v-if="!sidebarCollapsed" class="link-text">Dashboard</span>
          <span v-if="!sidebarCollapsed" class="link-arrow">
            <i class="bi bi-chevron-right"></i>
          </span>
        </RouterLink>

        <RouterLink
          class="sidebar-link"
          to="/admin/reservas"
          :class="{ active: route.path === '/admin/reservas' }"
        >
          <div class="link-icon">
            <i class="bi bi-journal-bookmark"></i>
          </div>
          <span v-if="!sidebarCollapsed" class="link-text">Reservas</span>
          <span v-if="!sidebarCollapsed" class="link-arrow">
            <i class="bi bi-chevron-right"></i>
          </span>
        </RouterLink>

        <RouterLink
          class="sidebar-link"
          to="/admin/cotizaciones"
          :class="{ active: route.path === '/admin/cotizaciones' }"
        >
          <div class="link-icon">
            <i class="bi bi-file-earmark-text"></i>
          </div>
          <span v-if="!sidebarCollapsed" class="link-text">Cotizaciones</span>
          <span v-if="!sidebarCollapsed" class="link-arrow">
            <i class="bi bi-chevron-right"></i>
          </span>
        </RouterLink>

        <RouterLink
          class="sidebar-link"
          to="/admin/clientes"
          :class="{ active: route.path === '/admin/clientes' }"
        >
          <div class="link-icon">
            <i class="bi bi-people"></i>
          </div>
          <span v-if="!sidebarCollapsed" class="link-text">Clientes</span>
          <span v-if="!sidebarCollapsed" class="link-arrow">
            <i class="bi bi-chevron-right"></i>
          </span>
        </RouterLink>
      </nav>

      <!-- Bottom -->
      <div class="sidebar-footer">
        <RouterLink class="sidebar-link sidebar-link-back" to="/">
          <div class="link-icon">
            <i class="bi bi-arrow-left-short"></i>
          </div>
          <span v-if="!sidebarCollapsed" class="link-text">Volver al sitio</span>
        </RouterLink>
      </div>
    </aside>

    <!-- MAIN AREA -->
    <div class="admin-main">
      <!-- Top Bar -->
      <header class="admin-topbar">
        <div class="topbar-left">
          <button class="toggle-btn" @click="toggleSidebar">
            <i class="bi" :class="sidebarCollapsed ? 'bi-text-indent-left' : 'bi-text-indent-right'"></i>
          </button>
          <div class="topbar-breadcrumb d-none d-md-block">
            <span class="breadcrumb-date">{{ currentDate }}</span>
          </div>
        </div>

        <div class="topbar-right">
          <!-- User dropdown -->
          <div class="dropdown">
            <button class="user-btn" data-bs-toggle="dropdown">
              <div class="user-avatar">
                {{ (authStore.user?.names || authStore.user?.surnames || 'A').charAt(0).toUpperCase() }}
              </div>
              <div class="user-info d-none d-sm-block">
                <span class="user-name">{{ authStore.user?.names || authStore.user?.surnames || 'Admin' }}</span>
                <span class="user-role">Administrador</span>
              </div>
              <i class="bi bi-chevron-down ms-2 d-none d-sm-inline"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end admin-dropdown">
              <li class="dropdown-header">
                <div class="dropdown-user-info">
                  <div class="dropdown-avatar">
                    {{ (authStore.user?.names || authStore.user?.surnames || 'A').charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <strong>{{ authStore.user?.names || authStore.user?.surnames || 'Admin' }}</strong>
                    <small>{{ authStore.user?.email }}</small>
                  </div>
                </div>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item logout-item" @click="handleLogout">
                  <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesion
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="admin-page">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════
   ADMIN SHELL
   ═══════════════════════════════════════════ */
.admin-shell {
  display: flex;
  min-height: 100vh;
  opacity: 0;
  transition: opacity 0.6s ease;
}
.admin-shell.loaded {
  opacity: 1;
}

/* ═══════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════ */
.admin-sidebar {
  width: 260px;
  background: #264e36;
  display: flex;
  flex-direction: column;
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  z-index: 100;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
}
.admin-sidebar.collapsed {
  width: 76px;
}

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 24px 20px 20px;
}
.brand-icon {
  width: 42px;
  height: 42px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}
.brand-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: #f5f0e6;
  letter-spacing: 0.5px;
}
.brand-accent {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.55);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 500;
}

/* Divider */
.sidebar-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 20px 16px;
}
.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
}
.divider-ornament {
  font-size: 0.35rem;
  color: rgba(255, 255, 255, 0.2);
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 0 12px;
}
.nav-section-label {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 2.5px;
  padding: 0 12px 10px;
  text-transform: uppercase;
}
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  margin-bottom: 4px;
  border-radius: 10px;
  text-decoration: none;
  color: rgba(245, 240, 230, 0.55);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.25s ease;
  position: relative;
}
.sidebar-link:hover {
  color: #f5f0e6;
  background: rgba(255, 255, 255, 0.08);
}
.sidebar-link.active {
  color: #f5f0e6;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}
.sidebar-link.active .link-icon {
  color: #fff;
}
.link-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  border-radius: 8px;
  flex-shrink: 0;
  transition: color 0.25s;
}
.link-text {
  flex: 1;
  white-space: nowrap;
}
.link-arrow {
  font-size: 0.65rem;
  opacity: 0;
  transition: all 0.2s;
  transform: translateX(-4px);
}
.sidebar-link:hover .link-arrow,
.sidebar-link.active .link-arrow {
  opacity: 0.5;
  transform: translateX(0);
}

/* Footer */
.sidebar-footer {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.sidebar-link-back {
  font-size: 0.82rem;
}

/* ═══════════════════════════════════════════
   MAIN AREA
   ═══════════════════════════════════════════ */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f4f6f3;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Top Bar */
.admin-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  height: 68px;
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 50;
}
.topbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}
.toggle-btn {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  background: #fff;
  font-size: 1.15rem;
  color: #5d4037;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.toggle-btn:hover {
  background: #f4f6f3;
  border-color: rgba(38, 78, 54, 0.3);
  color: #264e36;
}
.breadcrumb-date {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  color: #999;
  text-transform: capitalize;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* User Button */
.user-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}
.user-btn:hover {
  background: #faf8f4;
  border-color: rgba(38, 78, 54, 0.2);
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #264e36;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 0.95rem;
}
.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  text-align: left;
}
.user-name {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #2c1810;
}
.user-role {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.68rem;
  color: #999;
}
.user-btn .bi-chevron-down {
  font-size: 0.65rem;
  color: #999;
}

/* Dropdown */
.admin-dropdown {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  padding: 8px;
  min-width: 240px;
  margin-top: 8px !important;
}
.dropdown-header {
  padding: 12px !important;
}
.dropdown-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.dropdown-user-info strong {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  color: #2c1810;
}
.dropdown-user-info small {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.72rem;
  color: #999;
}
.dropdown-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #264e36;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 1rem;
}
.logout-item {
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  color: #c0392b;
  padding: 10px 14px;
}
.logout-item:hover {
  background: #fef5f5;
  color: #c0392b;
}

/* Page Content */
.admin-page {
  flex: 1;
  padding: 32px;
  max-width: 1440px;
}

/* ═══════════════════════════════════════════
   TEXT TRANSITION
   ═══════════════════════════════════════════ */
.fade-text-enter-active {
  transition: all 0.3s ease 0.1s;
}
.fade-text-leave-active {
  transition: all 0.15s ease;
}
.fade-text-enter-from,
.fade-text-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

/* ═══════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .admin-sidebar {
    width: 76px;
  }
  .admin-sidebar .brand-text,
  .admin-sidebar .nav-section-label,
  .admin-sidebar .link-text,
  .admin-sidebar .link-arrow,
  .admin-sidebar .divider-ornament,
  .admin-sidebar .sidebar-link-back .link-text {
    display: none;
  }
  .admin-page {
    padding: 20px 16px;
  }
  .admin-topbar {
    padding: 0 16px;
  }
}
</style>
