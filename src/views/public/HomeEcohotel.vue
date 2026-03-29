<script setup>

</script>

<template>
<div class="container-fluid p-0">
    <div class="row vh-100 m-0">

    <div class="col-lg-6 d-flex flex-column p-0 hero-text-column">
        
        <TheNarvar />

        <div class="hero-content flex-grow-1 d-flex flex-column justify-content-center px-5">
            <h1 class="display-3 fw-bold">BIENVENIDOS!</h1>
            <p class="lead fs-4">VIVE TU EVENTO EN UN ENTORNO ÚNICO</p>
            <p class="fs-6 fw-light">
                CELEBRA MOMENTOS INOLVIDABLES EN EL CORAZÓN DEL PUTUMAYO.
            </p>
            
            <router-link to="/eventos" class="btn btn-custom mt-3 text-uppercase">
                Eventos
            </router-link>
        </div>
    </div>

    <div class="col-lg-6 p-0 hero-image-column d-flex justify-content-end align-items-start">
        <img src="/kofan-logo-overlay.png" alt="Logo Kofán" class="overlay-logo mt-4 me-4">
        <div class="decorative-line-v"></div>
        <div class="decorative-line-h"></div>
    </div>

    </div>
  </div>
</template>
