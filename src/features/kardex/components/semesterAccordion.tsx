'use client';

export const SemesterAccordion = ({ periodoData }: { periodoData: any }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Cabecera del Acordeón */}
      <div className="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800 text-lg uppercase tracking-tight">{periodoData.periodo}</h3>
          <div className="flex gap-3 mt-1">
            <span className="text-[10px] font-bold text-slate-400 italic">PROMEDIO: 85.2</span>
            <span className="text-[10px] font-bold text-slate-400 italic">CRÉDITOS: 24</span>
          </div>
        </div>
        <span className="text-[10px] font-black px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm">
          ✓ COMPLETADO
        </span>
      </div>

      {/* Tabla de Materias */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/30 text-slate-400 uppercase text-[9px] font-black tracking-widest">
            <tr>
              <th className="px-8 py-4">Asignatura</th>
              <th className="px-8 py-4 text-center">Créditos</th>
              <th className="px-8 py-4 text-right">Calificación Final</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-700">
            {periodoData.materias.map((m: any, index: number) => (
              <tr key={index} className="hover:bg-blue-50/20 transition-colors group">
                <td className="px-8 py-5">
                  <p className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {m.nombre_materia}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{m.clave_materia || 'TEC-1234'}</p>
                </td>
                <td className="px-8 py-5 text-center font-medium text-slate-500">
                  {m.creditos}
                </td>
                <td className="px-8 py-5 text-right">
                  <span className={`inline-block px-4 py-1.5 rounded-xl font-black text-sm min-w-[50px] text-center
                    ${m.calificacion >= 90 ? 'bg-blue-50 text-blue-700' : 
                      m.calificacion >= 80 ? 'bg-slate-100 text-slate-800' : 'bg-orange-50 text-orange-700'}`}>
                    {m.calificacion}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};