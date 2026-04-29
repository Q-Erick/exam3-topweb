'use client'
import { useState, useEffect } from 'react'
import { api } from '@/shared/lib/api'

export function useHorario() {
  const [clases, setClases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHorario() {
      try {
        const response = await api.get<any>('/movil/estudiante/horarios')

        const raw = Array.isArray(response.data)
          ? (response.data[0]?.horario ?? response.data)
          : (response.data?.horario ?? response.data?.data ?? [])

        const sesiones: any[] = []

        const diasMap = [
          { key: 'lunes',     idx: 1 },
          { key: 'martes',    idx: 2 },
          { key: 'miercoles', idx: 3 },
          { key: 'jueves',    idx: 4 },
          { key: 'viernes',   idx: 5 },
        ]

        raw.forEach((m: any, idx: number) => {
          diasMap.forEach(({ key, idx: dIdx }) => {
            const horario = m[key]
            const aula = m[`${key}_clave_salon`] ?? 'S/N'

            if (!horario || typeof horario !== 'string') return

            // Regex para extraer horas: soporta "09:00-10:00", "9:00 - 10:00", etc.
            const match = horario.match(/(\d+):(\d+)\s*[-–]\s*(\d+):(\d+)/)
            if (!match) return

            const horaInicio = parseInt(match[1])
            const horaFin    = parseInt(match[3])
            const duracion   = horaFin - horaInicio || 1

            sesiones.push({
              id:         `c-${idx}-${dIdx}`,
              nombre:     m.nombre_materia ?? 'Materia',
              clave:      m.clave_materia  ?? '',
              aula:       aula || 'S/N',
              diaIdx:     dIdx,
              horaInicio,
              duracion,
            })
          })
        })
// Justo antes del setClases(sesiones)
sesiones.forEach(s => {
  console.log(`${s.nombre} | Día: ${s.diaIdx} | Hora: ${s.horaInicio} | Duración: ${s.duracion}h | Aula: ${s.aula}`)
})
        setClases(sesiones)
      } catch (err: any) {
        console.error('Error fetching horario:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHorario()
  }, [])

  return { clases, loading }
}