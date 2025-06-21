import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

console.log('🔗 API URL configured as:', API_URL)

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
    console.log('📤 Making request to:', config.url)
    console.log('📤 Request method:', config.method)
    console.log('📤 Request data:', config.data)
    
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('📤 Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response received:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('📥 Response error:', error)
    console.error('📥 Error response:', error.response)
    console.error('📥 Error message:', error.message)
    
    const message = error.response?.data?.message || error.message || 'An error occurred'
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
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

export default api