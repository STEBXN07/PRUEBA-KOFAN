import apiClient from '@/api/apiClient'

/**
 * Registrar un nuevo usuario.
 * POST /auth/register
 * Body: { names, surnames, email, password, document_type?, document_number? }
 */
export async function register(userData) {
  const response = await apiClient.post('/auth/register', userData)
  return response.data
}

/**
 * Iniciar sesion.
 * POST /auth/login (OAuth2PasswordRequestForm = form-urlencoded)
 * Retorna: { access_token, refresh_token, token_type }
 */
export async function login(email, password) {
  const formData = new URLSearchParams()
  formData.append('username', email)
  formData.append('password', password)

  const response = await apiClient.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  return response.data
}

/**
 * Obtener datos del usuario autenticado.
 * GET /users/me
 */
export async function getMe() {
  const response = await apiClient.get('/users/me')
  return response.data
}
