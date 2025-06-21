import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Shield, Settings, Menu, X, User } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext.jsx'

const AdminHeader = () => {
  const { admin, logout } = useAdmin()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 hidden md:block">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="text-brown mr-2" size={24} />
              <span className="text-xl font-bold text-brown-dark">
                Excel Analytics Admin
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, Admin</span>
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-brown transition-colors">
                  <Settings size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 md:hidden">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-2">
              <Shield className="text-brown" size={20} />
              <span className="text-lg font-bold text-brown-dark">
                Admin Panel
              </span>
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-brown transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
            <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-brown/10 p-2 rounded-full">
                      <User className="text-brown" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Admin</p>
                      <p className="text-sm text-gray-500">{admin?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

export default AdminHeader