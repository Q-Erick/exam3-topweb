'use client'

import { useState, useEffect, useCallback } from 'react'
import { Badge } from '@/shared/components/ui/Badge'
import { 
  Activity, Trash2, Check, X as XIcon, UserMinus, 
  CheckCheck, Info, XCircle, CheckCircle, AlertTriangle, 
  X, ShieldAlert, CalendarDays, Filter, ChevronDown, Clock
} from 'lucide-react'
import { useEstudiante } from '@/features/estudiante/hooks/useEstudiante'

// Helper para formatear fechas
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
  const opcionesStatus = ['Pendiente', 'Aceptada', 'Completada', 'Cancelada', 'Inasistencia', 'Todos']

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

  // --- 🔥 CONEXIÓN A LA API (MODO ADMIN) 🔥 ---
  const fetchAllCitas = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true)
    try {
      // Usamos el parámetro que definimos para el "Modo Dios"
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
    // Solo disparamos si es el correo del admin verificado
    if (estudiante?.email === 'l22030574@celaya.tecnm.mx') fetchAllCitas() 
  }, [fetchAllCitas, estudiante])

  // --- ACCIONES USANDO EL ENDPOINT ---
  const handleUpdateStatus = async (id: string, nuevoStatus: string) => {
    const token = localStorage.getItem('token');
    try {
      // Idealmente, también deberías tener un PATCH en /api/citas/[id]
      // Mientras tanto, si usas supabase directo para UPDATE, asegúrate de refrescar
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
  const citasFiltradas = filtroStatus === 'Todos' 
    ? citas 
    : citas.filter(c => c.status === filtroStatus);

  const psicologia = citasFiltradas.filter(c => c.especialidad === 'Psicología');
  const nutricion = citasFiltradas.filter(c => c.especialidad === 'Nutrición');
  const oftalmologia = citasFiltradas.filter(c => c.especialidad === 'Oftalmología');

  if (loadingEstudiante) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse text-2xl">AUTENTICANDO...</div>
  
  if (estudiante?.email !== 'l22030574@celaya.tecnm.mx') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-red-50 p-10 border-2 border-red-200 text-center flex flex-col items-center rounded-2xl">
          <ShieldAlert size={80} className="text-red-500 mb-6" />
          <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase">Acceso Denegado</h1>
          <p className="text-slate-600 text-lg">Este panel es exclusivo para el administrador del sistema.</p>
        </div>
      </div>
    )
  }

  const ColumnaEspecialidad = ({ titulo, data, color }: { titulo: string, data: any[], color: string }) => (
    <div className="admin-board-column">
      <div className="admin-column-header" style={{ background: color }}>
        <h2 className="text-lg font-black uppercase tracking-tighter">{titulo}</h2>
        <span className="bg-white/20 px-3 py-1 text-xs font-bold rounded-full">{data.length}</span>
      </div>
      <div className="admin-column-content">
        {data.length === 0 ? (
          <div className="text-center py-20 text-slate-300 font-bold italic">Sin registros</div>
        ) : (
          data.map(cita => (
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

  return (
    <div className="citas-wrapper">
      <header className="citas-header">
        <div>
          <div className="citas-title-container">
            <div className="citas-icon-box" style={{ background: '#4f46e5', color: 'white' }}>
              <Activity size={32} strokeWidth={2.5} />
            </div>
            <h1 className="citas-title">Panel Maestro</h1>
          </div>
          <p className="citas-subtitle">Administración centralizada de citas de atención integral</p>
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
        <div className="p-32 text-center font-black text-slate-200 animate-pulse text-5xl italic tracking-tighter">SINCRONIZANDO API...</div>
      ) : ( 
        <div className="admin-kanban-slider">
          <ColumnaEspecialidad titulo="Psicología" data={psicologia} color="#8b5cf6" />
          <ColumnaEspecialidad titulo="Nutrición" data={nutricion} color="#10b981" />
          <ColumnaEspecialidad titulo="Oftalmología" data={oftalmologia} color="#3b82f6" />
        </div>
      )}

      {/* Modal Alerta dinámico */}
      {alertConfig.isOpen && (
        <div className="citas-modal-overlay" style={{ zIndex: 100 }}>
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