<script setup>
import TheNarvar from '../components/TheNarvar.vue'
import { ref, onMounted } from 'vue'

const loaded = ref(false)
onMounted(() => {
  setTimeout(() => { loaded.value = true }, 60)
})
</script>

<template>
  <div class="home" :class="{ loaded }">

    <!-- Full-width navbar -->
    <div class="home-nav">
      <TheNarvar />
    </div>

    <!-- Split Hero -->
    <div class="hero">
      <!-- Left — Text -->
      <div class="hero__left">
        <div class="hero__content">
          <span class="hero__location">
            <i class="bi bi-geo-alt"></i>
            Puerto Asis, Putumayo
          </span>

          <h1 class="hero__title">
            Bienvenidos
          </h1>

          <div class="hero__line"></div>

          <p class="hero__subtitle">
            Vive tu evento en un entorno unico
          </p>

          <p class="hero__desc">
            Celebra momentos inolvidables en el corazon del Putumayo.
          </p>

          <router-link to="/eventos" class="hero__cta">
            <span>Explorar Eventos</span>
            <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>
      </div>

      <!-- Right — Image -->
      <div class="hero__right">
        <div class="hero__image-wrap">
          <div class="hero__image"></div>
          <img src="/kofan-logo-overlay.png" alt="Logo Kofan" class="hero__logo">
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');

/* ═══════════════════════════════════════════
   BASE
   ═══════════════════════════════════════════ */
.home {
  min-height: 100vh;
  background: #1a2a1f;
}

/* ═══════════════════════════════════════════
   NAVBAR WRAPPER
   ═══════════════════════════════════════════ */
.home-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(180deg, rgba(26, 42, 31, 0.85) 0%, transparent 100%);
}

/* ═══════════════════════════════════════════
   HERO SPLIT
   ═══════════════════════════════════════════ */
.hero {
  display: flex;
  min-height: 100vh;
}

/* ── Left Panel ── */
.hero__left {
  flex: 0 0 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2c3e2e;
  position: relative;
  overflow: hidden;
}

.hero__left::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 70%, rgba(201, 169, 110, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
  pointer-events: none;
}

/* ── Content ── */
.hero__content {
  position: relative;
  z-index: 2;
  padding: 120px 60px 60px;
  max-width: 520px;
  opacity: 0;
  transform: translateY(20px);
}

.home.loaded .hero__content {
  animation: fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards;
}

.hero__location {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #c9a96e;
  margin-bottom: 32px;
}

.hero__location i {
  font-size: 0.8rem;
}

.hero__title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 4.5rem;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  margin: 0 0 24px;
  letter-spacing: -0.5px;
}

.hero__line {
  width: 48px;
  height: 1.5px;
  background: #c9a96e;
  margin-bottom: 24px;
}

.hero__subtitle {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.4rem;
  font-weight: 400;
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 16px;
  line-height: 1.4;
}

.hero__desc {
  font-family: 'Outfit', sans-serif;
  font-size: 0.88rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.45);
  margin: 0 0 40px;
  line-height: 1.6;
}

/* ── CTA Button ── */
.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 15px 32px;
  background: transparent;
  border: 1px solid rgba(201, 169, 110, 0.4);
  border-radius: 4px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #c9a96e;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero__cta i {
  font-size: 0.9rem;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero__cta:hover {
  background: #c9a96e;
  border-color: #c9a96e;
  color: #1a2a1f;
}

.hero__cta:hover i {
  transform: translateX(4px);
}

/* ── Right Panel (Image) ── */
.hero__right {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.hero__image-wrap {
  position: absolute;
  inset: 0;
}

.hero__image {
  position: absolute;
  inset: 0;
  background: url('/fondo-hotel.jpg') no-repeat center center;
  background-size: cover;
  transform: scale(1.03);
  transition: transform 8s ease-out;
}

.home.loaded .hero__image {
  transform: scale(1);
}

.hero__logo {
  position: absolute;
  top: 32px;
  right: 32px;
  width: 100px;
  opacity: 0.85;
  z-index: 2;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

/* ═══════════════════════════════════════════
   ANIMATION
   ═══════════════════════════════════════════ */
@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ═══════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════ */
@media (max-width: 991px) {
  .hero {
    flex-direction: column;
  }

  .hero__left {
    flex: none;
    min-height: 100vh;
    position: relative;
  }

  .hero__left::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(26, 42, 31, 0.85) 0%, rgba(26, 42, 31, 0.6) 50%, rgba(26, 42, 31, 0.85) 100%);
    z-index: 1;
    pointer-events: none;
  }

  .hero__left::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/fondo-hotel.jpg') no-repeat center center;
    background-size: cover;
    z-index: 0;
  }

  .hero__right {
    display: none;
  }

  .hero__content {
    padding: 140px 32px 60px;
    text-align: center;
    max-width: 480px;
  }

  .hero__location {
    justify-content: center;
  }

  .hero__title {
    font-size: 3.5rem;
  }

  .hero__line {
    margin-left: auto;
    margin-right: auto;
  }

  .hero__cta {
    justify-content: center;
    width: 100%;
    max-width: 280px;
    margin: 0 auto;
  }
}

@media (max-width: 575px) {
  .hero__content {
    padding: 120px 24px 48px;
  }

  .hero__title {
    font-size: 2.8rem;
  }

  .hero__subtitle {
    font-size: 1.15rem;
  }

  .hero__desc {
    font-size: 0.82rem;
  }
}
</style>
