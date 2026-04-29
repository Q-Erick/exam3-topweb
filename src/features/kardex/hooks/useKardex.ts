'use client'
import { useState, useEffect } from 'react'
import { api } from '@/shared/lib/api' // Usamos la misma "llave" que calificaciones
import { ApiResponse } from '@/shared/types/api.types'

export function useKardex() {
    const [historial, setHistorial] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchKardex() {
            try {
                // Usamos el endpoint correcto de la API del Tec
                const response = await api.get<ApiResponse<any>>('/movil/estudiante/kardex')
                
                if (response.flag && response.data.kardex) {
                    const materias = response.data.kardex
                    
                    // Agrupamos por periodo para que se vea por semestres como en tu diseño
                    const grupos = materias.reduce((acc: any, item: any) => {
                        const p = item.periodo || 'Periodo Actual'
                        if (!acc[p]) acc[p] = { periodo: p, materias: [] }
                        acc[p].materias.push(item)
                        return acc
                    }, {})
                    
                    setHistorial(Object.values(grupos).reverse())
                }
            } catch (err) {
                setError('No se pudo cargar el historial académico.')
            } finally {
                setLoading(false)
            }
        }
        fetchKardex()
    }, [])

    return { historial, loading, error }
}