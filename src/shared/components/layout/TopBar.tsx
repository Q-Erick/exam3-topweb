'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Bell, Settings, Info, X, Menu } from 'lucide-react'
import { Avatar } from '@/shared/components/ui/Avatar'
import { useEstudiante } from '@/features/estudiante/hooks/useEstudiante'
import { supabase } from '@/shared/lib/supabase'
import Link from 'next/link'

// 1. Definimos la interfaz para que TypeScript acepte la prop del Layout
interface TopBarProps {
    onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
    const { estudiante } = useEstudiante()
    const pathname = usePathname()
    
    const [showNotis, setShowNotis] = useState(false)
    const [notificaciones, setNotificaciones] = useState<any[]>([])
    const [tieneNuevas, setTieneNuevas] = useState(false)
    
    const notiRef = useRef<HTMLDivElement>(null)
    const esAdmin = estudiante?.email === 'l22030574@celaya.tecnm.mx'

    // 2. CARGA DE NOTIFICACIONES LIMITADA A 5
    const fetchNotis = async () => {
        if (!estudiante?.numero_control) return

        const { data } = await supabase
            .from('citas')
            .select('*')
            .eq('numero_control', estudiante.numero_control)
            .neq('status', 'Pendiente') 
            .order('created_at', { ascending: false })
            .limit(5)
        
        if (data) {
            setNotificaciones(data)
            
            // Lógica de memoria local para el punto rojo
            const ultimaCitaId = data[0]?.id
            const ultimaVistada = localStorage.getItem(`ultima_noti_${estudiante.numero_control}`)

            if (data.length > 0 && ultimaCitaId !== ultimaVistada) {
                setTieneNuevas(true)
            } else {
                setTieneNuevas(false)
            }
        }
    }

    // Actualizar al cambiar de página o estudiante
    useEffect(() => {
        fetchNotis()
    }, [estudiante, pathname])

    // Función para abrir notis y marcar como "visto"
    const handleToggleNotis = () => {
        const nuevaCarga = !showNotis
        setShowNotis(nuevaCarga)
        
        if (nuevaCarga && notificaciones.length > 0) {
            localStorage.setItem(`ultima_noti_${estudiante?.numero_control}`, notificaciones[0].id)
            setTieneNuevas(false)
        }
    }

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
                setShowNotis(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <header className="h-[73px] bg-white border-b border-slate-200 flex items-center justify-between px-8 relative">
            
            {/* --- IZQUIERDA: BOTÓN MENÚ MÓVIL --- */}
            <div className="flex items-center">
                <button 
                    onClick={onMenuClick}
                    className="p-2 rounded-xl text-slate-500 bg-transparent border-none cursor-pointer hover:bg-slate-100 transition-colors lg:hidden"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* --- DERECHA: NOTIFICACIONES Y PERFIL --- */}
            <div className="flex items-center gap-4">
                
                <div className="relative" ref={notiRef}>
                    <button 
                        onClick={handleToggleNotis}
                        className="p-2 rounded-xl text-slate-500 bg-transparent border-none cursor-pointer hover:bg-slate-100 transition-colors duration-200 relative"
                    >
                        <Bell size={18} />
                        {tieneNuevas && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                        )}
                    </button>

                    {showNotis && (
                        <div className="topbar-noti-dropdown">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avisos Recientes</h3>
                                <button onClick={() => setShowNotis(false)} className="text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer">
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="max-h-[350px] overflow-y-auto p-2 space-y-2">
                                {notificaciones.length === 0 ? (
                                    <div className="py-10 text-center text-slate-400 text-[11px] font-bold italic uppercase">
                                        Sin actualizaciones
                                    </div>
                                ) : (
                                    notificaciones.map((n) => (
                                        <div key={n.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex gap-3 items-start transition-colors hover:bg-slate-100">
                                            <div className={`p-2 rounded-full ${
                                                n.status === 'Aceptada' || n.status === 'Completada' 
                                                ? 'bg-green-100 text-green-600' 
                                                : 'bg-red-100 text-red-600'
                                            }`}>
                                                <Info size={14} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[11px] font-bold text-slate-800 leading-tight">
                                                    Cita de <span className="text-blue-600">{n.especialidad}</span>: <span className="uppercase">{n.status}</span>
                                                </p>
                                                <span className="text-[9px] font-black text-slate-400 uppercase">Actualizado recientemente</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <Link 
                                href="/citas" 
                                onClick={() => setShowNotis(false)} 
                                className="block p-3 text-center text-[10px] font-black text-blue-600 hover:bg-blue-50 transition-colors uppercase border-t border-slate-100 no-underline tracking-tighter"
                            >
                                Gestionar mis citas
                            </Link>
                        </div>
                    )}
                </div>
                
                {esAdmin && (
                    <Link href="/admin-citas">
                        <button className="p-2 rounded-xl text-slate-500 bg-transparent border-none cursor-pointer hover:bg-slate-100 transition-colors duration-200" title="Panel de Administración">
                            <Settings size={18} />
                        </button>
                    </Link>
                )}
                
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