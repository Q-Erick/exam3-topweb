export interface KardexMateria {
    nombre_materia: string
    clave_materia: string
    periodo: string
    creditos: string
    calificacion: string
    descripcion: string
    semestre: number
}

export interface KardexData {
    porcentaje_avance: number
    kardex: KardexMateria[]
}

export interface SemestreAgrupado {
    semestre: number
    periodo: string
    materias: KardexMateria[]
    promedio: string
    creditos: number
}