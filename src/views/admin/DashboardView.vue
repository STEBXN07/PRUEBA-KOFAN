
<template>
<div>
  <h2 class="mb-4">Dashboard</h2>
  <div class="row g-4">
    <div class="col-md-4">
      <div
        class="card shadow-sm dashboard-card"
        @click="$router.push('/admin/gallery')"
      >
        <div class="card-body text-center">
          <i class="bi bi-images display-4"></i>
          <h5 class="mt-3">Galeria de Imagenes</h5>
          <p class="text-muted">Administrar imágenes</p>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div
        class="card shadow-sm dashboard-card"
        @click="$router.push('/admin/reservations')"
      >
        <div class="card-body text-center">
          <i class="bi bi-calendar-check display-4"></i>
          <h5 class="mt-3">Reservas</h5>
          <p class="text-muted">Administrar reservas</p>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div
        class="card shadow-sm dashboard-card"
        @click="$router.push('/admin/rooms')"
      >
        <div class="card-body text-center">
          <i class="bi bi-door-open display-4"></i>
          <h5 class="mt-3">Habitaciones</h5>
          <p class="text-muted">Administrar habitaciones</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

.dashboard-card {
  cursor: pointer;
  transition: 0.2s;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

</style>

