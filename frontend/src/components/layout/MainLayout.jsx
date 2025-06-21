import React from 'react'
import Header from '../common/Header.jsx'
import Sidebar from './Sidebar.jsx'
import MobileNavigation from './MobileNavigation.jsx'

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
      {/* Mobile Navigation - Only visible on mobile */}
      <div className="md:hidden">
        <MobileNavigation />
      </div>
    </div>
  )
}

export default MainLayout