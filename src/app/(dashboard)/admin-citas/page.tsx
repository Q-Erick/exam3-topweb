'use client'

import { useState, useEffect, useCallback } from 'react'
import { Badge } from '@/shared/components/ui/Badge'
import { 
  Activity, Trash2, Check, X as XIcon, UserMinus, 
  CheckCheck, Info, XCircle, CheckCircle, AlertTriangle, 
  X, ShieldAlert, CalendarDays, Filter, ChevronDown, Clock,
  Calendar, LayoutGrid // Nuevos iconos
} from 'lucide-react'
import { useEstudiante } from '@/features/estudiante/hooks/useEstudiante'

const formatearFecha = (fechaString: string) => {
  if (!fechaString) return '';
  const [year, month, day] = fechaString.split('-');
  return `${day}/${month}/${year}`;
};

export default function AdminCitasPage() {
  const { estudiante, loading: loadingEstudiante } = useEstudiante()
  const [citas, setCitas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState<string>('Pendiente')
  const [showAgenda, setShowAgenda] = useState(false) // Estado para el modal de agenda
  const [filtroAgenda, setFiltroAgenda] = useState<string>('Todas') // Filtro interno de la agenda
  
  const opcionesStatus = ['Pendiente', 'Aceptada', 'Completada', 'Cancelada', 'Inasistencia', 'Todos']
  const especialidades = ['Todas', 'Psicología', 'Nutrición', 'Oftalmología']

  // --- SISTEMA DE ALERTAS ---
  type AlertType = 'success' | 'warning' | 'error' | 'info';
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: '', type: 'info' as AlertType });
  const showAlert = (message: string, type: AlertType = 'info') => setAlertConfig({ isOpen: true, message, type });
  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));
  
  const currentAlertStyle = ((type: AlertType) => {
    switch (type) {
      case 'success': return { bg: 'linear-gradient(to right, #10b981, #059669)', shadow: 'rgba(16, 185, 129, 0.3)', icon: <CheckCircle className="mr-2" size={24} />, title: 'Éxito' };
      case 'error': return { bg: 'linear-gradient(to right, #ef4444, #dc2626)', shadow: 'rgba(239, 68, 68, 0.3)', icon: <XCircle className="mr-2" size={24} />, title: 'Error' };
      case 'warning': return { bg: 'linear-gradient(to right, #f59e0b, #d97706)', shadow: 'rgba(245, 158, 11, 0.3)', icon: <AlertTriangle className="mr-2" size={24} />, title: 'Aviso' };
      default: return { bg: 'linear-gradient(to right, #3b82f6, #2563eb)', shadow: 'rgba(59, 130, 246, 0.3)', icon: <Info className="mr-2" size={24} />, title: 'Información' };
    }
  })(alertConfig.type);

  const fetchAllCitas = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoading(true)
    try {
      const res = await fetch('/api/citas?numero_control=admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al obtener datos');
      }
      const data = await res.json();
      setCitas(data || []);
    } catch (err: any) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    if (estudiante?.email === 'l22030574@celaya.tecnm.mx') fetchAllCitas() 
  }, [fetchAllCitas, estudiante])

  const handleUpdateStatus = async (id: string, nuevoStatus: string) => {
    try {
      const { supabase } = await import('@/shared/lib/supabase');
      const { error } = await supabase.from('citas').update({ status: nuevoStatus }).eq('id', id);
      if (error) throw error;
      showAlert(`Estatus actualizado a "${nuevoStatus}"`, 'success');
      fetchAllCitas(); 
    } catch (err: any) {
      showAlert("Error al actualizar: " + err.message, 'error');
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿BORRAR PERMANENTEMENTE?")) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/citas?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("No se pudo eliminar");
      showAlert('Registro eliminado.', 'success');
      fetchAllCitas();
    } catch (err: any) {
      showAlert(err.message, 'error');
    }
  }

  // --- 🎯 FILTRADO DINÁMICO ---
  const citasFiltradas = filtroStatus === 'Todos' ? citas : citas.filter(c => c.status === filtroStatus);
  const psicologia = citasFiltradas.filter(c => c.especialidad === 'Psicología');
  const nutricion = citasFiltradas.filter(c => c.especialidad === 'Nutrición');
  const oftalmologia = citasFiltradas.filter(c => c.especialidad === 'Oftalmología');

  // Lógica para la Agenda (Solo Aceptadas)
  const citasAgenda = citas
    .filter(c => c.status === 'Aceptada')
    .filter(c => filtroAgenda === 'Todas' ? true : c.especialidad === filtroAgenda)
    .sort((a, b) => a.hora_sugerida.localeCompare(b.hora_sugerida));

  if (loadingEstudiante) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse text-2xl uppercase">Verificando...</div>
  
  if (estudiante?.email !== 'l22030574@celaya.tecnm.mx') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <ShieldAlert size={80} className="text-red-500 mb-6" />
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Acceso Denegado</h1>
      </div>
    )
  }

  return (
    <div className="citas-wrapper">
      <header className="citas-header">
        <div className="flex justify-between items-end w-full">
          <div>
            <div className="citas-title-container">
              <div className="citas-icon-box" style={{ background: '#4f46e5', color: 'white' }}>
                <Activity size={32} strokeWidth={2.5} />
              </div>
              <h1 className="citas-title tracking-tighter">Panel Maestro</h1>
            </div>
            <p className="citas-subtitle">Control central de servicios médicos</p>
          </div>
          
          {/* Botón para abrir la Agenda */}
          <button 
            onClick={() => setShowAgenda(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-indigo-200"
          >
            <Calendar size={20} /> VER AGENDA DE HOY
          </button>
        </div>
      </header>

      <div className="admin-filter-bar">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
            <Filter size={18} strokeWidth={3} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter leading-none mb-1">Visualización</p>
            <h3 className="text-sm font-bold text-slate-800 leading-none">Filtrar por estatus</h3>
          </div>
        </div>

        <div className="relative min-w-[200px]">
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="admin-filter-select"
          >
            {opcionesStatus.map((status) => (
              <option key={status} value={status}>{status.toUpperCase()}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown size={16} strokeWidth={3} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-32 text-center font-black text-slate-200 animate-pulse text-5xl italic tracking-tighter">Sincronizando...</div>
      ) : ( 
        <div className="admin-kanban-slider">
          <ColumnaEspecialidad titulo="Psicología" data={psicologia} color="#8b5cf6" handleDelete={handleDelete} handleUpdateStatus={handleUpdateStatus} />
          <ColumnaEspecialidad titulo="Nutrición" data={nutricion} color="#10b981" handleDelete={handleDelete} handleUpdateStatus={handleUpdateStatus} />
          <ColumnaEspecialidad titulo="Oftalmología" data={oftalmologia} color="#3b82f6" handleDelete={handleDelete} handleUpdateStatus={handleUpdateStatus} />
        </div>
      )}

      {/* --- 📅 MODAL DE AGENDA TIPO HORARIO --- */}
      {showAgenda && (
        <div className="citas-modal-overlay" style={{ zIndex: 150 }}>
          <div className="citas-modal-card" style={{ maxWidth: '900px', width: '95%' }}>
            <div className="citas-modal-header" style={{ background: '#1e293b' }}>
              <div className="flex items-center gap-3">
                <Calendar className="text-indigo-400" size={24} />
                <h2 className="uppercase font-black tracking-widest text-sm">Agenda de Citas Aceptadas</h2>
              </div>
              <button onClick={() => setShowAgenda(false)} className="citas-modal-close"><X size={24} /></button>
            </div>
            
            <div className="p-6">
              {/* Filtro por especialidad dentro de la agenda */}
              <div className="flex items-center justify-between mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <LayoutGrid size={18} className="text-slate-400" />
                  <span className="text-xs font-black text-slate-400 uppercase">Especialidad:</span>
                </div>
                <select 
                  value={filtroAgenda}
                  onChange={(e) => setFiltroAgenda(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {especialidades.map(esp => <option key={esp} value={esp}>{esp.toUpperCase()}</option>)}
                </select>
              </div>

              {/* Grid de Horarios */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                {citasAgenda.length === 0 ? (
                  <div className="text-center py-20 text-slate-300 italic font-bold">No hay citas aceptadas para mostrar</div>
                ) : (
                  citasAgenda.map(cita => (
                    <div key={cita.id} className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:border-indigo-200 transition-all">
                      <div className="min-w-[100px] text-center border-r border-slate-100 pr-4">
                        <span className="block text-lg font-black text-indigo-600">{cita.hora_sugerida}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{formatearFecha(cita.fecha)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-black text-slate-800">{cita.numero_control}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold text-white uppercase" style={{ background: cita.especialidad === 'Psicología' ? '#8b5cf6' : cita.especialidad === 'Nutrición' ? '#10b981' : '#3b82f6' }}>
                            {cita.especialidad}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{cita.nombre_estudiante || 'Nombre no registrado'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <Badge className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase">Aceptada</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-3xl">
              <button onClick={() => setShowAgenda(false)} className="w-full bg-slate-800 text-white py-3 rounded-xl font-black text-xs tracking-widest hover:bg-slate-900 transition-all">CERRAR AGENDA</button>
            </div>
          </div>
        </div>
      )}

      {/* Alertas y Modales de Alerta igual que antes */}
      {alertConfig.isOpen && (
        <div className="citas-modal-overlay" style={{ zIndex: 200 }}>
          <div className="citas-modal-card" style={{ maxWidth: '450px' }}>
            <div className="citas-modal-header" style={{ background: currentAlertStyle.bg }}>
              <h2>{currentAlertStyle.icon} {currentAlertStyle.title}</h2>
              <button onClick={closeAlert} className="citas-modal-close"><X size={24} /></button>
            </div>
            <div style={{ padding: '32px' }}>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">{alertConfig.message}</p>
              <div className="citas-form-actions">
                <button onClick={closeAlert} className="citas-btn-submit" style={{ background: currentAlertStyle.bg, boxShadow: `0 4px 6px -1px ${currentAlertStyle.shadow}` }}>ENTENDIDO</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Sub-componente de Columna para mantener limpio el código
const ColumnaEspecialidad = ({ titulo, data, color, handleDelete, handleUpdateStatus }: any) => (
  <div className="admin-board-column">
    <div className="admin-column-header" style={{ background: color }}>
      <h2 className="text-lg font-black uppercase tracking-tighter">{titulo}</h2>
      <span className="bg-white/20 px-3 py-1 text-xs font-bold rounded-full">{data.length}</span>
    </div>
    <div className="admin-column-content">
      {data.length === 0 ? (
        <div className="text-center py-20 text-slate-300 font-bold italic">Sin registros</div>
      ) : (
        data.map((cita: any) => (
          <div key={cita.id} className="admin-cita-card">
            <div className="flex justify-between items-start mb-3">
              <Badge className={`citas-status-badge status-${cita.status.toLowerCase()}`}>
                {cita.status}
              </Badge>
              <button onClick={() => handleDelete(cita.id)} className="admin-btn-delete"><Trash2 size={18} /></button>
            </div>
            <h3 className="font-black text-slate-800 text-xl tracking-tight">{cita.numero_control}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">{cita.nombre_estudiante || 'Alumno'}</p>
            <div className="flex flex-wrap gap-3 mb-4">
              <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                <CalendarDays size={14} className="text-slate-400" /> {formatearFecha(cita.fecha)}
              </p>
              <p className="text-[11px] text-blue-600 font-black flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded">
                <Clock size={14} /> {cita.hora_sugerida}
              </p>
            </div>
            {cita.motivo && (
              <div className="bg-slate-50 p-3 text-xs text-slate-600 border-l-4 border-slate-300 italic mb-4 rounded-r">
                "{cita.motivo}"
              </div>
            )}
            <div className="admin-actions-grid">
              <button onClick={() => handleUpdateStatus(cita.id, 'Aceptada')} className="admin-action-btn btn-accept"><Check size={14} /> Aceptar</button>
              <button onClick={() => handleUpdateStatus(cita.id, 'Cancelada')} className="admin-action-btn btn-cancel"><XIcon size={14} /> Cancelar</button>
              <button onClick={() => handleUpdateStatus(cita.id, 'Inasistencia')} className="admin-action-btn btn-noshow"><UserMinus size={14} /> Faltó</button>
              <button onClick={() => handleUpdateStatus(cita.id, 'Completada')} className="admin-action-btn btn-complete"><CheckCheck size={14} /> Listo</button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);