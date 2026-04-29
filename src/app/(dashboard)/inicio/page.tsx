'use client'

import { useRouter } from 'next/navigation'
import { useEstudiante } from '@/features/estudiante/hooks/useEstudiante'
import { Card } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { DashboardSkeleton } from '@/shared/components/feedback/SkeletonLoader'
import { Button } from '@/shared/components/ui/Button'
import { getInitials } from '@/shared/lib/utils'

export default function InicioPage() {
  const { estudiante, loading, error, errorType, retry } = useEstudiante()
  const router = useRouter() // Inicializamos el router para poder redireccionar

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen dashboard-error-padding">
        <Card className="max-w-md w-full text-center dashboard-card-padding">
          <div className="text-6xl mb-4 animate-bounce">
            {errorType === 'token-expired' && '🔐'}
            {errorType === 'network' && '📡'}
            {errorType === 'server' && '⚠️'}
            {!errorType && '❌'}
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
            {errorType === 'token-expired' && 'Sesión Expirada'}
            {errorType === 'network' && 'Error de Conexión'}
            {errorType === 'server' && 'Error del Servidor'}
            {!errorType && 'Error'}
          </h2>
          <p className="text-[#64748B] mb-6">{error}</p>
          
          {/* Botón corregido para mandar al login */}
          <Button 
            onClick={() => router.push('/')}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer"
          >
            Ir al Login
          </Button>
        </Card>
      </div>
    )
  }

  if (!estudiante) {
    return (
      <div className="flex items-center justify-center min-h-screen dashboard-error-padding">
        <Card className="max-w-md w-full text-center animate-pulse dashboard-card-padding">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-3">No hay datos</h2>
          <p className="text-[#64748B] mb-6">No se encontró información del estudiante.</p>
          
          {/* Botón corregido para mandar al login */}
          <Button 
            onClick={() => router.push('/')}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer"
          >
            Ir al Login
          </Button>
        </Card>
      </div>
    )
  }

  // --- Lógica de Conversión Segura (Evita NaN) ---
  const promedio = parseFloat(estudiante?.promedio_ponderado || "0") || 0
  const porcentajeAvance = parseFloat(estudiante?.porcentaje_avance?.toString() || "0") || 0
  const avanceActual = parseFloat(estudiante?.percentaje_avance_cursando?.toString() || "0") || 0
  const materiasAprobadas = parseInt(estudiante?.materias_aprobadas || "0") || 0
  const materiasTotal = parseInt(estudiante?.materias_cursadas || "0") || 0
  const materiasReprobadas = parseInt(estudiante?.materias_reprobadas || "0") || 0
  const creditosAcumulados = parseInt(estudiante?.creditos_acumulados || "0") || 0
  const promedioAritmetico = parseFloat(estudiante?.promedio_aritmetico || "0") || 0
  const tasaAprobacion = materiasTotal > 0 ? ((materiasAprobadas / materiasTotal) * 100).toFixed(0) : "0"

  return (
    <div className="dashboard-wrapper">
      
      {/* Header Principal */}
      <Card className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white overflow-hidden transition-all duration-500 hover:shadow-lg dashboard-header">
        <div className="flex flex-col md:flex-row items-center dashboard-header-content">
          
          {/* Foto del Estudiante */}
          <div className="relative flex-shrink-0 group">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg flex items-center justify-center bg-white/10 transition-transform duration-500 group-hover:scale-105">
              {estudiante?.foto ? (
                <img 
                  src={`data:image/jpeg;base64,${estudiante.foto}`}
                  alt={estudiante?.persona || "Usuario"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="text-4xl font-bold">
                  {getInitials(estudiante?.persona || "Usuario")}
                </div>
              )}
            </div>
          </div>

          {/* Información Personal */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{estudiante?.persona || 'Cargando...'}</h1>
            <div className="dashboard-header-info text-white/90 text-sm md:text-base">
              <p className="hover:text-white transition-colors duration-300">📧 {estudiante?.email || 'N/A'}</p>
              <p className="hover:text-white transition-colors duration-300">🎓 Control: {estudiante?.numero_control || 'N/A'}</p>
              <p className="hover:text-white transition-colors duration-300">📚 Semestre: {estudiante?.semestre || 'N/A'}</p>
            </div>
          </div>

          {/* Promedio General */}
          <div className="text-center bg-white/20 rounded-xl backdrop-blur-md flex-shrink-0 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgb(0,0,0,0.3)] dashboard-promedio-box">
            <p className="text-sm font-medium opacity-90 mb-2 uppercase tracking-wider">Promedio General</p>
            <p className="text-6xl font-bold text-white drop-shadow-md">{promedio.toFixed(2)}</p>
            <Badge 
              variant="success" 
              className="dashboard-badge-fix mt-4 inline-flex items-center justify-center rounded-full whitespace-nowrap shadow-sm text-sm font-bold"
            >
              {promedio >= 90 ? '🌟 Excelente' : promedio >= 80 ? '✅ Bueno' : promedio >= 70 ? '⚠️ Regular' : '❌ Insuficiente'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Grid de Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 dashboard-stats-grid">
        <Card className="group text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-[#10B981]/20 cursor-default dashboard-card-padding">
          <div className="text-4xl mb-2 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">✅</div>
          <p className="text-[#64748B] text-sm mb-2 group-hover:text-[#0F172A] transition-colors">Materias Aprobadas</p>
          <p className="text-3xl font-bold text-[#10B981]">{materiasAprobadas}</p>
          <p className="text-xs text-[#64748B] mt-2">de {materiasTotal}</p>
        </Card>

        <Card className="group text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-[#3B82F6]/20 cursor-default dashboard-card-padding">
          <div className="text-4xl mb-2 transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">⭐</div>
          <p className="text-[#64748B] text-sm mb-2 group-hover:text-[#0F172A] transition-colors">Créditos Acumulados</p>
          <p className="text-3xl font-bold text-[#3B82F6]">{creditosAcumulados}</p>
          <p className="text-xs text-[#64748B] mt-2">del programa</p>
        </Card>

        <Card className="group text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-[#EF4444]/20 cursor-default dashboard-card-padding">
          <div className="text-4xl mb-2 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">❌</div>
          <p className="text-[#64748B] text-sm mb-2 group-hover:text-[#0F172A] transition-colors">Materias Reprobadas</p>
          <p className="text-3xl font-bold text-[#EF4444]">{materiasReprobadas}</p>
          <p className="text-xs text-[#64748B] mt-2">en total</p>
        </Card>

        <Card className="group text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-[#8B5CF6]/20 cursor-default dashboard-card-padding">
          <div className="text-4xl mb-2 transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">📊</div>
          <p className="text-[#64748B] text-sm mb-2 group-hover:text-[#0F172A] transition-colors">Promedio Aritmético</p>
          <p className="text-3xl font-bold text-[#8B5CF6]">{promedioAritmetico.toFixed(4)}</p>
          <p className="text-xs text-[#64748B] mt-2">del programa</p>
        </Card>
      </div>

      {/* Secciones de Progreso e Información */}
      <div className="grid grid-cols-1 lg:grid-cols-2 dashboard-info-grid">
        
        {/* Avance Académico Visual */}
        <Card className="hover:shadow-md transition-shadow duration-300 dashboard-card-padding">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
            <span className="text-xl">📈</span> Avance Académico
          </h3>
          <div className="dashboard-progress-spacing">
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#64748B] group-hover:text-[#0F172A] transition-colors">Progreso General</span>
                <span className="text-sm font-bold text-[#3B82F6]">{porcentajeAvance}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-90"
                  style={{ width: `${porcentajeAvance}%` }}
                />
              </div>
            </div>

            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#64748B] group-hover:text-[#0F172A] transition-colors">Avance Actual</span>
                <span className="text-sm font-bold text-[#10B981]">{avanceActual}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-[#10B981] to-[#059669] h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-90"
                  style={{ width: `${avanceActual}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Detalles en Lista */}
        <Card className="hover:shadow-md transition-shadow duration-300 dashboard-card-padding">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
            <span className="text-xl">📚</span> Información Académica
          </h3>
          <div className="dashboard-list-spacing">
            <div className="flex items-center justify-between bg-[#F1F5F9] rounded-lg hover:bg-white hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 cursor-default dashboard-list-item">
              <span className="text-sm text-[#64748B]">Semestre Actual</span>
              <span className="text-lg font-bold text-[#0F172A]">{estudiante?.semestre || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between bg-[#F1F5F9] rounded-lg hover:bg-white hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 cursor-default dashboard-list-item">
              <span className="text-sm text-[#64748B]">Total de Materias Cursadas</span>
              <span className="text-lg font-bold text-[#0F172A]">{materiasTotal}</span>
            </div>
            <div className="flex items-center justify-between bg-[#F1F5F9] rounded-lg hover:bg-white hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 cursor-default dashboard-list-item">
              <span className="text-sm text-[#64748B]">Créditos Complementarios</span>
              <span className="text-lg font-bold text-[#0F172A]">{estudiante?.creditos_complementarios || 0}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Tarjeta Inferior de Resumen */}
      <Card className="bg-[#F8FAFC] border border-gray-100 shadow-inner dashboard-card-padding">
        <h3 className="text-lg font-semibold text-[#0F172A] mb-4">📋 Resumen del Desempeño</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 dashboard-summary-grid">
          <div className="group text-center bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300 dashboard-summary-item">
            <p className="text-3xl font-bold text-[#10B981] transform transition-transform duration-300 group-hover:scale-110">{tasaAprobacion}%</p>
            <p className="text-xs text-[#64748B] mt-2 group-hover:text-gray-800 transition-colors">Tasa de Aprobación</p>
          </div>
          <div className="group text-center bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300 dashboard-summary-item">
            <p className="text-3xl font-bold text-[#3B82F6] transform transition-transform duration-300 group-hover:scale-110">{estudiante?.semestre || '-'}</p>
            <p className="text-xs text-[#64748B] mt-2 group-hover:text-gray-800 transition-colors">Semestre</p>
          </div>
          <div className="group text-center bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300 dashboard-summary-item">
            <p className="text-3xl font-bold text-[#8B5CF6] transform transition-transform duration-300 group-hover:scale-110">{creditosAcumulados}</p>
            <p className="text-xs text-[#64748B] mt-2 group-hover:text-gray-800 transition-colors">Créditos</p>
          </div>
          <div className="group text-center bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300 dashboard-summary-item">
            <p className="text-3xl font-bold text-[#F59E0B] transform transition-transform duration-300 group-hover:scale-110">{porcentajeAvance}%</p>
            <p className="text-xs text-[#64748B] mt-2 group-hover:text-gray-800 transition-colors">Avance</p>
          </div>
        </div>
      </Card>

    </div>
  )
}