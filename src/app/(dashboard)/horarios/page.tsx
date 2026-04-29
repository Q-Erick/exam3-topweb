'use client';
import { Fragment } from 'react';
import { useHorario } from '@/features/horario/hooks/useHorario';
import { ClassCard } from '@/features/horario/components/ClassCard';

const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const horas = Array.from({ length: 14 }, (_, i) => i + 8); // De 08:00 a 21:00

export default function HorarioPage() {
  const { clases, loading } = useHorario();

  if (loading) return (
    <div className="p-20 text-center text-slate-500 animate-pulse font-medium">
      Cargando Horario Escolar...
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-slate-50/50 min-h-screen">
      {/* Encabezado dinámico */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight">Semestre Primavera 2024</h1>
          <p className="text-slate-500 mt-1 font-medium">Visualización de carga académica actual.</p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Contenedor Principal del Horario */}
        <div className="flex-grow bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative">
          
          {/* Cabecera de Días con estilo fijo para evitar amontonamiento */}
          <div 
            className="grid border-b border-slate-100 pb-4 mb-4 text-center"
            style={{ gridTemplateColumns: '80px repeat(5, 1fr)' }}
          >
            <div className="text-xs uppercase font-bold text-slate-400">Hora</div>
            {dias.map((dia) => (
              <div key={dia} className="text-xs uppercase font-bold text-slate-400">
                {dia}
              </div>
            ))}
          </div>

          {/* Cuerpo del Horario (Horas y Cuadrícula) */}
          <div 
            className="relative grid" 
            style={{ 
              gridTemplateColumns: '80px repeat(5, 1fr)',
              height: `${horas.length * 80}px` 
            }}
          >
            {/* Líneas de fondo y etiquetas de hora */}
            {horas.map(hora => (
              <Fragment key={`row-${hora}`}>
                <div className="relative -top-2 text-right pr-6 text-xs font-mono text-slate-400 h-[80px]">
                  {hora.toString().padStart(2, '0')}:00
                </div>
                {dias.map((_, i) => (
                  <div key={`cell-${hora}-${i}`} className="border-l border-slate-100 border-t border-slate-50 h-[80px]"></div>
                ))}
              </Fragment>
            ))}

            {/* Capa de Clases: Posicionamiento Absoluto sobre la cuadrícula */}
            <div className="absolute inset-0 ml-[80px] pointer-events-none">
              {clases.map(clase => {
                // Cálculo de posición vertical (80px por hora, empezando a las 8am)
                const topOffset = (clase.horaInicio - 8) * 80;
                const cardHeight = clase.duracion * 80;
                // Cálculo de posición horizontal (20% de ancho por cada uno de los 5 días)
                const leftOffset = (clase.dia - 1) * 20;

                return (
                  <div 
                    key={clase.id} 
                    className="absolute p-1 pointer-events-auto transition-all duration-300 hover:z-20"
                    style={{ 
                      top: `${topOffset}px`,
                      height: `${cardHeight}px`,
                      left: `${leftOffset}%`,
                      width: '20%' 
                    }}
                  >
                    <ClassCard clase={clase} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel Lateral de Información */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-8">
            <h3 className="font-bold text-slate-900 mb-4">Información del Horario</h3>
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Materias Inscritas</p>
                <p className="text-3xl font-black text-indigo-900">{clases.length}</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Si no visualizas tus materias, verifica tu conexión o contacta a servicios escolares.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}