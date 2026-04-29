'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Star, BookOpen, Calendar, LogOut, X } from 'lucide-react'
import { useAuth } from '@/shared/hooks/useAuth'

// Definimos las props para que TypeScript no marque error
interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const navItems = [
    { label: 'Inicio', href: '/inicio', icon: Home },
    { label: 'Calificaciones', href: '/calificaciones', icon: Star },
    { label: 'Historial Académico', href: '/kardex', icon: BookOpen },
    { label: 'Horario del Semestre', href: '/horarios', icon: Calendar },
    { label: 'Tramitar Cita', href: '/citas', icon: Calendar }
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname()
    const { logout } = useAuth()

    return (
        /* Usamos la clase 'sidebar' definida en globals.css */
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            
            {/* Logo y Botón de cierre móvil */}
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <img 
                        src="/logo.png" 
                        alt="Logo TecNM Celaya"
                    />
                    <span>TecNM Celaya</span>
                </div>
                
                {/* Este botón solo se ve en celulares gracias al CSS */}
                <button className="mobile-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>
            </div>

            {/* Navegación */}
            <nav className="sidebar-nav">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onClose} // Cierra el menú al hacer clic en un link
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={18} />
                            {label}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="sidebar-footer">
                <button onClick={logout} className="logout-btn">
                    <LogOut size={18} />
                    Cerrar sesión
                </button>
            </div>
        </aside>
    )
}