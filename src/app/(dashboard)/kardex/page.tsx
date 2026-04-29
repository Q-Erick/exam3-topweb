'use client'

import { useKardex } from '@/features/kardex/hooks/useKardex'
import { SemesterAccordion } from '@/features/kardex/components/semesterAccordion'
import { Spinner } from '@/shared/components/ui/Spinner'
import { ErrorMessage } from '@/shared/components/feedback/ErrorMessage'

export default function KardexPage() {
  const {
    historial,
    porcentajeAvance,
    promedioGeneral,
    creditosTotales,
    loading,
    error,
  } = useKardex()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: '448px', margin: '48px auto' }}>
        <ErrorMessage message={error} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Historial Académico
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '4px 0 0 0' }}>
            Registro completo de materias cursadas
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '12px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Promedio General
            </p>
            <p style={{ fontSize: '24px', fontWeight: 800, color: '#3B82F6', margin: '2px 0 0 0' }}>
              {promedioGeneral}
            </p>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '12px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Créditos Acumulados
            </p>
            <p style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '2px 0 0 0' }}>
              {creditosTotales}
            </p>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '12px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Avance de Carrera
            </p>
            <p style={{ fontSize: '24px', fontWeight: 800, color: '#10B981', margin: '2px 0 0 0' }}>
              {porcentajeAvance}%
            </p>
          </div>
        </div>
      </div>

      {/* Barra de avance general */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>Progreso de carrera</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#3B82F6' }}>{porcentajeAvance}%</span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#F1F5F9',
          borderRadius: '999px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${porcentajeAvance}%`,
            height: '100%',
            background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
            borderRadius: '999px',
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Lista de semestres */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {historial.map((s) => (
          <SemesterAccordion key={s.semestre} periodoData={s} />
        ))}
      </div>
    </div>
  )
}