import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import Layouts
import PublicLayout from '@/layouts/PublicLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rutas públicas
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '', name: 'home', component: () => import('@/views/public/HomeEcohotel.vue') },
        { path: 'eventos', name: 'eventos', component: () => import('@/views/public/EventosView.vue') },
        { path: 'reservar', name: 'reserva', component: () => import('@/views/public/ReservaForm.vue') },
        { path: 'cotizacion', name: 'RealizarCotizacionPublic', component: () => import('@/views/public/RealizarCotizacion.vue') },
      ]
    },
    // Rutas de autenticación
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        { path: 'login', name: 'login', component: () => import('@/views/auth/Login.vue') },
        { path: 'register', name: 'register', component: () => import('@/views/auth/Register.vue') }
      ]
    },
    // Rutas para usuarios logueados 'App'
    {
      path: '/app',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        { path: 'misreservas', name: 'misreservas', component: () => import('@/views/app/MisReservas.vue') },
        { path: 'resumen', name: 'ResumenReserva', component: () => import('@/views/public/ResumenReserva.vue') }, // Ajustado a la carpeta real
        { path: 'confirmarpago', name: 'confirmarpago', component: () => import('@/views/public/ConfirmarPago.vue') },
        { path: 'metodopago', name: 'metodopago', component: () => import('@/views/public/MetodoPago.vue') }
      ]
    },   
    // Rutas de administrador
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        // Ojo: verifica que estos nombres coincidan con tus archivos .vue en views/admin
        { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/views/admin/DashboardView.vue') },
        { path: 'rooms', name: 'admin-rooms', component: () => import('@/views/admin/RoomsView.vue') }, 
        { path: 'reservas', name: 'admin-reservas', component: () => import('@/views/admin/ReservationsView.vue') },
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthRequired = to.matched.some(record => record.meta.requiresAuth)

  if (isAuthRequired && !authStore.isLogged) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'login' || to.name === 'register') && authStore.isLogged) {
    // Aquí puedes cambiarlo para que lo mande a 'misreservas' en lugar de 'home'
    next({ name: 'misreservas' }) 
  } else {
    next()
  }
})

export default router