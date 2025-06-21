import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService.jsx'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const loadUser = async () => {
    try {
      setLoading(true)
      const userData = await authService.getProfile()
      setUser(userData)
    } catch (error) {
      console.error('Failed to load user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await authService.login(email, password)
    setToken(response.token)
    setUser(response.user)
    localStorage.setItem('token', response.token)
    return response
  }

  const register = async (userData) => {
    const response = await authService.register(userData)
    setToken(response.token)
    setUser(response.user)
    localStorage.setItem('token', response.token)
    return response
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    authService.logout()
  }

  const updateProfile = async (userData) => {
    const updatedUser = await authService.updateProfile(userData)
    setUser(updatedUser)
    return updatedUser
  }

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}