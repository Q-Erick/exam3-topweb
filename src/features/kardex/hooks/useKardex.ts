'use client';
import { useState, useEffect } from 'react';

export const useKardex = () => {
  const [historial, setHistorial] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKardex = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // 1. Intentamos la petición real
        const response = await fetch('https://sii.celaya.tecnm.mx/api/movil/estudiante/kardex', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Sesión expirada o error de servidor');

        const result = await response.json();
        const materiasReales = result.data?.kardex || [];

        if (materiasReales.length > 0) {
          // 2. Si hay datos, los agrupamos por periodo
          const grupos = materiasReales.reduce((acc: any, item: any) => {
            const p = item.periodo || 'Periodo Desconocido';
            if (!acc[p]) acc[p] = { periodo: p, materias: [] };
            acc[p].materias.push(item);
            return acc;
          }, {});
          setHistorial(Object.values(grupos));
        } else {
          throw new Error('No se encontraron materias en tu cuenta');
        }
      } catch (err: any) {
        console.error("Error en API:", err);
        setError(err.message);
        
        // 3. RESPALDO: Si falla, dejamos los de prueba para no romper el diseño
        setHistorial([{ 
          periodo: "MODO PRUEBA (Error de Conexión)", 
          materias: [{ nombre_materia: "REVISA TU CONEXIÓN O TOKEN", creditos: 0, calificacion: 0 }] 
        }]);
      } finally {
        setLoading(false);
      }
    };
    fetchKardex();
  }, []);

  return { historial, loading, error };
};