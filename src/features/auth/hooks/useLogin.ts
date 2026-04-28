'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/shared/lib/api'
import { ApiResponse } from '@/shared/types/api.types'
import { LoginCredentials, LoginResponse } from '@/features/auth/types/auth.types'

export function useLogin() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function login(credentials: LoginCredentials) {
        setLoading(true)
        setError(null)

        try {
        const response = await api.post<any>(
            '/login',
            credentials
        )

        console.log('Login response:', response)

        // El backend retorna flag: 'success' cuando es exitoso
        if (response.flag === 'success' && response.message?.login?.token) {
            localStorage.setItem('token', response.message.login.token)
            
            // Guardar los datos del estudiante si están disponibles
            if (response.data) {
                localStorage.setItem('estudiante', JSON.stringify(response.data))
            }
            
            router.push('/inicio')
        } else {
            setError('Credenciales incorrectas. Intenta de nuevo.')
        }
        } catch (err) {
        console.error('Login error:', err)
        setError('No se pudo conectar al servidor. Intenta más tarde.')
        } finally {
        setLoading(false)
        }
    }

    return { login, loading, error }
}