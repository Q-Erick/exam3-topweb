'use client'

import { useState, useEffect } from 'react'
import { api } from '@/shared/lib/api'
import { ApiResponse } from '@/shared/types/api.types'
import { KardexData, KardexMateria, SemestreAgrupado } from '@/features/kardex/types/kardex.types'

function calcularPromedio(materias: KardexMateria[]): string {
    const validas = materias
        .filter((m) => m.calificacion !== 'AC' && !isNaN(parseFloat(m.calificacion)))
        .map((m) => parseFloat(m.calificacion))

    if (validas.length === 0) return '--'
    return (validas.reduce((a, b) => a + b, 0) / validas.length).toFixed(1)
}

function calcularCreditos(materias: KardexMateria[]): number {
    return materias.reduce((acc, m) => acc + parseInt(m.creditos || '0'), 0)
}

export function useKardex() {
    const [historial, setHistorial] = useState<SemestreAgrupado[]>([])
    const [porcentajeAvance, setPorcentajeAvance] = useState<number>(0)
    const [promedioGeneral, setPromedioGeneral] = useState<string>('--')
    const [creditosTotales, setCreditosTotales] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchKardex() {
        try {
            const response = await api.get<ApiResponse<KardexData>>(
            '/movil/estudiante/kardex'
            )

            if (response.flag && response.data.kardex) {
            const materias = response.data.kardex
            setPorcentajeAvance(response.data.porcentaje_avance)

            // Agrupar por semestre
            const grupos: Record<number, SemestreAgrupado> = {}

            materias.forEach((m) => {
                if (!grupos[m.semestre]) {
                grupos[m.semestre] = {
                    semestre: m.semestre,
                    periodo: m.periodo,
                    materias: [],
                    promedio: '--',
                    creditos: 0,
                }
                }
                grupos[m.semestre].materias.push(m)
            })

            // Calcular promedio y créditos por semestre
            const agrupados = Object.values(grupos)
                .map((g) => ({
                ...g,
                promedio: calcularPromedio(g.materias),
                creditos: calcularCreditos(g.materias),
                }))
                .sort((a, b) => b.semestre - a.semestre)

            setHistorial(agrupados)

            // Calcular totales generales
            const todasValidas = materias
                .filter((m) => m.calificacion !== 'AC' && !isNaN(parseFloat(m.calificacion)))
                .map((m) => parseFloat(m.calificacion))

            if (todasValidas.length > 0) {
                setPromedioGeneral(
                (todasValidas.reduce((a, b) => a + b, 0) / todasValidas.length).toFixed(1)
                )
            }

            setCreditosTotales(calcularCreditos(materias))
            }
        } catch (err) {
            setError('No se pudo cargar el historial académico.')
        } finally {
            setLoading(false)
        }
        }

        fetchKardex()
    }, [])

    return {
        historial,
        porcentajeAvance,
        promedioGeneral,
        creditosTotales,
        loading,
        error,
    }
}