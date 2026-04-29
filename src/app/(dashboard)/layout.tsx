'use client'

import { useState } from 'react'
import { Sidebar } from '@/shared/components/layout/Sidebar'
import { TopBar } from '@/shared/components/layout/TopBar'
import { SessionGuard } from '@/shared/components/SessionGuard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] relative overflow-hidden">
      <SessionGuard />

      {/* 1. SIDEBAR: Fijo por CSS */}
      <Sidebar isOpen={isMenuOpen} onClose={closeMenu} />

      {/* 2. CONTENIDO PRINCIPAL: Con clase para empujar el contenido */}
      <div className="main-layout-wrapper flex flex-col min-w-0 flex-1">
        
        <TopBar onMenuClick={toggleMenu} />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 3. MOBILE OVERLAY: Solo visible en móvil cuando el menú se abre */}
      {isMenuOpen && (
        <div 
          onClick={closeMenu}
          className="sidebar-overlay active"
          style={{ zIndex: 40 }} // Asegura que esté bajo el sidebar
        />
      )}
    </div>
  )
}