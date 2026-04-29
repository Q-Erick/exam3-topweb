'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { SemestreAgrupado } from '@/features/kardex/types/kardex.types'

interface SemesterAccordionProps {
  periodoData: SemestreAgrupado
}

function getGradeStyle(calificacion: string) {
  if (calificacion === 'AC') {
    return { backgroundColor: '#EFF6FF', color: '#1D4ED8' }
  }
  const num = parseFloat(calificacion)
  if (isNaN(num)) return { backgroundColor: '#F1F5F9', color: '#64748B' }
  if (num >= 90) return { backgroundColor: '#DCFCE7', color: '#15803D' }
  if (num >= 80) return { backgroundColor: '#F1F5F9', color: '#0F172A' }
  return { backgroundColor: '#FEF9C3', color: '#A16207' }
}

export function SemesterAccordion({ periodoData }: SemesterAccordionProps) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>

      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: open ? '1px solid #E2E8F0' : 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Número de semestre */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 700,
            flexShrink: 0,
          }}>
            {periodoData.semestre}
          </div>

          <div style={{ textAlign: 'left' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#0F172A',
              margin: 0,
            }}>
              Semestre {periodoData.semestre}
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              Periodo {periodoData.periodo} • {periodoData.materias.length} materias
            </p>
          </div>
        </div>

        {/* Stats + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '6px 14px',
            backgroundColor: '#EFF6FF',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#1D4ED8',
          }}>
            Promedio: {periodoData.promedio}
          </div>
          <div style={{
            padding: '6px 14px',
            backgroundColor: '#F5F3FF',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#6D28D9',
          }}>
            {periodoData.creditos} créditos
          </div>
          {open
            ? <ChevronUp size={18} color="#64748B" />
            : <ChevronDown size={18} color="#64748B" />
          }
        </div>
      </button>

      {/* Tabla */}
      {open && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC' }}>
                <th style={{
                  padding: '12px 24px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94A3B8',
                  textAlign: 'left',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Asignatura
                </th>
                <th style={{
                  padding: '12px 24px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94A3B8',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Créditos
                </th>
                <th style={{
                  padding: '12px 24px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94A3B8',
                  textAlign: 'right',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Calificación
                </th>
              </tr>
            </thead>
            <tbody>
              {periodoData.materias.map((m, index) => (
                <tr
                  key={index}
                  style={{
                    borderTop: '1px solid #F1F5F9',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '16px 24px' }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0F172A',
                      margin: 0,
                    }}>
                      {m.nombre_materia}
                    </p>
                    <p style={{
                      fontSize: '11px',
                      color: '#94A3B8',
                      fontFamily: 'monospace',
                      margin: '2px 0 0 0',
                    }}>
                      {m.clave_materia}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#64748B',
                    }}>
                      {m.creditos}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <span style={{
                      ...getGradeStyle(m.calificacion),
                      display: 'inline-block',
                      padding: '4px 14px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 700,
                      minWidth: '52px',
                      textAlign: 'center',
                    }}>
                      {m.calificacion}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}