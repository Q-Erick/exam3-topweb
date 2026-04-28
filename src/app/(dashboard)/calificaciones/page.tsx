'use client'

import { Search } from 'lucide-react'
import { useAuth } from '@/shared/hooks/useAuth'
import { useCalificaciones } from '@/features/calificaciones/hooks/useCalificaciones'
import { useEstudiante } from '@/features/estudiante/hooks/useEstudiante'
import { GradeCard } from '@/features/calificaciones/components/GradeCard'
import { StatsBar } from '@/features/calificaciones/components/StatsBar'
import { Spinner } from '@/shared/components/ui/Spinner'
import { ErrorMessage } from '@/shared/components/feedback/ErrorMessage'

export default function CalificacionesPage() {
    const { loading: authLoading } = useAuth()
    const { estudiante } = useEstudiante()
    const {
        data,
        loading,
        error,
        search,
        setSearch,
        materiasFiltradas,
        promedioGeneral,
    } = useCalificaciones()

    if (authLoading || loading) {
        return (
        <div className="flex items-center justify-center h-full">
            <Spinner size="lg" />
        </div>
        )
    }

    if (error) {
        return (
        <div className="max-w-md mx-auto mt-12">
            <ErrorMessage message={error} />
        </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">

        {/* Header */}
        <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">
            Calificaciones del Semestre Actual
            </h1>
            {data && (
            <p className="text-sm text-[#64748B] mt-1">
                {data.periodo.descripcion_periodo} • Semestre {estudiante?.semestre}
            </p>
            )}
        </div>

        {/* Stats */}
        <StatsBar
            promedioGeneral={promedioGeneral}
            totalMaterias={data?.materias.length ?? 0}
            estudiante={estudiante}
        />

        {/* Buscador */}
        <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 w-full max-w-sm">
            <Search size={16} className="text-[#94A3B8] shrink-0" />
            <input
            type="text"
            placeholder="Buscar por materia o clave..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-[#0F172A] outline-none w-full placeholder:text-[#94A3B8]"
            />
        </div>

        {/* Grid de materias */}
        {materiasFiltradas.length === 0 ? (
            <div className="text-center py-12 text-[#64748B] text-sm">
            No se encontraron materias con ese criterio.
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {materiasFiltradas.map((m) => (
                <GradeCard
                key={m.materia.id_grupo}
                materiaData={m}
                />
            ))}
            </div>
        )}
        </div>
    )
}