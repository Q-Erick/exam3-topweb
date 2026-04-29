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
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Funciones controladoras
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#F1F5F9', 
      position: 'relative',
      overflow: 'hidden' // Evita scrolls raros cuando el menú está abierto
    }}>
      {/* 🛡️ Interceptor global de sesión */}
      <SessionGuard />

      {/* 1. SIDEBAR: Ahora con props de control */}
      <Sidebar isOpen={isMenuOpen} onClose={closeMenu} />

      {/* 2. CONTENIDO PRINCIPAL */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        minWidth: 0 
      }}>
        
        {/* TOPBAR: Recibe la función para abrir el menú desde la hamburguesa */}
        <TopBar onMenuClick={toggleMenu} />
        
        <main style={{ 
          flex: 1, 
          padding: '24px', 
          overflowY: 'auto' 
        }}>
          {children}
        </main>
      </div>

      {/* 3. MOBILE OVERLAY: El fondo oscuro que permite cerrar el menú al tocar fuera */}
      {isMenuOpen && (
        <div 
          onClick={closeMenu}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(2px)', // Un toque de estilo moderno
            zIndex: 40, // Por debajo del sidebar (que debe tener 50 o 100)
            cursor: 'pointer'
          }}
        />
      )}
    </div>
  )
}