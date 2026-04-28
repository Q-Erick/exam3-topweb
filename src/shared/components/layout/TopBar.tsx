'use client'

import { Bell, Settings } from 'lucide-react'
import { Avatar } from '@/shared/components/ui/Avatar'
import { useEstudiante } from '@/features/estudiante/hooks/useEstudiante'

export function TopBar() {
    const { estudiante } = useEstudiante()

    return (
        <header style={{ height: '64px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '24px', paddingRight: '24px' }}>
        {/* Buscador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F1F5F9', borderRadius: '12px', paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', width: '288px' }}>
            <input
            type="text"
            placeholder="Buscar cursos, recursos..."
            style={{
                backgroundColor: 'transparent',
                fontSize: '14px',
                color: '#64748B',
                outline: 'none',
                width: '100%',
                border: 'none'
            }}
            />
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ padding: '8px', borderRadius: '12px', backgroundColor: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
            <Bell size={18} />
            </button>
            <button style={{ padding: '8px', borderRadius: '12px', backgroundColor: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
            <Settings size={18} />
            </button>
            {estudiante && (
            <Avatar
                name={estudiante.persona}
                foto={estudiante.foto}
                size="sm"
            />
            )}
        </div>
        </header>
    )
}