'use client'

import { useState, useEffect, useCallback, forwardRef } from 'react'
import { useEstudiante } from '@/features/estudiante/hooks/useEstudiante'
import { Badge } from '@/shared/components/ui/Badge'
import { CalendarDays, Activity, Send, CalendarX2, Plus, X, Trash2, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'

import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { es } from 'date-fns/locale/es'
import { PatternFormat } from 'react-number-format'

registerLocale('es', es)

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

const CustomDateInput = forwardRef<HTMLInputElement, any>((props, ref) => {
  return (
    <PatternFormat
      {...props}
      getInputRef={ref}
      format="##/##/####"
      mask="_"
      placeholder="dd/mm/aaaa"
    />
  );
});
CustomDateInput.displayName = 'CustomDateInput';

export default function CitasPage() {
  const { estudiante } = useEstudiante()
  const [form, setForm] = useState<{ especialidad: string, fecha: Date | null, motivo: string }>({ 
    especialidad: 'Psicología', 
    fecha: null, 
    motivo: '' 
  })
  const [citas, setCitas] = useState<any[]>([])
  
  // 🔥 NUEVO ESTADO DE CARGA PARA LAS CITAS 🔥
  const [loadingCitas, setLoadingCitas] = useState(true)

  // ESTADOS DE FORMULARIO
  const [enviando, setEnviando] = useState(false)
  const [showModal, setShowModal] = useState(false) 
  
  // ESTADOS PARA EL MODAL DE BORRAR
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [citaToDelete, setCitaToDelete] = useState<string | null>(null)
  const [eliminando, setEliminando] = useState(false)

  // SISTEMA DINÁMICO DE ALERTAS
  type AlertType = 'success' | 'warning' | 'error' | 'info';
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: '',
    type: 'info' as AlertType
  });

  const showAlert = (message: string, type: AlertType = 'info') => {
    setAlertConfig({ isOpen: true, message, type });
  }

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
  }

  const getAlertStyles = (type: AlertType) => {
    switch (type) {
      case 'success': return { bg: 'linear-gradient(to right, #10b981, #059669)', shadow: 'rgba(16, 185, 129, 0.3)', icon: <CheckCircle className="mr-2" size={24} />, title: ' Éxito' };
      case 'error': return { bg: 'linear-gradient(to right, #ef4444, #dc2626)', shadow: 'rgba(239, 68, 68, 0.3)', icon: <XCircle className="mr-2" size={24} />, title: ' Error' };
      case 'warning': return { bg: 'linear-gradient(to right, #f59e0b, #d97706)', shadow: 'rgba(245, 158, 11, 0.3)', icon: <AlertTriangle className="mr-2" size={24} />, title: ' Aviso' };
      default: return { bg: 'linear-gradient(to right, #3b82f6, #2563eb)', shadow: 'rgba(59, 130, 246, 0.3)', icon: <Info className="mr-2" size={24} />, title: ' Información' };
    }
  }
  const currentAlertStyle = getAlertStyles(alertConfig.type);

  // 1. LEER LAS CITAS DESDE TU API
  const fetchCitas = useCallback(async () => {
    if (!estudiante?.numero_control) return
    
    setLoadingCitas(true) // Iniciamos la carga
    
    try {
      const res = await fetch(`/api/citas?numero_control=${estudiante.numero_control}`)
      if (res.ok) {
        const data = await res.json()
        setCitas(data)
      }
    } catch (err) {
      console.error("Error al cargar citas:", err)
    } finally {
      setLoadingCitas(false) // Apagamos la carga pase lo que pase
    }
  }, [estudiante?.numero_control])

  useEffect(() => { fetchCitas() }, [fetchCitas])

  // 2. INSERTAR CITA VÍA API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!estudiante?.numero_control || !form.fecha) return

    const yaTienePendiente = citas.some(
      (cita) => cita.especialidad === form.especialidad && cita.status === 'Pendiente'
    );

    if (yaTienePendiente) {
      showAlert(`Ya tienes una solicitud de ${form.especialidad} en estado "Pendiente". Espera a que sea procesada antes de pedir otra.`, 'warning');
      return; 
    }

    setEnviando(true)
    const fechaAEnviar = form.fecha.toISOString().split('T')[0]

    try {
      const res = await fetch('/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero_control: estudiante.numero_control,
          especialidad: form.especialidad,
          fecha: fechaAEnviar,
          motivo: form.motivo || null,
          status: 'Pendiente'
        })
      })

      if (res.ok) {
        setForm({ especialidad: 'Psicología', fecha: null, motivo: '' })
        fetchCitas()
        setShowModal(false)
        showAlert('Tu solicitud ha sido enviada correctamente.', 'success')
      } else {
        const errorData = await res.json()
        showAlert("Error al agendar la cita: " + errorData.error, 'error')
      }
    } catch (err: any) {
      showAlert("Error de comunicación con el servidor.", 'error')
    } finally {
      setEnviando(false)
    }
  }

  // 3. ABRIR MODAL DE ELIMINAR
  const openDeleteModal = (id: string) => {
    setCitaToDelete(id);
    setDeleteModalOpen(true);
  }

  // 4. CONFIRMAR LA ELIMINACIÓN VÍA API
  const confirmDelete = async () => {
    if (!citaToDelete) return;
    setEliminando(true);

    try {
      const res = await fetch(`/api/citas?id=${citaToDelete}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        fetchCitas();
        setDeleteModalOpen(false);
        setCitaToDelete(null);
        showAlert('La cita ha sido cancelada y eliminada.', 'success'); 
      } else {
        const errorData = await res.json()
        showAlert("Error al eliminar la cita: " + errorData.error, 'error')
      }
    } catch (err) {
      showAlert("Error de comunicación al intentar eliminar.", 'error');
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div className="citas-wrapper">

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

      <section className="citas-list-section">
        <h2 className="citas-list-title">
          <span className="text-3xl">📋</span> Mis Citas Recientes
        </h2>

        <div className="citas-list-container">
          {/* 🔥 LÓGICA DE RENDERIZADO: 1. Cargando, 2. Vacío, 3. Lista 🔥 */}
          {loadingCitas ? (
            // SKELETONS DE CARGA (Animación parpadeante)
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((skeleton) => (
                <div key={skeleton} className="p-8 border border-slate-200 bg-slate-50 flex justify-between items-center h-[120px]">
                  <div className="space-y-4 w-1/2">
                    <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                    <div className="flex gap-4">
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-slate-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          ) : citas.length === 0 ? (
            // ESTADO VACÍO (Solo se muestra si terminó de cargar y no hay nada)
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
            // LISTA DE CITAS REALES
            citas.map((cita: any) => (
              <div key={cita.id} className="citas-card">
                <div className="citas-card-info">
                  <h3 className="citas-card-specialty">{cita.especialidad}</h3>
                  <div className="citas-card-dates">
                    <span className="citas-date-badge">
                      <CalendarDays size={16} className="text-blue-500" />
                      Cita: {formatearFecha(cita.fecha)}
                    </span>
                    <span className="citas-date-text">
                      Enviado el {formatearFecha(cita.created_at)}
                    </span>
                  </div>
                  {cita.motivo && (
                    <p className="text-sm text-slate-500 italic mt-2">"{cita.motivo}"</p>
                  )}
                </div>

                <div className="citas-card-status flex items-center gap-4">
                  <Badge className={`citas-status-badge ${
                    cita.status === 'Pendiente' ? 'status-pendiente' :
                    cita.status === 'Aceptada' ? 'status-aceptada' :
                    'status-rechazada'
                  }`}>
                    {cita.status}
                  </Badge>

                  <button 
                    onClick={() => openDeleteModal(cita.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors border-none bg-transparent cursor-pointer"
                    title="Cancelar cita"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MODAL DE NUEVA CITA */}
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
                <DatePicker
                  selected={form.fecha}
                  onChange={(date: Date | null) => setForm({ ...form, fecha: date })}
                  dateFormat="dd/MM/yyyy"
                  locale="es"
                  minDate={new Date()}
                  disabled={enviando}
                  required
                  customInput={<CustomDateInput className="react-datepicker-custom" />} 
                />
              </div>

              <div className="citas-form-group">
                <label>Motivo de la consulta (Opcional)</label>
                <textarea
                  placeholder="Describe brevemente tus síntomas (puedes dejarlo vacío)..."
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
                  disabled={enviando || !estudiante || !form.fecha} 
                  className="citas-btn-submit"
                >
                  {enviando ? 'PROCESANDO...' : <> <Send size={18} /> CONFIRMAR </>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE BORRADO */}
      {deleteModalOpen && (
        <div className="citas-modal-overlay">
          <div className="citas-modal-card" style={{ maxWidth: '450px' }}>
            
            <div className="citas-modal-header" style={{ background: 'linear-gradient(to right, #dc2626, #b91c1c)' }}>
              <h2><AlertTriangle className="mr-2" size={24} /> Cancelar Solicitud</h2>
              <button onClick={() => setDeleteModalOpen(false)} disabled={eliminando} className="citas-modal-close">
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              <p style={{ fontSize: '1.1rem', color: '#334155', marginBottom: '32px', lineHeight: '1.5' }}>
                ¿Estás seguro de que deseas cancelar y eliminar esta solicitud médica? <strong>Esta acción es permanente.</strong>
              </p>

              <div className="citas-form-actions">
                <button onClick={() => setDeleteModalOpen(false)} disabled={eliminando} className="citas-btn-cancel">
                  VOLVER
                </button>
                
                <button 
                  onClick={confirmDelete}
                  disabled={eliminando} 
                  className="citas-btn-submit"
                  style={{ background: 'linear-gradient(to right, #ef4444, #dc2626)', boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.3)' }}
                >
                  {eliminando ? 'ELIMINANDO...' : <> <Trash2 size={18} /> CONFIRMAR </>}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DINÁMICO GENÉRICO */}
      {alertConfig.isOpen && (
        <div className="citas-modal-overlay" style={{ zIndex: 100 }}>
          <div className="citas-modal-card" style={{ maxWidth: '450px' }}>
            
            <div className="citas-modal-header" style={{ background: currentAlertStyle.bg }}>
              <h2>{currentAlertStyle.icon} {currentAlertStyle.title}</h2>
              <button onClick={closeAlert} className="citas-modal-close">
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              <p style={{ fontSize: '1.1rem', color: '#334155', marginBottom: '32px', lineHeight: '1.5' }}>
                {alertConfig.message}
              </p>

              <div className="citas-form-actions">
                <button 
                  onClick={closeAlert}
                  className="citas-btn-submit"
                  style={{ background: currentAlertStyle.bg, boxShadow: `0 4px 6px -1px ${currentAlertStyle.shadow}` }}
                >
                  ENTENDIDO
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}