import { MateriaConCalificaciones } from '@/features/calificaciones/types/calificaciones.types'
import { calcularPromedio } from '@/shared/lib/utils'

interface GradeCardProps {
  materiaData: MateriaConCalificaciones
}

const LABELS = ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Final']

const COLORS = [
  { from: '#3B82F6', to: '#2563EB' },
  { from: '#8B5CF6', to: '#7C3AED' },
  { from: '#10B981', to: '#059669' },
  { from: '#F97316', to: '#EA580C' },
  { from: '#EC4899', to: '#DB2777' },
]

function getGradeStyle(grade: string | null, isFinal = false) {
  if (!grade) {
    return {
      backgroundColor: '#F1F5F9',
      color: '#94A3B8',
    }
  }
  const num = parseFloat(grade)
  if (num >= 90) return { backgroundColor: '#DCFCE7', color: '#15803D' }
  if (num >= 70) return { backgroundColor: '#FEF9C3', color: '#A16207' }
  return { backgroundColor: '#FEE2E2', color: '#B91C1C' }
}

function getPromedioStyle(promedio: string) {
  const num = parseFloat(promedio)
  if (num >= 90) return { backgroundColor: '#DCFCE7', color: '#15803D' }
  if (num >= 70) return { backgroundColor: '#FEF9C3', color: '#A16207' }
  return { backgroundColor: '#FEE2E2', color: '#B91C1C' }
}

export function GradeCard({ materiaData }: GradeCardProps) {
  const { materia, calificaiones } = materiaData

  const getCalif = (numero: number) =>
    calificaiones.find((c) => c.numero_calificacion === numero)?.calificacion ?? null

  const parciales = [1, 2, 3].map(getCalif)
  const final = getCalif(4)
  const promedio = calcularPromedio([...parciales, final])

  const progressValue = (() => {
    const validas = [...parciales, final].filter((c) => c !== null)
    return Math.round((validas.length / 4) * 100)
  })()

  const initials = materia.clave_materia.slice(0, 2).toUpperCase()
  const color = COLORS[materia.id_grupo % COLORS.length]

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #E2E8F0',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Iniciales */}
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {initials}
        </div>

        {/* Nombre y clave */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#0F172A',
            lineHeight: '1.4',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {materia.nombre_materia}
          </h3>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
            {materia.clave_materia} • Grupo {materia.letra_grupo}
          </p>
        </div>

        {/* Promedio badge */}
        {promedio !== '--' && (
          <div style={{
            ...getPromedioStyle(promedio),
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 600,
            flexShrink: 0,
          }}>
            {promedio}
          </div>
        )}
      </div>

      {/* Barra de progreso */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Progreso del curso</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#3B82F6' }}>{progressValue}%</span>
        </div>
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: '#F1F5F9',
          borderRadius: '999px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progressValue}%`,
            height: '100%',
            background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
            borderRadius: '999px',
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Calificaciones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {[1, 2, 3, 4].map((num) => {
          const calif = getCalif(num)
          const isFinal = num === 4
          return (
            <div key={num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>{LABELS[num - 1]}</span>
              <div style={{
                width: '100%',
                padding: '8px 4px',
                borderRadius: '10px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 600,
                ...(isFinal && calif ? {
                  ...getGradeStyle(calif),
                  outline: '2px solid rgba(59,130,246,0.2)',
                  outlineOffset: '1px',
                } : getGradeStyle(calif)),
              }}>
                {calif ?? '--'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}