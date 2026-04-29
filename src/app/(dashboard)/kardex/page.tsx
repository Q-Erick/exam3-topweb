'use client';
import { useKardex } from '@/features/kardex/hooks/useKardex';
import { SemesterAccordion } from '@/features/kardex/components/semesterAccordion';

export default function KardexPage() {
  const { historial, loading } = useKardex();

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400 font-medium">Cargando Historial Académico...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-slate-50/50 min-h-screen">
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Historial Académico</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Enero - Junio 2026 • Semestre 10</p>
        </div>
        
        {/* Tarjetas de Resumen Rápido */}
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Promedio General</p>
            <p className="text-2xl font-black text-blue-600">83.7</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Créditos Totales</p>
            <p className="text-2xl font-black text-slate-800">210 / 260</p>
          </div>
        </div>
      </div>

      {/* Lista de Semestres */}
      <div className="grid gap-6">
        {historial.map((p, i) => (
          <SemesterAccordion key={i} periodoData={p} />
        ))}
      </div>
    </div>
  );
}