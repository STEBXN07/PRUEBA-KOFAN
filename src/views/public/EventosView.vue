<script setup>
import { ref, onMounted } from 'vue'

const loaded = ref(false)
const whatsappNumber = '57322 7049620' // Cambia por tu numero real

onMounted(() => {
  setTimeout(() => { loaded.value = true }, 80)
})

const listaEventos = ref([
  {
    id: 1,
    titulo: 'Bodas',
    subtitulo: 'Amor en la naturaleza',
    descripcion: 'Celebra tu union rodeado de naturaleza con nuestra decoracion exclusiva estilo Kofan. Un escenario magico para el dia mas importante.',
    imagen: 'https://static.wixstatic.com/media/3e114d_e307df93a25543d4aad88c536906ccbc~mv2.jpg/v1/fill/w_640,h_526,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/3e114d_e307df93a25543d4aad88c536906ccbc~mv2.jpg',
    icono: 'bi-heart-fill'
  },
  {
    id: 2,
    titulo: 'Retiros',
    subtitulo: 'Reconecta y transforma',
    descripcion: 'Desconecta a tu equipo de la rutina y conecta con la productividad en un ambiente relajado rodeado del Putumayo.',
    imagen: 'https://res.cloudinary.com/worldpackers/image/upload/c_limit,f_auto,q_auto,w_1140/uxpqmab6idt5eqqi1dg2',
    icono: 'bi-tree-fill'
  },
  {
    id: 3,
    titulo: 'Cenas',
    subtitulo: 'Gastronomia bajo las estrellas',
    descripcion: 'Una velada inolvidable bajo las estrellas con lo mejor de la gastronomia del Putumayo. Sabores que enamoran.',
    imagen: 'https://img.freepik.com/foto-gratis/cena-lujo-hora-tarde-amigos-cenan-hermoso-lugar-al-aire-libre_146671-14453.jpg',
    icono: 'bi-stars'
  }
])

function handleTilt(e, cardId) {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateX = ((y - centerY) / centerY) * -8
  const rotateY = ((x - centerX) / centerX) * 8

  card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
}

function resetTilt(e) {
  e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
}

function openWhatsApp() {
  const msg = encodeURIComponent('Hola, estoy interesado en los eventos del Ecohotel Kofan. Me gustaria recibir mas informacion.')
  window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank')
}
</script>

<template>
  <div class="eventos-page" :class="{ loaded }">
    <!-- Hero -->
    <section class="ev-hero">
      <div class="ev-hero__inner">
        <span class="ev-hero__tag">E X P E R I E N C I A S</span>
        <h1 class="ev-hero__title">Nuestros Eventos</h1>
        <div class="ev-hero__line"></div>
        <p class="ev-hero__sub">Momentos unicos en el corazon del Putumayo</p>
      </div>
    </section>

    <!-- 3D Cards Section -->
    <section class="ev-section">
      <div class="ev-grid">
        <div
          v-for="(evento, i) in listaEventos"
          :key="evento.id"
          class="ev-card-wrapper"
          :style="{ '--delay': (0.15 + i * 0.13) + 's' }"
        >
          <div
            class="ev-card"
            @mousemove="handleTilt($event, evento.id)"
            @mouseleave="resetTilt"
          >
            <!-- Reflection / shine layer -->
            <div class="ev-card__gloss"></div>

            <!-- Image -->
            <div class="ev-card__img-box">
              <img :src="evento.imagen" :alt="evento.titulo" class="ev-card__img" loading="lazy">
              <div class="ev-card__img-overlay"></div>
              <span class="ev-card__number">0{{ evento.id }}</span>
            </div>

            <!-- Body -->
            <div class="ev-card__body">
              <span class="ev-card__label">{{ evento.subtitulo }}</span>
              <h3 class="ev-card__title">{{ evento.titulo }}</h3>
              <p class="ev-card__desc">{{ evento.descripcion }}</p>
              <router-link to="/reservar" class="ev-card__cta">
                Reservar
                <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>

            <!-- 3D edge shadow -->
            <div class="ev-card__edge"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Floating WhatsApp -->
    <button class="wa-float" @click="openWhatsApp" aria-label="Contactar por WhatsApp">
      <span class="wa-float__ring"></span>
      <svg class="wa-float__icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */
.eventos-page {
  background: #f5f3ef;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ═══════════════════════════════════════════
   HERO  (same colors as original)
   ═══════════════════════════════════════════ */
.ev-hero {
  background: #2c3e2e;
  padding: 64px 24px 72px;
  text-align: center;
}

.ev-hero__inner {
  max-width: 540px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(18px);
}

.eventos-page.loaded .ev-hero__inner {
  animation: fadeUp .7s cubic-bezier(.22,1,.36,1) .1s forwards;
}

.ev-hero__tag {
  display: inline-block;
  font-family: 'Outfit', sans-serif;
  font-size: .68rem;
  font-weight: 500;
  letter-spacing: 3px;
  color: #c9a96e;
  margin-bottom: 16px;
}

.ev-hero__title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 2.8rem;
  font-weight: 700;
  font-style: italic;
  color: #fff;
  margin: 0 0 20px;
}

.ev-hero__line {
  width: 40px;
  height: 2px;
  background: #c9a96e;
  margin: 0 auto 20px;
}

.ev-hero__sub {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.15rem;
  font-style: italic;
  color: rgba(255,255,255,.5);
  margin: 0;
}

/* ═══════════════════════════════════════════
   CARDS SECTION
   ═══════════════════════════════════════════ */
.ev-section {
  flex: 1;
  padding: 64px 32px 80px;
  max-width: 1160px;
  margin: 0 auto;
  width: 100%;
}

.ev-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 36px;
}

/* ═══════════════════════════════════════════
   3D CARD
   ═══════════════════════════════════════════ */
.ev-card-wrapper {
  opacity: 0;
  transform: translateY(50px) rotateX(12deg);
  perspective: 900px;
}

.eventos-page.loaded .ev-card-wrapper {
  animation: card3dIn .8s cubic-bezier(.22,1,.36,1) var(--delay) forwards;
}

.ev-card {
  position: relative;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  cursor: default;
  transition: transform .35s cubic-bezier(.22,1,.36,1),
              box-shadow .35s cubic-bezier(.22,1,.36,1);
  transform-style: preserve-3d;
  box-shadow:
    0 4px 12px rgba(44,62,46,.06),
    0 1px 3px rgba(44,62,46,.04);
  will-change: transform;
}

.ev-card:hover {
  box-shadow:
    0 30px 60px rgba(44,62,46,.18),
    0 15px 30px rgba(44,62,46,.10),
    0 0 0 1px rgba(201,169,110,.12);
}

/* ── 3D edge (bottom shadow strip) ── */
.ev-card__edge {
  position: absolute;
  bottom: -4px;
  left: 8px;
  right: 8px;
  height: 16px;
  background: linear-gradient(180deg, rgba(44,62,46,.08), transparent);
  border-radius: 0 0 16px 16px;
  filter: blur(6px);
  opacity: 0;
  transition: opacity .35s ease;
  pointer-events: none;
  z-index: -1;
}

.ev-card:hover .ev-card__edge {
  opacity: 1;
}

/* ── Gloss / shine layer ── */
.ev-card__gloss {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,.18) 0%,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0) 60%,
    rgba(255,255,255,.06) 100%
  );
  opacity: 0;
  transition: opacity .4s ease;
}

.ev-card:hover .ev-card__gloss {
  opacity: 1;
}

/* ── Image ── */
.ev-card__img-box {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3;
}

.ev-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .6s cubic-bezier(.22,1,.36,1);
}

.ev-card:hover .ev-card__img {
  transform: scale(1.07);
}

.ev-card__img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(44,62,46,.45) 100%);
  pointer-events: none;
}

.ev-card__number {
  position: absolute;
  bottom: 14px;
  left: 18px;
  font-family: 'Cormorant Garamond', serif;
  font-size: .85rem;
  font-weight: 700;
  color: rgba(255,255,255,.75);
  letter-spacing: 2px;
  text-shadow: 0 1px 6px rgba(0,0,0,.3);
}

/* ── Body ── */
.ev-card__body {
  padding: 26px 26px 30px;
  transform: translateZ(20px);
}

.ev-card__label {
  display: block;
  font-family: 'Outfit', sans-serif;
  font-size: .62rem;
  font-weight: 500;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #c9a96e;
  margin-bottom: 6px;
}

.ev-card__title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #2c3e2e;
  margin: 0 0 10px;
  transition: color .3s ease;
}

.ev-card:hover .ev-card__title {
  color: #3d5a3e;
}

.ev-card__desc {
  font-family: 'Outfit', sans-serif;
  font-size: .84rem;
  font-weight: 300;
  color: #888;
  line-height: 1.65;
  margin: 0 0 22px;
}

.ev-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: #2c3e2e;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: .76rem;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #fff;
  text-decoration: none;
  transition: all .3s cubic-bezier(.22,1,.36,1);
  border: 1.5px solid #2c3e2e;
}

.ev-card__cta:hover {
  background: transparent;
  color: #2c3e2e;
  transform: translateX(3px);
}

.ev-card__cta i {
  font-size: .82rem;
  transition: transform .3s ease;
}

.ev-card__cta:hover i {
  transform: translateX(4px);
}

/* ═══════════════════════════════════════════
   FLOATING WHATSAPP  (single button)
   ═══════════════════════════════════════════ */
.wa-float {
  position: fixed;
  bottom: 26px;
  right: 26px;
  z-index: 9999;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #25d366;
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow:
    0 4px 18px rgba(37,211,102,.4),
    0 2px 6px rgba(0,0,0,.1);
  transition: transform .3s cubic-bezier(.22,1,.36,1),
              box-shadow .3s ease;
}

.wa-float:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow:
    0 8px 28px rgba(37,211,102,.5),
    0 4px 10px rgba(0,0,0,.12);
}

.wa-float__icon {
  width: 26px;
  height: 26px;
}

.wa-float__ring {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 2px solid rgba(37,211,102,.35);
  animation: ringPulse 2.2s ease-in-out infinite;
  pointer-events: none;
}

/* ═══════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════ */
@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes card3dIn {
  0%   { opacity: 0; transform: translateY(50px) rotateX(12deg); }
  100% { opacity: 1; transform: translateY(0)  rotateX(0deg); }
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1);   opacity: .5; }
  50%      { transform: scale(1.35); opacity: 0; }
}

/* ═══════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════ */
@media (max-width: 991px) {
  .ev-grid {
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }
  .ev-hero { padding: 48px 24px 56px; }
  .ev-hero__title { font-size: 2.2rem; }
  .ev-section { padding: 48px 24px 64px; }
}

@media (max-width: 575px) {
  .ev-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .ev-hero { padding: 40px 20px 48px; }
  .ev-hero__title { font-size: 1.9rem; }
  .ev-section { padding: 36px 16px 52px; }

  .ev-card__body { padding: 22px 22px 26px; }

  .wa-float {
    bottom: 18px;
    right: 18px;
    width: 52px;
    height: 52px;
  }
  .wa-float__icon { width: 24px; height: 24px; }
}
</style>
