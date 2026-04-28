'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
    const router = useRouter()
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem('token')
        if (!stored) {
            router.replace('/login')
        } else {
            setToken(stored)
        }
        setLoading(false)
    }, [router])

    function logout() {
        localStorage.removeItem('token')
        router.replace('/login')
    }

    return { token, loading, logout }
}