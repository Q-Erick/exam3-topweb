import { TrendingUp, BookOpen, Award } from 'lucide-react'
import { Estudiante } from '@/features/estudiante/types/estudiante.types'

interface StatsBarProps {
  promedioGeneral: string
  totalMaterias: number
  estudiante: Estudiante | null
}

const stats_config = [
  {
    key: 'promedio',
    icon: TrendingUp,
    label: 'Promedio General',
    iconColor: '#3B82F6',
    iconBg: '#EFF6FF',
  },
  {
    key: 'materias',
    icon: BookOpen,
    label: 'Materias',
    iconColor: '#8B5CF6',
    iconBg: '#F5F3FF',
  },
  {
    key: 'historico',
    icon: Award,
    label: 'Promedio Histórico',
    iconColor: '#10B981',
    iconBg: '#ECFDF5',
  },
]

export function StatsBar({ promedioGeneral, totalMaterias, estudiante }: StatsBarProps) {
  const values: Record<string, string> = {
    promedio: promedioGeneral,
    materias: totalMaterias.toString(),
    historico: estudiante
      ? parseFloat(estudiante.promedio_ponderado).toFixed(1)
      : '--',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      {stats_config.map(({ key, icon: Icon, label, iconColor, iconBg }) => (
        <div key={key} style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{
            padding: '10px',
            borderRadius: '12px',
            backgroundColor: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={18} color={iconColor} />
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>{label}</p>
            <p style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', margin: '2px 0 0 0' }}>
              {values[key]}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}