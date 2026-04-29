'use client'

import { useState, useEffect, useCallback } from 'react'
import { useEstudiante } from '@/features/estudiante/hooks/useEstudiante'
import { Badge } from '@/shared/components/ui/Badge'
import { CalendarDays, Activity, Send, CalendarX2, Plus, X } from 'lucide-react'

const formatearFecha = (fechaString: string) => {
  if (!fechaString) return '';
  if (fechaString.length === 10 && fechaString.includes('-')) {
    const [year, month, day] = fechaString.split('-');
    return `${day}/${month}/${year}`;
  }
  return new Date(fechaString).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function CitasPage() {
  const { estudiante } = useEstudiante()
  const [form, setForm] = useState({ especialidad: 'Psicología', fecha: '', motivo: '' })
  const [citas, setCitas] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const fetchCitas = useCallback(async () => {
    if (!estudiante?.numero_control) return
    try {
      const res = await fetch('/api/citas')
      if (res.ok) {
        const data = await res.json()
        setCitas(data.filter((c: any) => c.numero_control === estudiante.numero_control))
      }
    } catch (err) {
      console.error(err)
    }
  }, [estudiante?.numero_control])

  useEffect(() => { fetchCitas() }, [fetchCitas])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!estudiante?.numero_control) return

    setEnviando(true)
    try {
      const res = await fetch('/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, numero_control: estudiante.numero_control })
      })

      if (res.ok) {
        setForm({ especialidad: 'Psicología', fecha: '', motivo: '' })
        fetchCitas()
        setShowModal(false)
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="citas-wrapper">

      {/* HEADER */}
      <header className="citas-header">
        <div>
          <div className="citas-title-container">
            <div className="citas-icon-box">
              <Activity size={32} strokeWidth={2.5} />
            </div>
            <h1 className="citas-title">Citas de Atención Integral</h1>
          </div>
          <p className="citas-subtitle">
            Gestiona tus solicitudes de atención en el campus.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="citas-btn-primary">
          <Plus size={24} strokeWidth={3} />
          NUEVA SOLICITUD
        </button>
      </header>

      {/* LISTA DE TRÁMITES */}
      <section className="citas-list-section">
        <h2 className="citas-list-title">
          <span className="text-3xl">📋</span> Mis Trámites Recientes
        </h2>

        <div className="citas-list-container">
          {citas.length === 0 ? (
            <div className="citas-empty-state">
              <div className="citas-empty-icon">
                <CalendarX2 size={40} className="text-slate-400" />
              </div>
              <h3 className="citas-empty-title">Sin solicitudes</h3>
              <p className="citas-empty-desc">
                No tienes citas médicas registradas aún. Haz clic en "NUEVA SOLICITUD" para agendar tu primera cita.
              </p>
            </div>
          ) : (
            [...citas].reverse().map((cita: any) => (
              <div key={cita.id} className="citas-card">
                <div className="citas-card-info">
                  <h3 className="citas-card-specialty">{cita.especialidad}</h3>
                  <div className="citas-card-dates">
                    <span className="citas-date-badge">
                      <CalendarDays size={16} className="text-blue-500" />
                      Cita: {formatearFecha(cita.fecha)}
                    </span>
                    <span className="citas-date-text">
                      Enviado el {formatearFecha(cita.fecha_creacion)}
                    </span>
                  </div>
                </div>

                <div className="citas-card-status">
                  <Badge className={`citas-status-badge ${
                    cita.status === 'Pendiente' ? 'status-pendiente' :
                    cita.status === 'Aceptada' ? 'status-aceptada' :
                    'status-rechazada'
                  }`}>
                    {cita.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MODAL */}
      {showModal && (
        <div className="citas-modal-overlay">
          <div className="citas-modal-card">
            
            <div className="citas-modal-header">
              <h2><span className="text-2xl mr-2">✨</span> Nueva Solicitud</h2>
              <button onClick={() => setShowModal(false)} disabled={enviando} className="citas-modal-close">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="citas-form">
              
              <div className="citas-form-group">
                <label>Especialidad</label>
                <select 
                  required
                  value={form.especialidad}
                  onChange={(e) => setForm({...form, especialidad: e.target.value})}
                  disabled={enviando}
                >
                  <option value="Psicología">Psicología 🧠</option>
                  <option value="Nutrición">Nutrición 🍎</option>
                  <option value="Oftalmología">Oftalmología 👁️</option>
                </select>
              </div>

              <div className="citas-form-group">
                <label>Fecha Preferente</label>
                <input
                  type="date"
                  required
                  value={form.fecha}
                  onChange={(e) => setForm({...form, fecha: e.target.value})}
                  disabled={enviando}
                />
              </div>

              <div className="citas-form-group">
                <label>Motivo de la consulta</label>
                <textarea
                  required
                  placeholder="Describe brevemente tus síntomas o motivo..."
                  value={form.motivo}
                  onChange={(e) => setForm({...form, motivo: e.target.value})}
                  disabled={enviando}
                />
              </div>

              <div className="citas-form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  disabled={enviando} 
                  className="citas-btn-cancel"
                >
                  CANCELAR
                </button>
                
                <button 
                  type="submit" 
                  disabled={enviando || !estudiante} 
                  className="citas-btn-submit"
                >
                  {enviando ? 'PROCESANDO...' : <> <Send size={18} /> CONFIRMAR </>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}