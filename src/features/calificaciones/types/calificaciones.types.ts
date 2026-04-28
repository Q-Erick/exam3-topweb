export interface Calificacion {
    id_calificacion: number
    numero_calificacion: number
    calificacion: string | null
}

export interface Materia {
    id_grupo: number
    nombre_materia: string
    clave_materia: string
    letra_grupo: string
}

export interface MateriaConCalificaciones {
    materia: Materia
    calificaiones: Calificacion[]
}

export interface Periodo {
    clave_periodo: string
    anio: number
    descripcion_periodo: string
}

export interface CalificacionesPeriodo {
    periodo: Periodo
    materias: MateriaConCalificaciones[]
}