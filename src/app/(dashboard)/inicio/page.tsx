'use client'

import { useEstudiante } from '@/features/estudiante/hooks/useEstudiante'
import { Card } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { DashboardSkeleton } from '@/shared/components/feedback/SkeletonLoader'
import { Button } from '@/shared/components/ui/Button'
import { getInitials } from '@/shared/lib/utils'

export default function InicioPage() {
  const { estudiante, loading, error, errorType, retry } = useEstudiante()

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card padding="lg" className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">
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
          {errorType !== 'token-expired' && (
            <Button 
              onClick={retry}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Intentar de Nuevo
            </Button>
          )}
        </Card>
      </div>
    )
  }

  if (!estudiante) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card padding="lg" className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-3">No hay datos</h2>
          <p className="text-[#64748B] mb-6">No se encontró información del estudiante.</p>
          <Button 
            onClick={retry}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Recargar
          </Button>
        </Card>
      </div>
    )
  }

  // --- Lógica de Conversión Segura (Evita NaN) ---
  const promedio = parseFloat(estudiante?.promedio_ponderado || "0") || 0
  const porcentajeAvance = parseFloat(estudiante?.porcentaje_avance?.toString() || "0") || 0
  
  // IMPORTANTE: Se usa 'percentaje' con E porque así lo manda tu API
  const avanceActual = parseFloat(estudiante?.percentaje_avance_cursando?.toString() || "0") || 0
  
  const materiasAprobadas = parseInt(estudiante?.materias_aprobadas || "0") || 0
  const materiasTotal = parseInt(estudiante?.materias_cursadas || "0") || 0
  const materiasReprobadas = parseInt(estudiante?.materias_reprobadas || "0") || 0
  const creditosAcumulados = parseInt(estudiante?.creditos_acumulados || "0") || 0
  const promedioAritmetico = parseFloat(estudiante?.promedio_aritmetico || "0") || 0
  
  const tasaAprobacion = materiasTotal > 0 
    ? ((materiasAprobadas / materiasTotal) * 100).toFixed(0) 
    : "0"

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <Card padding="lg" className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Foto del Estudiante */}
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg flex items-center justify-center bg-white/10">
              {estudiante?.foto ? (
                <img 
                  src={`data:image/jpeg;base64,${estudiante.foto}`}
                  alt={estudiante?.persona || "Usuario"}
                  className="w-full h-full object-cover"
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
            <div className="space-y-1 text-white/90 text-sm md:text-base">
              <p>📧 {estudiante?.email || 'N/A'}</p>
              <p>🎓 Control: {estudiante?.numero_control || 'N/A'}</p>
              <p>📚 Semestre: {estudiante?.semestre || 'N/A'}</p>
            </div>
          </div>

          {/* Promedio General */}
          <div className="text-center bg-white/20 rounded-xl p-6 backdrop-blur-sm flex-shrink-0">
            <p className="text-sm font-medium opacity-90 mb-2">Promedio General</p>
            <p className="text-4xl font-bold">{promedio.toFixed(2)}</p>
            <Badge variant="success" className="mt-3">
              {promedio >= 90 ? '🌟 Excelente' : promedio >= 80 ? '✅ Muy Bien' : '⚠️ Regular'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Grid de Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center hover:shadow-md transition-shadow">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-[#64748B] text-sm mb-2">Materias Aprobadas</p>
          <p className="text-3xl font-bold text-[#10B981]">{materiasAprobadas}</p>
          <p className="text-xs text-[#64748B] mt-2">de {materiasTotal}</p>
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow">
          <div className="text-4xl mb-2">⭐</div>
          <p className="text-[#64748B] text-sm mb-2">Créditos Acumulados</p>
          <p className="text-3xl font-bold text-[#3B82F6]">{creditosAcumulados}</p>
          <p className="text-xs text-[#64748B] mt-2">del programa</p>
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow">
          <div className="text-4xl mb-2">❌</div>
          <p className="text-[#64748B] text-sm mb-2">Materias Reprobadas</p>
          <p className="text-3xl font-bold text-[#EF4444]">{materiasReprobadas}</p>
          <p className="text-xs text-[#64748B] mt-2">en total</p>
        </Card>

        <Card className="text-center hover:shadow-md transition-shadow">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-[#64748B] text-sm mb-2">Promedio Aritmético</p>
          <p className="text-3xl font-bold text-[#8B5CF6]">
            {promedioAritmetico.toFixed(2)}
          </p>
          <p className="text-xs text-[#64748B] mt-2">del programa</p>
        </Card>
      </div>

      {/* Secciones de Progreso e Información */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avance Académico Visual */}
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">📈 Avance Académico</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#64748B]">Progreso General</span>
                <span className="text-sm font-bold text-[#3B82F6]">{porcentajeAvance}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] h-full rounded-full transition-all duration-500"
                  style={{ width: `${porcentajeAvance}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#64748B]">Avance Actual</span>
                <span className="text-sm font-bold text-[#10B981]">{avanceActual}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#10B981] to-[#059669] h-full rounded-full transition-all duration-500"
                  style={{ width: `${avanceActual}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Detalles en Lista */}
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">📚 Información Académica</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#F1F5F9] rounded-lg">
              <span className="text-sm text-[#64748B]">Semestre Actual</span>
              <span className="text-lg font-bold text-[#0F172A]">{estudiante?.semestre || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F1F5F9] rounded-lg">
              <span className="text-sm text-[#64748B]">Total de Materias Cursadas</span>
              <span className="text-lg font-bold text-[#0F172A]">{materiasTotal}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#F1F5F9] rounded-lg">
              <span className="text-sm text-[#64748B]">Créditos Complementarios</span>
              <span className="text-lg font-bold text-[#0F172A]">{estudiante?.creditos_complementarios || 0}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Tarjeta Inferior de Resumen */}
      <Card padding="lg" className="bg-[#F8FAFC]">
        <h3 className="text-lg font-semibold text-[#0F172A] mb-4">📋 Resumen del Desempeño</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-gray-100">
            <p className="text-3xl font-bold text-[#10B981]">{tasaAprobacion}%</p>
            <p className="text-xs text-[#64748B] mt-2">Tasa de Aprobación</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-100">
            <p className="text-3xl font-bold text-[#3B82F6]">{estudiante?.semestre || '-'}</p>
            <p className="text-xs text-[#64748B] mt-2">Semestre</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-100">
            <p className="text-3xl font-bold text-[#8B5CF6]">{creditosAcumulados}</p>
            <p className="text-xs text-[#64748B] mt-2">Créditos</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-100">
            <p className="text-3xl font-bold text-[#F59E0B]">{porcentajeAvance}%</p>
            <p className="text-xs text-[#64748B] mt-2">Avance</p>
          </div>
        </div>
      </Card>
    </div>
  )
}