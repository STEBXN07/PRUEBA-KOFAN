import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/views/public/HomeEcohotel.vue') },
      { path: 'eventos', name: 'eventos', component: () => import('@/views/public/EventosView.vue') },
      // Reservar protegida directamente aquí (agregamos meta)
      { 
        path: '/reservar', 
        name: 'reservar', 
        component: () => import('@/views/public/ReservaForm.vue'),
        meta: { requiresAuth: true } 
      },
      { 
        path: 'resumen', 
        name: 'resumen', 
        component: () => import('@/views/public/ResumenReserva.vue'),
        meta: { requiresAuth: true } 
      }
    ]
  },
  { path: '/login', name: 'login', component: () => import('@/views/auth/Login.vue') },
  { path: '/register', name: 'register', component: () => import('@/views/auth/Register.vue') },
  
  // ADMIN
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'admin-dash', component: () => import('@/views/admin/DashboardView.vue') },
      { path: 'reservas', name: 'admin-reservas', component: () => import('@/views/admin/ReservationsView.vue') }
    ]
  }
]

// --- PRIMERO CREAMOS EL ROUTER ---
const router = createRouter({ 
  history: createWebHistory(), 
  routes 
})

// --- LUEGO PONEMOS EL CELADOR (Ahora sí va a reconocer la variable 'router') ---
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Te manda al login y guarda la página a la que ibas
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router