<script setup>
import TheNarvar from '../components/TheNarvar.vue'
import Footer from '@/components/Footer.vue'
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import Swal from 'sweetalert2'
import { crearReserva, listarSalones, getOcupacion } from '@/services/reservaService'
//import { crearCotizacionFormulario } from '@/services/cotizacionService'

const router = useRouter();
const salones = ref([])
const salonSeleccionado = ref("")
const isSubmitting = ref(false)

// Datos del formulario (Asegúrate de que estos nombres se usen en el <template>)
const fecha = ref("");
const destino = ref("");
const evento = ref(""); // Tipo de evento (Boda, Reunion, etc.)
const personas = ref(1);
const elementos = ref([]);
const total = ref("150000");

// Datos del cliente
const cliente = ref({
  tipoPersona: "",
  nombreCompleto: "",
  cedula: "",
  razonSocial: "",
  nit: "",
  representanteLegal: "",
  telefono: "",
  email: ""
});

const loaded = ref(false)
const fechasOcupadas = ref(new Map())
const loadingOcupacion = ref(false)
async function enviarFormulario() {
  if (isSubmitting.value) return
  
  // 1. Verificamos que las variables tengan algo antes de enviar
  if (!fecha.value) {
    Swal.fire('Error', 'No has seleccionado una fecha en el calendario', 'warning')
    return
  }
  if (!salonSeleccionado.value) {
    Swal.fire('Error', 'Por favor selecciona un salón en la lista', 'warning')
    return
  }

  isSubmitting.value = true

  try {
    // 2. Armamos el objeto asegurando que NADA sea undefined
    const backendReserva = {
      salon_id: String(salonSeleccionado.value),
      nombre_evento: String(evento.value || "Reserva Ecohotel Kofán"),
      fecha_inicio: String(fecha.value) + "T10:00:00",
      fecha_fin: String(fecha.value) + "T20:00:00"
    }

    // --- ESTO ES CLAVE: Míralo en la consola (F12) para ver qué se envía ---
    console.log("PAQUETE A ENVIAR:", backendReserva)

    const result = await crearReserva(backendReserva)
    
    Swal.fire({
      title: '¡Logrado!',
      text: 'Reserva guardada en la base de datos',
      icon: 'success',
      confirmButtonColor: '#2e7d32'
    }).then(() => {
      router.push("/resumen");
    })

  } catch (error) {
    // 3. Si falla, el Backend nos dirá exactamente QUÉ campo odia
    console.error("EL BACKEND RECHAZÓ ESTO:", error.response?.data)
    
    let mensajeError = 'Error de validación (422)'
    if (error.response?.data?.detail) {
      const d = error.response.data.detail[0]
      mensajeError = `Campo [${d.loc[1]}]: ${d.msg}`
    }

    Swal.fire({
      title: 'Error de Datos',
      text: mensajeError,
      icon: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
// Calendario logic (Mantén tus funciones originales)
const today = new Date()
const calYear = ref(today.getFullYear())
const calMonth = ref(today.getMonth())
const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const dayLabels = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']

const calendarDays = computed(() => {
  const y = calYear.value, m = calMonth.value
  const firstDay = new Date(y, m, 1), lastDay = new Date(y, m + 1, 0)
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6
  const days = []
  const prevLast = new Date(y, m, 0).getDate()
  for (let i = startDow - 1; i >= 0; i--) days.push({ day: prevLast - i, current: false, dateStr: '' })
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const mm = String(m + 1).padStart(2, '0'), dd = String(d).padStart(2, '0')
    days.push({ day: d, current: true, dateStr: `${y}-${mm}-${dd}` })
  }
  return days
})

function selectDay(d) {
  if (d.current && d.dateStr) fecha.value = d.dateStr
}
function calPrev() { calMonth.value === 0 ? (calMonth.value = 11, calYear.value--) : calMonth.value-- }
function calNext() { calMonth.value === 11 ? (calMonth.value = 0, calYear.value++) : calMonth.value++ }

onMounted(async () => {
  try { salones.value = await listarSalones() } catch { salones.value = [] }
  setTimeout(() => { loaded.value = true }, 80)
})
</script>

<template>
  <div style="background-color: var(--color-fondo-cafe);">
    <TheNarvar />
  </div>

  <main class="reserva-page" :class="{ loaded }">
    <!-- Hero Section with Background Image -->
    <div class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-inner">
        <div class="hero-ornament">
          <span class="orn-line"></span>
          <i class="bi bi-flower2"></i>
          <span class="orn-line"></span>
        </div>
        <h1 class="hero-title">Reserva tu Evento</h1>
        <p class="hero-sub">Completa el formulario y vive una experiencia inolvidable en el corazon del Putumayo</p>
      </div>
    </div>

    <!-- Step Indicator -->
    <div class="step-indicator">
      <div class="step-track">
        <div class="step-item" :class="{ 'step-active': cliente.tipoPersona !== '' }">
          <span class="step-number">1</span>
          <span class="step-label">Datos Personales</span>
        </div>
        <span class="step-connector"></span>
        <div class="step-item" :class="{ 'step-active': evento !== '' }">
          <span class="step-number">2</span>
          <span class="step-label">Detalles del Evento</span>
        </div>
        <span class="step-connector"></span>
        <div class="step-item" :class="{ 'step-active': fecha !== '' }">
          <span class="step-number">3</span>
          <span class="step-label">Fecha y Equipamiento</span>
        </div>
      </div>
    </div>

    <!-- Form Body -->
    <div class="form-body">
      <form @submit.prevent="enviarFormulario">
        <div class="form-grid">

          <!-- LEFT PANEL -- Client Data -->
          <div class="form-panel panel-left" style="--panel-delay: 0.15s">
            <div class="panel-accent-line"></div>
            <div class="panel-header">
              <div class="panel-icon">
                <i class="bi bi-person-lines-fill"></i>
              </div>
              <div>
                <h3 class="panel-title">Datos del Cliente</h3>
                <p class="panel-sub">Informacion de quien realiza la reserva</p>
              </div>
            </div>

            <div class="panel-content">
              <div class="field-group">
                <label class="field-label">
                  <i class="bi bi-person-check label-icon"></i>
                  Tipo de Persona
                </label>
                <div class="select-wrap">
                  <select class="field-input field-select"
                          v-model="cliente.tipoPersona"
                          required>
                    <option value="">Seleccione</option>
                    <option value="natural">Persona Natural</option>
                    <option value="juridica">Persona Juridica</option>
                  </select>
                  <i class="bi bi-chevron-down select-arrow"></i>
                </div>
              </div>

              <!-- PERSONA NATURAL -->
              <transition name="fields-fade">
                <div v-if="cliente.tipoPersona === 'natural'" class="dynamic-fields">
                  <div class="field-group">
                    <label class="field-label">
                      <i class="bi bi-person label-icon"></i>
                      Nombre Completo
                    </label>
                    <div class="input-icon-wrap">
                      <i class="bi bi-person field-icon"></i>
                      <input type="text"
                            class="field-input has-icon"
                            placeholder="Ingrese su nombre completo"
                            v-model="cliente.nombreCompleto"
                            required>
                    </div>
                  </div>

                  <div class="field-group">
                    <label class="field-label">
                      <i class="bi bi-credit-card-2-front label-icon"></i>
                      Cedula
                    </label>
                    <div class="input-icon-wrap">
                      <i class="bi bi-credit-card-2-front field-icon"></i>
                      <input type="text"
                            class="field-input has-icon"
                            placeholder="Numero de cedula"
                            v-model="cliente.cedula"
                            required>
                    </div>
                  </div>
                </div>
              </transition>

              <!-- PERSONA JURIDICA -->
              <transition name="fields-fade">
                <div v-if="cliente.tipoPersona === 'juridica'" class="dynamic-fields">
                  <div class="field-group">
                    <label class="field-label">
                      <i class="bi bi-building label-icon"></i>
                      Razon Social
                    </label>
                    <div class="input-icon-wrap">
                      <i class="bi bi-building field-icon"></i>
                      <input type="text"
                            class="field-input has-icon"
                            placeholder="Nombre de la empresa"
                            v-model="cliente.razonSocial"
                            required>
                    </div>
                  </div>

                  <div class="field-group">
                    <label class="field-label">
                      <i class="bi bi-hash label-icon"></i>
                      NIT
                    </label>
                    <div class="input-icon-wrap">
                      <i class="bi bi-hash field-icon"></i>
                      <input type="text"
                            class="field-input has-icon"
                            placeholder="Numero de identificacion tributaria"
                            v-model="cliente.nit"
                            required>
                    </div>
                  </div>

                  <div class="field-group">
                    <label class="field-label">
                      <i class="bi bi-person-badge label-icon"></i>
                      Representante Legal
                    </label>
                    <div class="input-icon-wrap">
                      <i class="bi bi-person-badge field-icon"></i>
                      <input type="text"
                            class="field-input has-icon"
                            placeholder="Nombre del representante"
                            v-model="cliente.representanteLegal"
                            required>
                    </div>
                  </div>
                </div>
              </transition>

              <!-- CAMPOS COMUNES -->
              <div class="fields-divider">
                <span class="divider-line"></span>
                <span class="divider-text">Contacto</span>
                <span class="divider-line"></span>
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="bi bi-envelope label-icon"></i>
                  Correo Electronico
                </label>
                <div class="input-icon-wrap">
                  <i class="bi bi-envelope field-icon"></i>
                  <input type="email"
                        class="field-input has-icon"
                        placeholder="correo@ejemplo.com"
                        v-model="cliente.email"
                        required>
                </div>
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="bi bi-telephone label-icon"></i>
                  Telefono
                </label>
                <div class="input-icon-wrap">
                  <i class="bi bi-telephone field-icon"></i>
                  <input type="tel"
                        class="field-input has-icon"
                        placeholder="+57 300 000 0000"
                        v-model="cliente.telefono"
                        required>
                </div>
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="bi bi-geo-alt label-icon"></i>
                  Direccion del Evento
                </label>
                <div class="input-icon-wrap">
                  <i class="bi bi-geo-alt field-icon"></i>
                  <input type="text"
                        class="field-input has-icon"
                        placeholder="Ubicacion o direccion"
                        v-model="destino"
                        required>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT PANEL -- Event Details -->
          <div class="form-panel panel-right" style="--panel-delay: 0.3s">
            <div class="panel-accent-line"></div>
            <div class="panel-header">
              <div class="panel-icon">
                <i class="bi bi-calendar2-event"></i>
              </div>
              <div>
                <h3 class="panel-title">Detalles del Evento</h3>
                <p class="panel-sub">Personaliza tu experiencia</p>
              </div>
            </div>

            <div class="panel-content">
              <div class="field-row">
                <div class="field-group field-half">
                  <label class="field-label">
                    <i class="bi bi-people label-icon"></i>
                    Personas
                  </label>
                  <div class="input-icon-wrap">
                    <i class="bi bi-people field-icon"></i>
                    <input type="number"
                          class="field-input has-icon"
                          v-model="personas"
                          min="1"
                          required>
                  </div>
                </div>

                <div class="field-group field-half">
                  <label class="field-label">
                    <i class="bi bi-stars label-icon"></i>
                    Tipo de Evento
                  </label>
                  <div class="select-wrap">
                    <select class="field-input field-select"
                            v-model="evento"
                            required>
                      <option value="">Seleccione una opcion</option>
                      <option>Reunion</option>
                      <option>Boda</option>
                      <option>Reunion Familiar</option>
                      <option>Otro</option>
                    </select>
                    <i class="bi bi-chevron-down select-arrow"></i>
                  </div>
                </div>
              </div>

              <div v-if="salones.length > 0" class="field-group">
                <label class="field-label">
                  <i class="bi bi-door-open label-icon"></i>
                  Salon
                </label>
                <div class="select-wrap">
                  <select class="field-input field-select"
                          v-model="salonSeleccionado">
                    <option value="">Seleccione un salon (opcional)</option>
                    <option v-for="s in salones" :key="s.id" :value="s.id">
                      {{ s.nombre }} (Cap. {{ s.capacidad }})
                    </option>
                  </select>
                  <i class="bi bi-chevron-down select-arrow"></i>
                </div>
              </div>

              <!-- CUSTOM CALENDAR -->
              <div class="fields-divider">
                <span class="divider-line"></span>
                <span class="divider-text">Fecha</span>
                <span class="divider-line"></span>
              </div>

              <div class="cal-wrapper">
                <div class="cal-nav">
                  <button type="button" class="cal-nav-btn" @click="calPrev">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                  <div class="cal-month-label">
                    <span class="cal-month-name">{{ monthNames[calMonth] }}</span>
                    <span class="cal-year">{{ calYear }}</span>
                  </div>
                  <button type="button" class="cal-nav-btn" @click="calNext">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </div>

                <div class="cal-grid">
                  <div class="cal-day-header" v-for="label in dayLabels" :key="label">
                    {{ label }}
                  </div>
                  <button
                    v-for="(d, idx) in calendarDays"
                    :key="idx"
                    type="button"
                    class="cal-day"
                    :class="{
                      'cal-outside': !d.current,
                      'cal-today': d.current && d.dateStr === todayStr,
                      'cal-selected': d.current && d.dateStr && d.dateStr === fecha,
                      'cal-past': d.current && isPast(d.dateStr),
                      'cal-occupied': d.current && isOccupied(d.dateStr),
                      'cal-occupied--confirmed': d.current && isOccupied(d.dateStr) && getOccupiedInfo(d.dateStr)?.color === 'green',
                      'cal-occupied--pending': d.current && isOccupied(d.dateStr) && getOccupiedInfo(d.dateStr)?.color === 'red'
                    }"
                    :disabled="!d.current || isPast(d.dateStr) || isOccupied(d.dateStr)"
                    :title="isOccupied(d.dateStr) ? (getOccupiedInfo(d.dateStr)?.title || 'No disponible') : ''"
                    @click="selectDay(d)"
                  >
                    {{ d.day }}
                    <span v-if="d.current && isOccupied(d.dateStr)" class="cal-occupied-dot"></span>
                  </button>
                </div>

                <div class="cal-footer">
                  <div class="cal-selected-display" v-if="fecha">
                    <i class="bi bi-check-circle-fill"></i>
                    <span>{{ selectedDateDisplay }}</span>
                  </div>
                  <div class="cal-selected-display cal-no-date" v-else>
                    <i class="bi bi-info-circle"></i>
                    <span>Selecciona una fecha</span>
                  </div>

                  <!-- Loading indicator -->
                  <div v-if="loadingOcupacion" class="cal-loading">
                    <div class="cal-loading-spinner"></div>
                    <span>Consultando disponibilidad...</span>
                  </div>

                  <!-- Calendar legend -->
                  <div v-if="salonSeleccionado" class="cal-legend">
                    <div class="cal-legend-item">
                      <span class="cal-legend-swatch cal-legend--today"></span>
                      <span>Hoy</span>
                    </div>
                    <div class="cal-legend-item">
                      <span class="cal-legend-swatch cal-legend--selected"></span>
                      <span>Seleccionado</span>
                    </div>
                    <div class="cal-legend-item">
                      <span class="cal-legend-swatch cal-legend--confirmed"></span>
                      <span>Confirmado</span>
                    </div>
                    <div class="cal-legend-item">
                      <span class="cal-legend-swatch cal-legend--pending"></span>
                      <span>Pendiente</span>
                    </div>
                    <div class="cal-legend-item">
                      <span class="cal-legend-swatch cal-legend--past"></span>
                      <span>Pasado</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Hidden required input for form validation -->
              <input type="hidden" :value="fecha" required>

              <div class="fields-divider">
                <span class="divider-line"></span>
                <span class="divider-text">Equipamiento</span>
                <span class="divider-line"></span>
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="bi bi-box-seam label-icon"></i>
                  Elementos a utilizar
                </label>
                <div class="elements-grid">
                  <label
                    v-for="e in ['Sillas','Mesas','Sonido','Proyector','Microfono']"
                    :key="e"
                    class="element-card"
                    :class="{ checked: elementos.includes(e) }"
                  >
                    <input
                      type="checkbox"
                      :value="e"
                      v-model="elementos"
                      :id="e"
                      class="element-checkbox"
                    >
                    <i class="bi" :class="{
                      'bi-chair': e === 'Sillas',
                      'bi-grid-3x3': e === 'Mesas',
                      'bi-speaker': e === 'Sonido',
                      'bi-projector': e === 'Proyector',
                      'bi-mic': e === 'Microfono'
                    }"></i>
                    <span class="element-name">{{ e }}</span>
                    <span class="element-check">
                      <i class="bi bi-check2"></i>
                    </span>
                  </label>
                </div>
              </div>

              <!-- Actions -->
              <div class="form-actions">
                <button type="submit" class="btn-reservar">
                  <i class="bi bi-check-circle me-2"></i>
                  Reservar Evento
                </button>
                <button type="button" class="btn-cotizar" @click="irCotizacion">
                  <i class="bi bi-file-earmark-text me-2"></i>
                  Realizar Cotizacion
                </button>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  </main>
  <Footer />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700&family=Outfit:wght@300;400;500;600;700&display=swap');

/* ==============================================
   CSS VARIABLES
   ============================================== */
.reserva-page {
  --deep-green: #1a3a2a;
  --accent-gold: #c9a96e;
  --gold-light: #dfc08a;
  --gold-dark: #a68a4e;
  --light-sage: #e8ede5;
  --warm-white: #faf8f5;
  --rich-brown: #4a3728;
  --text-muted: #8a7e72;
  --border-subtle: rgba(201, 169, 110, 0.18);
  --shadow-soft: 0 4px 24px rgba(26, 58, 42, 0.06);
  --shadow-hover: 0 8px 40px rgba(26, 58, 42, 0.12);
}

/* ==============================================
   PAGE BASE
   ============================================== */
.reserva-page {
  background-color: var(--light-sage);
  background-image:
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 C30 5 25 15 20 20 C15 25 5 30 5 30 C5 30 15 35 20 40 C25 45 30 55 30 55 C30 55 35 45 40 40 C45 35 55 30 55 30 C55 30 45 25 40 20 C35 15 30 5 30 5Z' fill='none' stroke='rgba(26,58,42,0.025)' stroke-width='0.5'/%3E%3C/svg%3E");
  font-family: 'Outfit', sans-serif;
  min-height: 100vh;
  color: var(--rich-brown);
}

/* ==============================================
   HERO SECTION
   ============================================== */
.page-hero {
  position: relative;
  padding: 80px 24px 72px;
  text-align: center;
  overflow: hidden;
  background-image: url('/fondo-hotel.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(26, 58, 42, 0.82) 0%,
    rgba(26, 58, 42, 0.7) 50%,
    rgba(74, 55, 40, 0.75) 100%
  );
  z-index: 1;
}
.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 680px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(20px);
}
.reserva-page.loaded .hero-inner {
  animation: heroReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.hero-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}
.orn-line {
  width: 56px;
  height: 1px;
  background: var(--accent-gold);
  opacity: 0.6;
}
.hero-ornament i {
  font-size: 0.9rem;
  color: var(--accent-gold);
  opacity: 0.7;
}
.hero-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 3.2rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 16px;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}
.hero-sub {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.7;
  letter-spacing: 0.5px;
}

/* ==============================================
   STEP INDICATOR
   ============================================== */
.step-indicator {
  max-width: 720px;
  margin: -28px auto 0;
  padding: 0 24px;
  position: relative;
  z-index: 3;
}
.step-track {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  background: var(--warm-white);
  border-radius: 60px;
  padding: 16px 32px;
  box-shadow: 0 4px 30px rgba(26, 58, 42, 0.1);
  border: 1px solid var(--border-subtle);
}
.step-item {
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0.4;
  transition: opacity 0.4s ease, transform 0.3s ease;
}
.step-item.step-active {
  opacity: 1;
}
.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--light-sage);
  border: 1.5px solid var(--accent-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent-gold);
  flex-shrink: 0;
  transition: all 0.4s ease;
}
.step-item.step-active .step-number {
  background: var(--accent-gold);
  color: #fff;
}
.step-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--rich-brown);
  letter-spacing: 0.3px;
  white-space: nowrap;
}
.step-connector {
  width: 32px;
  height: 1px;
  background: var(--accent-gold);
  opacity: 0.3;
  margin: 0 12px;
  flex-shrink: 0;
}

/* ==============================================
   FORM BODY
   ============================================== */
.form-body {
  max-width: 1160px;
  margin: 0 auto;
  padding: 44px 24px 72px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
}

/* ==============================================
   PANELS (Frosted Glass)
   ============================================== */
.form-panel {
  background: rgba(250, 248, 245, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
  opacity: 0;
  transform: translateY(24px);
  transition: box-shadow 0.4s ease, transform 0.4s ease;
  position: relative;
}
.form-panel:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}
.reserva-page.loaded .form-panel {
  animation: panelRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--panel-delay);
}
.panel-accent-line {
  height: 3px;
  background: linear-gradient(90deg, var(--accent-gold), var(--gold-light), var(--accent-gold));
}
.panel-header {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 28px 32px 24px;
  border-bottom: 1px solid var(--border-subtle);
  background: linear-gradient(180deg, rgba(201, 169, 110, 0.04) 0%, transparent 100%);
}
.panel-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--deep-green), #24503a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--accent-gold);
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(26, 58, 42, 0.2);
}
.panel-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--deep-green);
  margin: 0;
  letter-spacing: 0.5px;
}
.panel-sub {
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--text-muted);
  margin: 4px 0 0;
  letter-spacing: 0.2px;
}
.panel-content {
  padding: 28px 32px 32px;
}

/* ==============================================
   FIELD GROUPS
   ============================================== */
.field-group {
  margin-bottom: 22px;
}
.field-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--rich-brown);
  margin-bottom: 8px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
.label-icon {
  font-size: 0.72rem;
  color: var(--accent-gold);
  opacity: 0.7;
}
.field-input {
  width: 100%;
  padding: 13px 16px;
  border: none;
  border-bottom: 2px solid rgba(201, 169, 110, 0.25);
  border-radius: 0;
  background: transparent;
  font-family: 'Outfit', sans-serif;
  font-size: 0.92rem;
  font-weight: 400;
  color: var(--deep-green);
  transition: border-color 0.35s ease, background-color 0.35s ease;
  outline: none;
}
.field-input::placeholder {
  color: #bfb5a8;
  font-weight: 300;
}
.field-input:focus {
  border-bottom-color: var(--accent-gold);
  background: rgba(201, 169, 110, 0.04);
}

/* Input with icon */
.input-icon-wrap {
  position: relative;
}
.field-icon {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.95rem;
  color: var(--text-muted);
  opacity: 0.5;
  transition: color 0.35s ease, opacity 0.35s ease;
  pointer-events: none;
}
.field-input.has-icon {
  padding-left: 32px;
}
.input-icon-wrap:focus-within .field-icon {
  color: var(--accent-gold);
  opacity: 1;
}

/* Select */
.select-wrap {
  position: relative;
}
.field-select {
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  padding-right: 42px;
  border-bottom: 2px solid rgba(201, 169, 110, 0.25);
  border-radius: 0;
  background: transparent;
}
.select-arrow {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.72rem;
  color: var(--accent-gold);
  opacity: 0.5;
  pointer-events: none;
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.select-wrap:focus-within .select-arrow {
  opacity: 1;
  transform: translateY(-50%) rotate(180deg);
}

/* Field row (side by side) */
.field-row {
  display: flex;
  gap: 20px;
}
.field-half {
  flex: 1;
}

/* ==============================================
   GOLD DIVIDERS
   ============================================== */
.fields-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 30px 0 24px;
}
.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
  opacity: 0.35;
}
.divider-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--accent-gold);
  text-transform: uppercase;
  letter-spacing: 3px;
}

/* ==============================================
   DYNAMIC FIELDS TRANSITION
   ============================================== */
.fields-fade-enter-active {
  transition: all 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.fields-fade-leave-active {
  transition: all 0.25s ease;
}
.fields-fade-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.fields-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ==============================================
   EQUIPMENT CARDS
   ============================================== */
.elements-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.element-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 10px;
  border: 1.5px solid var(--border-subtle);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  background: var(--warm-white);
  text-align: center;
}
.element-card:hover {
  border-color: rgba(201, 169, 110, 0.4);
  background: rgba(201, 169, 110, 0.06);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 6px 20px rgba(201, 169, 110, 0.12);
}
.element-card.checked {
  border-color: var(--accent-gold);
  background: rgba(201, 169, 110, 0.08);
  box-shadow: 0 4px 16px rgba(201, 169, 110, 0.15);
}
.element-card .bi {
  font-size: 1.4rem;
  color: var(--text-muted);
  transition: color 0.35s ease;
}
.element-card.checked .bi {
  color: var(--accent-gold);
}
.element-checkbox {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.element-name {
  font-size: 0.74rem;
  font-weight: 500;
  color: var(--text-muted);
  transition: color 0.35s ease;
  letter-spacing: 0.3px;
}
.element-card.checked .element-name {
  color: var(--rich-brown);
  font-weight: 600;
}
.element-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--accent-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.3) rotate(-45deg);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.element-check i {
  font-size: 0.65rem;
  color: #fff !important;
}
.element-card.checked .element-check {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

/* ==============================================
   CUSTOM CALENDAR
   ============================================== */
.cal-wrapper {
  background: var(--warm-white);
  border: 1.5px solid var(--border-subtle);
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 22px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.02);
}
.cal-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.cal-nav-btn {
  width: 38px;
  height: 38px;
  border: 1.5px solid var(--border-subtle);
  border-radius: 12px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--accent-gold);
  font-size: 0.85rem;
  transition: all 0.3s ease;
}
.cal-nav-btn:hover {
  border-color: var(--accent-gold);
  background: rgba(201, 169, 110, 0.08);
  transform: scale(1.05);
}
.cal-month-label {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.cal-month-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--deep-green);
  letter-spacing: 0.5px;
}
.cal-year {
  font-family: 'Outfit', sans-serif;
  font-size: 0.88rem;
  color: var(--text-muted);
  font-weight: 400;
}
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}
.cal-day-header {
  text-align: center;
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--accent-gold);
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 0 12px;
}
.cal-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px;
  background: transparent;
  font-family: 'Outfit', sans-serif;
  font-size: 0.88rem;
  font-weight: 400;
  color: var(--rich-brown);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
}
.cal-day:hover:not(:disabled):not(.cal-outside) {
  background: rgba(201, 169, 110, 0.1);
  color: var(--deep-green);
  transform: scale(1.08);
}
.cal-day.cal-outside {
  color: #d5d0c8;
  cursor: default;
}
.cal-day.cal-past {
  color: #ccc8c0;
  cursor: not-allowed;
}
.cal-day.cal-today:not(.cal-selected) {
  color: var(--deep-green);
  font-weight: 700;
  position: relative;
}
.cal-day.cal-today:not(.cal-selected)::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent-gold);
}
.cal-day.cal-selected {
  background: var(--deep-green);
  color: #fff;
  font-weight: 600;
  box-shadow:
    0 0 0 3px rgba(201, 169, 110, 0.4),
    0 4px 14px rgba(26, 58, 42, 0.3);
  transform: scale(1.08);
}
.cal-footer {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
}
.cal-selected-display {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--deep-green);
}
.cal-selected-display i {
  font-size: 0.95rem;
  color: var(--accent-gold);
}
.cal-no-date {
  color: var(--text-muted);
  font-weight: 400;
}

/* -- Occupied dates -- */
.cal-day.cal-occupied {
  cursor: not-allowed;
  position: relative;
  font-weight: 600;
}
.cal-day.cal-occupied--confirmed {
  background: repeating-linear-gradient(
    45deg,
    #f5c6c6,
    #f5c6c6 2px,
    #eaa8a8 2px,
    #eaa8a8 4px
  );
  color: #8b2020;
  border: 1px solid #d4a0a0;
}
.cal-day.cal-occupied--pending {
  background: repeating-linear-gradient(
    -45deg,
    #fde8c8,
    #fde8c8 2px,
    #f5d49a 2px,
    #f5d49a 4px
  );
  color: #7a5a1a;
  border: 1px solid #e0c080;
}
.cal-day.cal-occupied:hover {
  transform: none;
}
.cal-occupied-dot {
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
}

/* -- Loading indicator -- */
.cal-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  font-size: 0.78rem;
  color: var(--text-muted);
}
.cal-loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-subtle);
  border-top-color: var(--accent-gold);
  border-radius: 50%;
  animation: calSpin 0.8s linear infinite;
}
@keyframes calSpin {
  to { transform: rotate(360deg); }
}

/* -- Calendar legend -- */
.cal-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border-subtle);
}
.cal-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 500;
}
.cal-legend-swatch {
  width: 14px;
  height: 14px;
  border-radius: 5px;
  flex-shrink: 0;
}
.cal-legend--today {
  background: transparent;
  position: relative;
}
.cal-legend--today::after {
  content: '';
  position: absolute;
  bottom: 1px;
  left: 50%;
  transform: translateX(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent-gold);
}
.cal-legend--selected {
  background: var(--deep-green);
  box-shadow: 0 0 0 2px rgba(201, 169, 110, 0.35);
}
.cal-legend--confirmed {
  background: repeating-linear-gradient(
    45deg,
    #f5c6c6,
    #f5c6c6 2px,
    #eaa8a8 2px,
    #eaa8a8 4px
  );
}
.cal-legend--pending {
  background: repeating-linear-gradient(
    -45deg,
    #fde8c8,
    #fde8c8 2px,
    #f5d49a 2px,
    #f5d49a 4px
  );
}
.cal-legend--past {
  background: #e2ded6;
}

/* ==============================================
   BUTTONS
   ============================================== */
.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 36px;
  padding-top: 28px;
  border-top: 1px solid var(--border-subtle);
}
.btn-reservar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 28px;
  background: var(--deep-green);
  color: var(--accent-gold);
  border: none;
  border-radius: 14px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
}
.btn-reservar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(201, 169, 110, 0.15),
    transparent
  );
  transition: left 0.6s ease;
}
.btn-reservar:hover {
  background: #0f2a1a;
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(26, 58, 42, 0.3);
}
.btn-reservar:hover::before {
  left: 100%;
}
.btn-reservar:active {
  transform: translateY(-1px) scale(0.98);
}
.btn-cotizar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 28px;
  background: transparent;
  color: var(--accent-gold);
  border: 1.5px solid var(--accent-gold);
  border-radius: 14px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
}
.btn-cotizar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(201, 169, 110, 0.1),
    transparent
  );
  transition: left 0.6s ease;
}
.btn-cotizar:hover {
  background: rgba(201, 169, 110, 0.08);
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(201, 169, 110, 0.15);
}
.btn-cotizar:hover::before {
  left: 100%;
}
.btn-cotizar:active {
  transform: translateY(-1px) scale(0.98);
}

/* ==============================================
   ANIMATIONS
   ============================================== */
@keyframes heroReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes panelRise {
  0% {
    opacity: 0;
    transform: translateY(24px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ==============================================
   RESPONSIVE
   ============================================== */
@media (max-width: 991px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .hero-title {
    font-size: 2.4rem;
    letter-spacing: 2px;
  }
  .step-track {
    padding: 14px 20px;
    gap: 0;
  }
  .step-label {
    font-size: 0.7rem;
  }
  .step-connector {
    width: 20px;
    margin: 0 6px;
  }
}
@media (max-width: 575px) {
  .page-hero {
    padding: 56px 20px 48px;
  }
  .hero-title {
    font-size: 1.8rem;
    letter-spacing: 1.5px;
  }
  .hero-sub {
    font-size: 0.88rem;
  }
  .step-indicator {
    margin-top: -22px;
  }
  .step-track {
    flex-direction: column;
    gap: 8px;
    border-radius: 20px;
    padding: 16px 20px;
  }
  .step-connector {
    width: 1px;
    height: 16px;
    margin: 0;
  }
  .step-item {
    width: 100%;
  }
  .form-body {
    padding: 28px 16px 48px;
  }
  .panel-content {
    padding: 22px 20px 26px;
  }
  .panel-header {
    padding: 22px 20px;
  }
  .elements-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .form-actions {
    flex-direction: column;
  }
  .field-row {
    flex-direction: column;
    gap: 0;
  }
  .form-panel:hover {
    transform: none;
  }
}
</style>
