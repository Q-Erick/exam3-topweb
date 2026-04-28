'use client'

import { useState, useEffect } from 'react'
import { api } from '@/shared/lib/api'
import { ApiResponse } from '@/shared/types/api.types'
import { CalificacionesPeriodo } from '@/features/calificaciones/types/calificaciones.types'

export function useCalificaciones() {
    const [data, setData] = useState<CalificacionesPeriodo | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function fetchCalificaciones() {
        try {
            const response = await api.get<ApiResponse<CalificacionesPeriodo[]>>(
            '/movil/estudiante/calificaciones'
            )
            if (response.flag && response.data.length > 0) {
            setData(response.data[0])
            }
        } catch (err) {
            setError('No se pudieron cargar las calificaciones.')
        } finally {
            setLoading(false)
        }
        }

        fetchCalificaciones()
    }, [])

    const materiasFiltradas = data?.materias.filter((m) =>
        m.materia.nombre_materia.toLowerCase().includes(search.toLowerCase()) ||
        m.materia.clave_materia.toLowerCase().includes(search.toLowerCase())
    ) ?? []

    const promedioGeneral = (() => {
        if (!data) return '--'
        const califs = data.materias.flatMap((m) =>
        m.calificaiones
            .filter((c) => c.calificacion !== null)
            .map((c) => parseFloat(c.calificacion!))
        )
        if (califs.length === 0) return '--'
        return (califs.reduce((a, b) => a + b, 0) / califs.length).toFixed(1)
    })()

    return {
        data,
        loading,
        error,
        search,
        setSearch,
        materiasFiltradas,
        promedioGeneral,
    }
}