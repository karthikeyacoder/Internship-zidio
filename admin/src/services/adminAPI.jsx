import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

console.log('🔗 Admin API URL configured as:', API_URL)

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // Disable credentials for now
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('📤 Admin making request to:', config.url)
    console.log('📤 Request method:', config.method)
    console.log('📤 Request data:', config.data)
    
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('📤 Admin request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('📥 Admin response received:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('📥 Admin response error:', error)
    console.error('📥 Error response:', error.response)
    console.error('📥 Error message:', error.message)
    
    const message = error.response?.data?.message || error.message || 'An error occurred'
    
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
      return Promise.reject(error)
    }
    
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.response?.status >= 400) {
      toast.error(message)
    } else if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
      toast.error('Network error. Please check your connection.')
    }
    
    return Promise.reject(error)
  }
)

export const adminAPI = {
  // Authentication
  login: async (email, password) => {
    const response = await api.post('/admin/login', { email, password })
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/admin/profile')
    return response.data.admin
  },

  // User Management
  getUsers: async (page = 1, limit = 10, search = '', filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      ...filters
    })
    const response = await api.get(`/admin/users?${params}`)
    return response.data
  },

  getUser: async (id) => {
    const response = await api.get(`/admin/users/${id}`)
    return response.data.user
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData)
    return response.data
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  },

  // Analytics
  getAnalytics: async (timeRange = '30d') => {
    const response = await api.get(`/admin/analytics?timeRange=${timeRange}`)
    return response.data
  },

  // File Management
  getUploads: async (page = 1, limit = 10, search = '', filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      ...filters
    })
    const response = await api.get(`/admin/uploads?${params}`)
    return response.data
  },

  getCharts: async (page = 1, limit = 10, search = '', filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      ...filters
    })
    const response = await api.get(`/admin/charts?${params}`)
    return response.data
  },

  // Bulk Operations
  bulkDelete: async (type, ids) => {
    const response = await api.post('/admin/bulk-delete', { type, ids })
    return response.data
  },

  // Settings
  getSettings: async () => {
    const response = await api.get('/admin/settings')
    return response.data
  },

  updateSettings: async (settings) => {
    const response = await api.put('/admin/settings', { settings })
    return response.data
  },

  // System Health
  getSystemHealth: async () => {
    const response = await api.get('/health')
    return response.data
  }
}