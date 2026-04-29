'use client';

const colores = [
  'bg-blue-50 border-blue-200 text-blue-900',
  'bg-green-50 border-green-200 text-green-900',
  'bg-purple-50 border-purple-200 text-purple-900',
  'bg-orange-50 border-orange-200 text-orange-900',
  'bg-red-50 border-red-200 text-red-900',
];

// Asigna color consistente por materia
function getColor(nombre: string) {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) hash += nombre.charCodeAt(i);
  return colores[hash % colores.length];
}

export const ClassCard = ({ clase }: { clase: any }) => {
  const colorClass = getColor(clase.nombre);

  return (
    <div className={`h-full w-full rounded-2xl border ${colorClass} shadow-inner p-2 overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-md`}>
      <div className="flex justify-between items-start gap-1">
        <span className="text-[9px] font-mono uppercase bg-white/60 px-1.5 py-0.5 rounded-full border border-current/20 truncate">
          {clase.clave}
        </span>
        <span className="text-[9px] font-medium shrink-0">
          {clase.aula}
        </span>
      </div>
      <h4 className="mt-1 text-[10px] font-bold leading-snug line-clamp-3">
        {clase.nombre}
      </h4>
    </div>
  );
};