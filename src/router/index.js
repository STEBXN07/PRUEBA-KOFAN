import { createRouter, createWebHistory } from 'vue-router'

// Importamos tus vistas
import HomeEcohotel from '../views/HomeEcohotel.vue'
import EventosView from '../views/EventosView.vue'
import ReservaForm from '../views/ReservaForm.vue' // La vista de tus compañeros
import ResumenReserva from '../views/ResumenReserva.vue' // La vista de tus compañeros
import MisReservas from '../views/MisReservas.vue' // La vista de tus compañeros
import RealizarCotizacion from '../views/RealizarCotizacion.vue' // La vista de tus compañeros
import MetodoPago  from '../views/MetodoPago.vue'
import ConfirmarPago from '../views/ConfirmarPago.vue'
import Login from '../views/Login.vue' // Vista para iniciar sesión
import Register from '../views/Register.vue' // Vista para registro de usuario
import { useAuthStore } from '../stores/auth' // Store para gestión de autenticación

// Admin
import AdminLayout from '../layouts/AdminLayout.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminReservasView from '../views/admin/AdminReservasView.vue'
import AdminCotizacionesView from '../views/admin/AdminCotizacionesView.vue'
import AdminClientesView from '../views/admin/AdminClientesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

        {
      path: '/',
      name: 'home',
      component: HomeEcohotel,
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },

    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/eventos',
      name: 'eventos',
      component: EventosView,
      meta: { requiresAuth: false }
    },
    {
      path: '/reservar',
      name: 'reserva',
      component: ReservaForm,
      meta: { requiresAuth: false }
    },

    {
    path: '/resumen',
    name: 'ResumenReserva',
    component: ResumenReserva,
    meta: { requiresAuth: false }

    },
    {
      path: '/misreservas',
      name: 'misreservas',
      component: MisReservas,
      meta: { requiresAuth: false }
    },

    {
    path: '/cotizacion',
    name: 'RealizarCotizacion',
    component: RealizarCotizacion,
    meta: { requiresAuth: false }
    },

    {
      path: '/confirmarpago',
      name: 'confirmarpago',
      component: ConfirmarPago,
      meta: { requiresAuth: false }
    },
    {
      path: '/metodopago',
      name: 'metodopago',
      component: MetodoPago,
      meta: { requiresAuth: false }
    },

    // Rutas de administracion
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: AdminDashboard
        },
        {
          path: 'reservas',
          name: 'admin-reservas',
          component: AdminReservasView
        },
        {
          path: 'cotizaciones',
          name: 'admin-cotizaciones',
          component: AdminCotizacionesView
        },
        {
          path: 'clientes',
          name: 'admin-clientes',
          component: AdminClientesView
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 1. Si la ruta necesita login (como Reservar o Pagar) y NO está logueado
  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isLogged) {
    // Lo mandamos al login, guardando a dónde quería ir originalmente
    next({ name: 'login', query: { redirect: to.fullPath } })
  }
  // 2. Si la ruta necesita rol admin y el usuario no es admin
  else if (to.matched.some(record => record.meta.requiresAdmin) && !authStore.isAdmin) {
    next({ name: 'home' })
  }
  // 3. Si el usuario YA ESTÁ logueado y trata de entrar a Login o Register
  else if ((to.name === 'login' || to.name === 'register') && authStore.isLogged) {
    next({ name: 'home' })
  }
  // 4. En cualquier otro caso, dejarlo pasar
  else {
    next()
  }
})

export default router
