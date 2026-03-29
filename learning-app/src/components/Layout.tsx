import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 1024
  )

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main
        className={`flex-1 pt-[53px] transition-all duration-200 ${
          sidebarOpen ? 'lg:ml-[280px]' : ''
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Layout
