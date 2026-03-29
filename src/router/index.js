import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import PublicLayout from '@/layouts/PublicLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// Views
import HomeView from '@/views/public/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import ProfileView from '@/views/app/ProfileView.vue'
import DashboardView from '@/views/admin/DashboardView.vue'
import ReservationsView from '@/views/admin/ReservationsView.vue'
import RoomsPublicView from '@/views/public/RoomsPublicView.vue'
import RoomsViewAdmin from '@/views/admin/RoomsView.vue'

const routes = [

  // PUBLICO
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      {
        path: "gallery",
        name: 'home-gallery',
        component: () => import('@/views/public/GalleryView.vue')//carga perezosa o dinamica
      },
      { 
        path: 'rooms', 
        name: 'public-rooms', 
        component: RoomsPublicView 
      },
      { 
        path: 'rooms/:id', 
        name: 'room-detail', 
        component: () => import('@/views/public/RoomDetailView.vue') 
      },
    ]
  },

  // AUTH
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'login', component: LoginView },      
      { path: 'register', name: 'register', component: () => import('@/views/auth/RegisterView.vue')},//carga perezosa o dinamica
      { path: 'forgot-password', name: 'forgot_password', component: () => import('@/views/auth/ForgotPasswordView.vue')}
    ]
  },

  // USUARIO
  {
    path: '/app',
    component: AppLayout,
    children: [
      { path: 'profile', name: 'profile', component: ProfileView }
    ]
  },

  // ADMIN
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'dashboard', 
        name: 'admin-dashboard', 
        component: DashboardView }
      ,
      { path: 'users', 
        name: 'admin-users',
        component: () => import('@/views/admin/UsersView.vue')//carga perezosa o dinamica
      },
      {
        path: "gallery",
        name: 'admin-gallery',
        component: () => import('@/views/admin/GalleryAdminView.vue')//carga perezosa o dinamica
      },
      {
        path: "reservations",
        name: 'admin-reservations',
        component: ReservationsView
      },
      {
        path: "rooms",
        name: 'admin-rooms',
        component: RoomsViewAdmin
      },
      {
        path: 'config',
        name: 'admin-config',
        component: () => import('@/views/admin/ConfigView.vue')
      }
    ]
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router