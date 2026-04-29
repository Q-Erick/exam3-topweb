'use client'

import { useState, useCallback, useEffect } from 'react'

export function useCitas(numeroControl: string | undefined) {
  const [citas, setCitas] = useState([])
  const [cargando, setCargando] = useState(false)

  const obtenerCitas = useCallback(async () => {
    if (!numeroControl) return
    try {
      const res = await fetch('/api/tramites/citas')
      if (res.ok) {
        const data = await res.json()
        const filtradas = data.filter((c: any) => c.numero_control === numeroControl)
        setCitas(filtradas)
      }
    } catch (err) {
      console.error("Error al obtener citas:", err)
    }
  }, [numeroControl])

  const agendarCita = async (datosForm: any) => {
    setCargando(true)
    try {
      const res = await fetch('/api/tramites/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...datosForm, numero_control: numeroControl })
      })
      const resultado = await res.json()
      if (res.ok) await obtenerCitas()
      return { success: res.ok, message: resultado.message }
    } catch (err) {
      return { success: false, message: 'Error de conexión' }
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { obtenerCitas() }, [obtenerCitas])

  return { citas, agendarCita, cargando, refresh: obtenerCitas }
}