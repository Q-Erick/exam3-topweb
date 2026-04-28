'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Star, BookOpen, Calendar, LogOut } from 'lucide-react'
import { useAuth } from '@/shared/hooks/useAuth'

const navItems = [
    { label: 'Inicio', href: '/inicio', icon: Home },
    { label: 'Calificaciones', href: '/calificaciones', icon: Star },
    { label: 'Historial Académico', href: '/kardex', icon: BookOpen },
    { label: 'Horario del Semestre', href: '/horarios', icon: Calendar },
]

export function Sidebar() {
    const pathname = usePathname()
    const { logout } = useAuth()

    return (
        <aside style={{ width: '256px', minHeight: '100vh', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>

        {/* Logo */}
        <div style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
            src="/logo.png" 
            alt="Logo TecNM Celaya"
            style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
            <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '18px' }}>TecNM Celaya</span>
        </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, paddingLeft: '12px', paddingRight: '12px', paddingTop: '16px', paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href
            return (
                <Link
                key={href}
                href={href}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    color: isActive ? '#3B82F6' : '#64748B',
                    textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                    if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#F1F5F9'
                    e.currentTarget.style.color = '#0F172A'
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#64748B'
                    }
                }}
                >
                <Icon
                    size={18}
                    color={isActive ? '#3B82F6' : '#94A3B8'}
                />
                {label}
                </Link>
            )
            })}
        </nav>

        {/* Logout */}
        <div style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '16px', paddingBottom: '16px', borderTop: '1px solid #E2E8F0' }}>
            <button
            onClick={logout}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingLeft: '12px',
                paddingRight: '12px',
                paddingTop: '10px',
                paddingBottom: '10px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#64748B',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FEE2E2'
                e.currentTarget.style.color = '#EF4444'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#64748B'
            }}
            >
            <LogOut size={18} />
            Cerrar sesión
            </button>
        </div>
        </aside>
    )
}