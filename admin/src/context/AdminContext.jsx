import React, { createContext, useContext, useState, useEffect } from 'react'
import { adminAPI } from '../services/adminAPI.jsx'

const AdminContext = createContext({})

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('adminToken'))

  useEffect(() => {
    if (token) {
      loadAdmin()
    } else {
      setLoading(false)
    }
  }, [token])

  const loadAdmin = async () => {
    try {
      setLoading(true)
      const adminData = await adminAPI.getProfile()
      setAdmin(adminData)
    } catch (error) {
      console.error('Failed to load admin:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await adminAPI.login(email, password)
    setToken(response.token)
    setAdmin(response.admin)
    localStorage.setItem('adminToken', response.token)
    return response
  }

  const logout = () => {
    setAdmin(null)
    setToken(null)
    localStorage.removeItem('adminToken')
  }

  const value = {
    admin,
    loading,
    token,
    login,
    logout,
    isAuthenticated: !!admin
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}