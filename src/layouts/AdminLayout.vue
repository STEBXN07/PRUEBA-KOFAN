<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getUserProfile, logout } from "@/services/authService"

const router = useRouter()

const user = ref()
const errorMessage = ref('')
const isLoading = ref(false)

const sidebarCollapsed = ref(false)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const loadProfile = async () => {
  isLoading.value = true
  try {
    const profile = await getUserProfile()
    user.value = profile
  } catch (error) {
    errorMessage.value = "Sesión expirada o inválida";
    console.error("Error de autenticacion :", error);
    logout();
    router.push("/login");
  } finally {
    isLoading.value = false
  }

}

const handleLogout = () => {
  logout()
  router.push("/login")
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
<div class="admin-wrapper d-flex">
  <!-- SIDEBAR -->
  <aside class="sidebar bg-dark text-white" :class="{ collapsed: sidebarCollapsed }">
    <div class="sidebar-header text-center py-3">
      <h5 v-if="!sidebarCollapsed">Terrakofan Hotel Admin</h5>
      <i v-else class="bi bi-building"></i>
    </div>
    <ul class="nav flex-column">

      <li class="nav-item">
        <router-link class="nav-link" to="/admin/dashboard">
          <i class="bi bi-speedometer2 me-2"></i>
          <span v-if="!sidebarCollapsed">Dashboard</span>
        </router-link>
      </li>

      <li class="nav-item">
        <router-link class="nav-link" to="/admin/gallery">
          <i class="bi bi-images me-2"></i>
          <span v-if="!sidebarCollapsed">Gallery</span>
        </router-link>
      </li>

      <li class="nav-item">
        <router-link class="nav-link" to="/admin/reservations">
          <i class="bi bi-calendar-check me-2"></i>
          <span v-if="!sidebarCollapsed">Reservations</span>
        </router-link>
      </li>

      <li class="nav-item">
        <router-link class="nav-link" to="/admin/rooms">
          <i class="bi bi-door-open me-2"></i>
          <span v-if="!sidebarCollapsed">Rooms</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/users" class="nav-link text-white py-3 px-4 border-bottom border-secondary">
          <i class="bi bi-people me-2"></i>
          <span v-if="!sidebarCollapsed">Usuarios</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/config" class="nav-link text-white py-3 px-4 border-bottom border-secondary">
          <i class="bi bi-gear me-2"></i>
          <span v-if="!sidebarCollapsed">Configuración</span>
        </router-link>
      </li>
    </ul>
  </aside>

  <!-- MAIN -->
  <div class="main-area flex-grow-1">

    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-3">
      <button class="btn btn-outline-secondary me-3" @click="toggleSidebar">
        <i class="bi bi-list"></i>
      </button>
      <div class="ms-auto dropdown">
        <button
          class="btn btn-light dropdown-toggle"
          data-bs-toggle="dropdown"
        >
          <i class="bi bi-person-circle me-2"></i>
          {{user?.role}}: {{ user?.email }}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">

          <li class="px-3 py-2 small text-muted">
            {{ user?.names }} {{ user?.surnames }}
          </li>

          <li><hr class="dropdown-divider"></li>

          <li class="px-3 pb-2">
            <button class="btn btn-outline-danger w-100" @click="handleLogout">
              Salir
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <!-- CONTENT -->
    <div class="content p-4">
      <div v-if="isLoading" class="text-center mt-5">
        <div class="spinner-border"></div>
      </div>
      <div v-else>
        <router-view />
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.admin-wrapper {
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  transition: 0.3s;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar .nav-link {
  color: #ddd;
  padding: 12px 20px;
}

.sidebar .nav-link:hover {
  background: rgba(255,255,255,0.1);
}

.sidebar-header {
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.main-area {
  background: #f6f8fb;
  min-height: 100vh;
}

.content {
  max-width: 1400px;
}

</style>

