import { defineStore } from 'pinia'
import { login as apiLogin, register as apiRegister, getMe } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const sessionUser = JSON.parse(localStorage.getItem('sessionUser')) || null
    const token = localStorage.getItem('access_token') || null
    return {
      user: sessionUser,
      token: token,
      isLogged: !!(sessionUser && token)
    }
  },

  getters: {
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    /**
     * Login real contra el backend FastAPI.
     * POST /auth/login (OAuth2PasswordRequestForm)
     * Luego GET /users/me para obtener datos del usuario.
     */
    async login(email, password) {
      try {
        localStorage.removeItem('reservaTemp')
        localStorage.removeItem('cotizacionTemp')
        localStorage.removeItem('reservaBackendId')

        const tokenData = await apiLogin(email, password)
        this.token = tokenData.access_token
        localStorage.setItem('access_token', tokenData.access_token)
        localStorage.setItem('refresh_token', tokenData.refresh_token)

        // 3. Obtener datos del usuario autenticado
        const userData = await getMe()

        this.user = userData
        this.isLogged = true
        localStorage.setItem('sessionUser', JSON.stringify(userData))

        return { success: true }
      } catch (error) {
        const message = error.response?.data?.detail || 'Error al iniciar sesion'
        return { success: false, message }
      }
    },

    /**
     * Registro real contra el backend FastAPI.
     * POST /auth/register
     */
    async register(userData) {
      try {
        localStorage.removeItem('reservaTemp')
        localStorage.removeItem('cotizacionTemp')
        localStorage.removeItem('reservaBackendId')
        await apiRegister(userData)
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.detail || 'Error al registrar usuario'
        return { success: false, message }
      }
    },

    /**
     * Cerrar sesion: limpia tokens y estado.
     */
    logout() {
      this.user = null
      this.token = null
      this.isLogged = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('sessionUser')
      localStorage.removeItem('reservaTemp')
      localStorage.removeItem('cotizacionTemp')
      localStorage.removeItem('reservaBackendId')
    },

    /**
     * Restaurar sesion: verifica que el token guardado siga siendo valido.
     * Se llama al iniciar la app.
     */
    async checkSession() {
      if (!this.token) return

      try {
        const userData = await getMe()
        this.user = userData
        this.isLogged = true
        localStorage.setItem('sessionUser', JSON.stringify(userData))
      } catch {
        // Token invalido/expirado: limpiar todo
        this.logout()
      }
    }
  }
})
