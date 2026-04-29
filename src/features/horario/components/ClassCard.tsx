'use client';
import { Clase } from '../hooks/useHorario';

// Mapa de colores suave como en la referencia
const colorMap: { [key: string]: string } = {
  blue: 'bg-blue-50 border-blue-200 text-blue-900',
  green: 'bg-green-50 border-green-200 text-green-900',
  purple: 'bg-purple-50 border-purple-200 text-purple-900',
  orange: 'bg-orange-50 border-orange-200 text-orange-900',
  red: 'bg-red-50 border-red-200 text-red-900',
};

export const ClassCard = ({ clase }: { clase: Clase }) => {
  const colorClass = colorMap[clase.color] || colorMap.blue;
  
  // Calculamos la posición y altura
  const top = (clase.horaInicio - 8) * 80 + 40; // 8am es la base, 80px por hora, 40px de offset
  const height = clase.duracion * 80 - 10; // Reducimos 10px para separación

  return (
    <div 
      className={`absolute left-0 right-0 p-4 mx-2 rounded-2xl border ${colorClass} shadow-inner transition-transform hover:scale-105 hover:shadow-md cursor-pointer`}
      style={{ top: `${top}px`, height: `${height}px` }}
    >
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-mono uppercase bg-white/60 px-2 py-0.5 rounded-full border border-current/20">
          {clase.codigo}
        </span>
        <span className="text-[10px] font-medium text-current/70">
          {clase.salon}
        </span>
      </div>
      <h4 className="mt-2 text-sm font-bold leading-snug text-current">
        {clase.nombre}
      </h4>
      <p className="mt-1 text-xs text-current/80">
        {clase.profesor}
      </p>
    </div>
  );
};