'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/shared/lib/api'
import { ApiResponse } from '@/shared/types/api.types'
import { Estudiante } from '@/features/estudiante/types/estudiante.types'

export interface UseEstudianteReturn {
    estudiante: Estudiante | null
    loading: boolean
    error: string | null
    errorType?: 'token-expired' | 'network' | 'server' | 'unknown'
    retry: () => void
}

// ... (resto del import igual)

export function useEstudiante(): UseEstudianteReturn {
    const router = useRouter()
    const [estudiante, setEstudiante] = useState<Estudiante | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [errorType, setErrorType] = useState<UseEstudianteReturn['errorType']>()

    async function fetchEstudiante() {
        setLoading(true)
        // Opcional: Limpiar localStorage para forzar actualización si sigue fallando
        // localStorage.removeItem('estudiante'); 

        try {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/login')
                return
            }

            const response = await api.get<ApiResponse<Estudiante>>('/movil/estudiante')
            
            // Log para debuggear en consola (Borrar después)
            console.log("API Response Data:", response.data);

            if (response && response.flag && response.data) {
                setEstudiante(response.data)
                localStorage.setItem('estudiante', JSON.stringify(response.data))
            } else {
                throw new Error('Formato de respuesta inválido')
            }
        } catch (err: any) {
            setError('Error al cargar datos')
            setErrorType('server')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEstudiante()
    }, [])

    return { estudiante, loading, error, errorType, retry: fetchEstudiante }
}