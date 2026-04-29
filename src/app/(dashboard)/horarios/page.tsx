'use client'
import React from 'react'
import { useHorario } from '@/features/horario/hooks/useHorario'
import { ClassCard } from '@/features/horario/components/ClassCard'

const HORA_INICIO  = 8
const HORA_FIN     = 18
const PX_POR_HORA  = 80

export default function HorarioPage() {
  const { clases, loading } = useHorario()
  const dias  = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
  const horas = Array.from({ length: HORA_FIN - HORA_INICIO }, (_, i) => HORA_INICIO + i)
  const alturaTotal = horas.length * PX_POR_HORA

  if (loading) return (
    <div className="p-10 text-center font-bold text-slate-300 animate-pulse">CARGANDO...</div>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 uppercase italic">Carga Académica 2026</h1>
        <p className="text-sm font-bold text-indigo-500">Sesiones detectadas: {clases.length}</p>
      </div>

      <div className="border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="grid border-b bg-white py-3 text-center"
          style={{ gridTemplateColumns: '60px repeat(5, 1fr)' }}>
          <div className="text-[10px] font-bold text-slate-300 uppercase">Hora</div>
          {dias.map(d => (
            <div key={d} className="text-[10px] font-bold text-slate-500">{d}</div>
          ))}
        </div>

        {/* Body */}
        <div className="flex bg-slate-50/30">

          {/* Columna horas */}
          <div className="relative flex-shrink-0 w-[60px]" style={{ height: alturaTotal }}>
            {horas.map((h, i) => (
              <div key={h} className="absolute w-full border-b border-slate-100"
                style={{ top: i * PX_POR_HORA, height: PX_POR_HORA }}>
                <span className="pl-2 text-[10px] font-mono text-slate-300">{h}:00</span>
              </div>
            ))}
          </div>

          {/* Una columna por día — cada una maneja sus propias clases */}
          {dias.map((dia, dIdx) => {
            const clasesDia = clases.filter(c => c.diaIdx === dIdx + 1)
            return (
              <div key={dia} className="relative flex-1 border-l border-slate-100"
                style={{ height: alturaTotal }}>

                {/* Líneas de hora */}
                {horas.map((_, i) => (
                  <div key={i} className="absolute w-full border-b border-slate-100/50"
                    style={{ top: i * PX_POR_HORA, height: PX_POR_HORA }} />
                ))}

                {/* Clases del día */}
                {clasesDia.map(m => (
                  <div key={m.id}
                    className="absolute left-0.5 right-0.5 p-1 z-10 hover:z-50 transition-transform"
                    style={{
                      top:    (m.horaInicio - HORA_INICIO) * PX_POR_HORA + 2,
                      height: m.duracion * PX_POR_HORA - 4,
                    }}>
                    <ClassCard clase={m} />
                  </div>
                ))}
              </div>
            )
          })}

        </div>
      </div>
    </div>
  )
}