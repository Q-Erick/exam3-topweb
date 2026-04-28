'use client'

import { useState, useEffect } from 'react'
import { api } from '@/shared/lib/api'
import { ApiResponse } from '@/shared/types/api.types'
import { Estudiante } from '@/features/estudiante/types/estudiante.types'

export function useEstudiante() {
    const [estudiante, setEstudiante] = useState<Estudiante | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchEstudiante() {
        try {
            const response = await api.get<ApiResponse<Estudiante>>(
            '/movil/estudiante'
            )
            if (response.flag) {
            setEstudiante(response.data)
            }
        } catch (err) {
            setError('No se pudo cargar la información del estudiante.')
        } finally {
            setLoading(false)
        }
        }

        fetchEstudiante()
    }, [])

    return { estudiante, loading, error }
}