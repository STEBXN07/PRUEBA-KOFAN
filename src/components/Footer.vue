<script setup>
</script>

<template>
<nav class="navbar navbar-expand-lg navbar-dark pt-1 px-4"></nav>
    <footer class="text-white py-4 mt-5" style="background-color: var(--color-fondo-cafe);">
    <div class="container">
        <div class="row">
        <div class="col-md-4 mb-3">
            <h5 class="text-uppercase fw-bold">Ecohotel Kofán</h5>
            <p>Tu refugio natural en el corazón del Putumayo. Vive la experiencia de la biodiversidad y la cultura.</p>
        </div>

        <div class="col-md-4 mb-3">
            <h5 class="text-uppercase fw-bold">Enlaces Rápidos</h5>
            <ul class="list-unstyled">
            <li><RouterLink to="/" class="text-white text-decoration-none">Inicio</RouterLink></li>
            <li><RouterLink to="/eventos" class="text-white text-decoration-none">Eventos</RouterLink></li>
            </ul>
        </div>

        <div class="col-md-3">
            <h5 class="text-uppercase fw-bold">Contáctanos</h5>
            <p>
            <i class="bi bi-geo-alt-fill"></i> Puerto Asís, Putumayo<br>
            <i class="bi bi-telephone-fill"></i> +57 300 123 4567<br>
            <i class="bi bi-envelope-fill"></i> reservas@ecohotelkofan.com
            </p>
        </div>
        </div>

        <hr>
        <div class="text-center">
        <small>&copy; 2025 Ecohotel Kofán. Todos los derechos reservados.</small>
        </div>
    </div>

    </footer>
</template>