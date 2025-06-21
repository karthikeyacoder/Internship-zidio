import api from './api.jsx'

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data.user
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData)
    return response.data.user
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (token, password) => {
    const response = await api.post('/auth/reset-password', { token, password })
    return response.data
  }
}