'use client'

import { useState, useEffect, useCallback, forwardRef } from 'react'
import { useEstudiante } from '@/features/estudiante/hooks/useEstudiante'
import { Badge } from '@/shared/components/ui/Badge'
import { CalendarDays, Activity, Send, CalendarX2, Plus, X, Trash2, AlertTriangle, Info, CheckCircle, XCircle, Clock, Lock } from 'lucide-react'

import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { es } from 'date-fns/locale/es'
import { PatternFormat } from 'react-number-format'
import { supabase } from '@/shared/lib/supabase'

registerLocale('es', es)

const HORARIOS_DISPONIBLES = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const formatearFecha = (fechaString: string) => {
    if (!fechaString) return '';
    if (fechaString.length === 10 && fechaString.includes('-')) {
        const [year, month, day] = fechaString.split('-');
        return `${day}/${month}/${year}`;
    }
    return new Date(fechaString).toLocaleDateString('es-MX', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

const CustomDateInput = forwardRef<HTMLInputElement, any>((props, ref) => {
    return <PatternFormat {...props} getInputRef={ref} format="##/##/####" mask="_" placeholder="dd/mm/aaaa" />;
});
CustomDateInput.displayName = 'CustomDateInput';

export default function CitasPage() {
    const { estudiante } = useEstudiante()
    const [form, setForm] = useState({
        especialidad: 'Psicología',
        fecha: null as Date | null,
        hora: '09:00 AM',
        motivo: ''
    })
    
    const [citasPersonales, setCitasPersonales] = useState<any[]>([])
    const [ocupacionGlobal, setOcupacionGlobal] = useState<any[]>([])
    const [loadingCitas, setLoadingCitas] = useState(true)
    const [enviando, setEnviando] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [citaToDelete, setCitaToDelete] = useState<string | null>(null)
    const [eliminando, setEliminando] = useState(false)

    const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: '', type: 'info' as 'success' | 'warning' | 'error' | 'info' });

    const showAlert = (message: string, type: any = 'info') => setAlertConfig({ isOpen: true, message, type });
    const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

    const getAlertStyles = (type: string) => {
        switch (type) {
            case 'success': return { bg: 'linear-gradient(to right, #10b981, #059669)', icon: <CheckCircle className="mr-2" size={24} />, title: 'Éxito' };
            case 'error': return { bg: 'linear-gradient(to right, #ef4444, #dc2626)', icon: <XCircle className="mr-2" size={24} />, title: 'Error' };
            case 'warning': return { bg: 'linear-gradient(to right, #f59e0b, #d97706)', icon: <AlertTriangle className="mr-2" size={24} />, title: 'Aviso' };
            default: return { bg: 'linear-gradient(to right, #3b82f6, #2563eb)', icon: <Info className="mr-2" size={24} />, title: 'Información' };
        }
    }
    const currentAlertStyle = getAlertStyles(alertConfig.type);

    // --- CARGA DE DATOS CON TOKEN ---
    const fetchData = useCallback(async () => {
        // Obtenemos el token del almacenamiento local (ajusta según donde lo guardes)
        const token = localStorage.getItem('token');
        if (!estudiante?.numero_control || !token) return;

        setLoadingCitas(true)
        try {
            // Petición al endpoint protegido
            const resPerso = await fetch(`/api/citas?numero_control=${estudiante.numero_control}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (resPerso.ok) setCitasPersonales(await resPerso.json())

            // Disponibilidad global desde Supabase directamente o desde otra API
            const { data: global } = await supabase
                .from('citas')
                .select('fecha, hora_sugerida, especialidad')
                .in('status', ['Pendiente', 'Aceptada'])
            
            setOcupacionGlobal(global || [])
        } catch (err) { console.error(err) } finally { setLoadingCitas(false) }
    }, [estudiante?.numero_control])

    useEffect(() => { fetchData() }, [fetchData])

    const citasActivasPropias = citasPersonales.filter(c => c.status === 'Pendiente' || c.status === 'Aceptada');
    const limiteGlobalPropioAlcanzado = citasActivasPropias.length >= 3;

    const checkHoraOcupadaGlobal = (fecha: Date | null, hora: string, especialidad: string) => {
        if (!fecha) return false;
        const fechaStr = fecha.toISOString().split('T')[0];
        return ocupacionGlobal.some(cita => 
            cita.fecha === fechaStr && 
            cita.hora_sugerida === hora && 
            cita.especialidad === especialidad
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('token');
        if (!estudiante?.numero_control || !form.fecha || !token) return

        const fechaStr = form.fecha.toISOString().split('T')[0];

        // Validaciones locales
        if (citasActivasPropias.find(c => c.fecha === fechaStr)) {
            showAlert(`Ya tienes una cita agendada para este día. Máximo una cita diaria.`, 'warning');
            return;
        }

        if (citasActivasPropias.find(c => c.especialidad === form.especialidad)) {
            showAlert(`Ya tienes una solicitud de ${form.especialidad} activa.`, 'warning');
            return;
        }

        if (checkHoraOcupadaGlobal(form.fecha, form.hora, form.especialidad)) {
            showAlert(`El horario de las ${form.hora} para ${form.especialidad} ya está ocupado.`, 'error');
            return;
        }

        setEnviando(true)
        try {
            const res = await fetch('/api/citas', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    numero_control: estudiante.numero_control,
                    especialidad: form.especialidad,
                    fecha: fechaStr,
                    hora_sugerida: form.hora,
                    nombre_estudiante: estudiante.persona, // Enviamos el nombre para el Admin
                    motivo: form.motivo || null,
                    status: 'Pendiente'
                })
            })

            if (res.ok) {
                setForm({ especialidad: 'Psicología', fecha: null, hora: '09:00 AM', motivo: '' })
                fetchData(); setShowModal(false); showAlert('Solicitud enviada con éxito.', 'success')
            } else {
                const err = await res.json();
                showAlert(err.error || "Error al agendar", 'error');
            }
        } catch (err) { showAlert("Error de servidor", 'error') } finally { setEnviando(false) }
    }

    const confirmDelete = async () => {
        const token = localStorage.getItem('token');
        if (!citaToDelete || !token) return;
        setEliminando(true);
        try {
            const res = await fetch(`/api/citas?id=${citaToDelete}`, { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) { fetchData(); setDeleteModalOpen(false); showAlert('Cita cancelada.', 'success'); }
        } catch (err) { showAlert("Error al borrar.", 'error') } finally { setEliminando(false) }
    }

    return (
        <div className="citas-wrapper">
            <header className="citas-header">
                <div className="citas-title-container">
                    <div className="citas-icon-box"><Activity size={32} /></div>
                    <div>
                        <h1 className="citas-title">Citas de Atención Integral</h1>
                        <p className="citas-subtitle">Agenda una cita para acudir con nuestros especialistas.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowModal(true)} 
                    disabled={limiteGlobalPropioAlcanzado}
                    className={`citas-btn-primary ${limiteGlobalPropioAlcanzado ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Plus size={24} /> {limiteGlobalPropioAlcanzado ? 'LÍMITE ALCANZADO' : 'NUEVA SOLICITUD'}
                </button>
            </header>

            <section className="citas-list-section">
                <div className="citas-list-container">
                    {loadingCitas ? <div className="animate-pulse p-10 text-center">Actualizando...</div> : 
                    citasPersonales.length === 0 ? (
                        <div className="citas-empty-state">
                            <CalendarX2 size={40} className="text-slate-400" />
                            <h3>Sin citas registradas</h3>
                        </div>
                    ) :
                    citasPersonales.map((cita) => (
                        <div key={cita.id} className="citas-card">
                            <div className="citas-card-info">
                                <h3 className="citas-card-specialty">{cita.especialidad}</h3>
                                <div className="flex gap-4 mt-2">
                                    <span className="citas-date-badge"><CalendarDays size={16} className="mr-1" />{formatearFecha(cita.fecha)}</span>
                                    <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded"><Clock size={14} className="mr-1" />{cita.hora_sugerida}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge className={`citas-status-badge ${cita.status === 'Pendiente' ? 'status-pendiente' : cita.status === 'Aceptada' ? 'status-aceptada' : 'status-rechazada'}`}>{cita.status}</Badge>
                                
                                {cita.status === 'Aceptada' ? (
                                    <div className="p-2 text-slate-300" title="Cita aceptada. No se puede cancelar.">
                                        <Lock size={20} />
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => { setCitaToDelete(cita.id); setDeleteModalOpen(true); }} 
                                        className="p-2 text-slate-400 hover:text-red-600 border-none bg-transparent cursor-pointer transition-colors"
                                    >
                                        <Trash2 size={24} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* MODAL NUEVA SOLICITUD */}
            {showModal && (
                <div className="citas-modal-overlay">
                    <div className="citas-modal-card">
                        <div className="citas-modal-header">
                            <h2>✨ Nueva Solicitud</h2>
                            <button onClick={() => setShowModal(false)} className="citas-modal-close"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="citas-form">
                            <div className="citas-form-group">
                                <label>Módulo Especialista</label>
                                <select value={form.especialidad} onChange={(e) => setForm({...form, especialidad: e.target.value})}>
                                    <option value="Psicología">Psicología 🧠</option>
                                    <option value="Nutrición">Nutrición 🍎</option>
                                    <option value="Oftalmología">Oftalmología 👁️</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="citas-form-group">
                                    <label>Fecha</label>
                                    <DatePicker 
                                        selected={form.fecha} 
                                        onChange={(date: Date | null) => setForm({ ...form, fecha: date })} 
                                        dateFormat="dd/MM/yyyy" 
                                        locale="es" 
                                        minDate={new Date()} 
                                        required 
                                        customInput={<CustomDateInput />} 
                                    />
                                </div>
                                <div className="citas-form-group">
                                    <label>Hora Sugerida</label>
                                    <select value={form.hora} onChange={(e) => setForm({...form, hora: e.target.value})} required>
                                        {HORARIOS_DISPONIBLES.map(h => {
                                            const ocupada = checkHoraOcupadaGlobal(form.fecha, h, form.especialidad);
                                            return (
                                                <option key={h} value={h} disabled={ocupada}>
                                                    {h} {ocupada ? '(OCUPADO)' : ''}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="citas-form-group">
                                <label>Motivo de consulta (opcional)</label>
                                <textarea placeholder="Cuéntanos brevemente..." value={form.motivo} onChange={(e) => setForm({...form, motivo: e.target.value})} />
                            </div>
                            <div className="citas-form-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="citas-btn-cancel">CANCELAR</button>
                                <button type="submit" disabled={enviando || !form.fecha} className="citas-btn-submit">{enviando ? 'ENVIANDO...' : 'CONFIRMAR'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL ELIMINAR */}
            {deleteModalOpen && (
                <div className="citas-modal-overlay">
                    <div className="citas-modal-card" style={{ maxWidth: '450px' }}>
                        <div className="citas-modal-header" style={{ background: 'linear-gradient(to right, #ef4444, #dc2626)' }}>
                            <h2><AlertTriangle className="mr-2" size={24} /> Cancelar Cita</h2>
                        </div>
                        <div style={{ padding: '32px' }}>
                            <p className="text-slate-600 mb-8">Esta acción liberará el horario seleccionado. ¿Continuar?</p>
                            <div className="citas-form-actions">
                                <button onClick={() => setDeleteModalOpen(false)} className="citas-btn-cancel">VOLVER</button>
                                <button onClick={confirmDelete} className="citas-btn-submit" style={{ background: '#dc2626' }}>{eliminando ? 'ELIMINANDO...' : 'SÍ, CANCELAR'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ALERTAS */}
            {alertConfig.isOpen && (
                <div className="citas-modal-overlay" style={{ zIndex: 100 }}>
                    <div className="citas-modal-card" style={{ maxWidth: '450px' }}>
                        <div className="citas-modal-header" style={{ background: currentAlertStyle.bg }}>
                            <h2>{currentAlertStyle.icon} {currentAlertStyle.title}</h2>
                        </div>
                        <div style={{ padding: '32px' }}>
                            <p className="text-slate-700 text-lg mb-8 leading-relaxed">{alertConfig.message}</p>
                            <button onClick={closeAlert} className="citas-btn-submit" style={{ background: currentAlertStyle.bg }}>ENTENDIDO</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}