'use client'

import { Bell, Settings } from 'lucide-react'
import { Avatar } from '@/shared/components/ui/Avatar'
import { useEstudiante } from '@/features/estudiante/hooks/useEstudiante'

export function TopBar() {
    const { estudiante } = useEstudiante()

    return (
        <header className="h-[73px] bg-white border-b border-slate-200 flex items-center justify-end px-8">
            
            {/* Acciones - aumenté un poco el gap de 3 a 4 para que respiren entre ellos */}
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-xl text-slate-500 bg-transparent border-none cursor-pointer hover:bg-slate-100 transition-colors duration-200">
                    <Bell size={18} />
                </button>
                
                <button className="p-2 rounded-xl text-slate-500 bg-transparent border-none cursor-pointer hover:bg-slate-100 transition-colors duration-200">
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