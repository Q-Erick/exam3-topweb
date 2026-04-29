'use client'
import { useState, useEffect } from 'react'
import { api } from '@/shared/lib/api'
import { ApiResponse } from '@/shared/types/api.types'

export function useHorario() {
    const [clases, setClases] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchHorario() {
            try {
                const response = await api.get<ApiResponse<any>>('/movil/estudiante/horarios')
                
                if (response.flag && response.data) {
                    
                    // --- EL TRUCO ESTÁ AQUÍ ---
                    // Buscamos dónde escondió la API la lista real de materias
                    let arregloMaterias = [];
                    
                    if (Array.isArray(response.data) && response.data.length > 0) {
                        // Si viene envuelto en un array: [{ horario: [...] }] (Como en Calificaciones)
                        arregloMaterias = response.data[0].horario || response.data;
                    } else if (response.data.horario) {
                        // Si viene directo en un objeto: { horario: [...] }
                        arregloMaterias = response.data.horario;
                    }

                    // Ahora sí procesamos la lista real
                    if (Array.isArray(arregloMaterias)) {
                        const materiasProcesadas = arregloMaterias.map((m: any, index: number) => {
                            const hInicio = parseInt(m.hora_inicio?.toString().split(':')[0]) || 8;
                            const hFinal = parseInt(m.hora_final?.toString().split(':')[0]) || (hInicio + 1);
                            const diaNum = parseInt(m.dia);

                            return {
                                id: `${m.materia?.clave_materia || index}-${m.dia}-${index}`, 
                                codigo: m.materia?.clave_materia || m.clave_materia || 'S/C',
                                nombre: m.materia?.nombre_materia || m.nombre_materia || 'Materia',
                                profesor: m.docente || m.nombre_empleado || 'Sin asignar',
                                salon: m.aula || 'S/N',
                                dia: isNaN(diaNum) ? 1 : diaNum, 
                                horaInicio: hInicio,
                                duracion: (hFinal - hInicio) > 0 ? (hFinal - hInicio) : 1,
                                color: ['blue', 'green', 'purple', 'orange', 'pink'][index % 5]
                            };
                        });
                        setClases(materiasProcesadas);
                    }
                }
            } catch (err) {
                console.error("Error en useHorario:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchHorario()
    }, [])

    return { clases, loading }
}