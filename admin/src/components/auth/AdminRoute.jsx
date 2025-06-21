import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext.jsx'

const AdminRoute = ({ children }) => {
  const { admin, loading } = useAdmin()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-brown rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default AdminRoute