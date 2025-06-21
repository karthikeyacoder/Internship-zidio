import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AdminProvider } from './context/AdminContext.jsx'
import AdminRoute from './components/auth/AdminRoute.jsx'
import AdminLayout from './components/layout/AdminLayout.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import UserManagement from './pages/UserManagement.jsx'
import SystemAnalytics from './pages/SystemAnalytics.jsx'
import FileManagement from './pages/FileManagement.jsx'
import Settings from './pages/Settings.jsx'

function App() {
  return (
    <AdminProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<AdminLogin />} />
            <Route
              path="/"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/users"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <UserManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <SystemAnalytics />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/files"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <FileManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <Settings />
                  </AdminLayout>
                </AdminRoute>
              }
            />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AdminProvider>
  )
}

export default App