export interface Estudiante {
    numero_control: string;
    persona: string;
    email: string;
    semestre: number;
    promedio_ponderado: string;
    promedio_aritmetico: string;
    creditos_acumulados: string;
    materias_cursadas: string;
    materias_aprobadas: string;
    materias_reprobadas: string;
    porcentaje_avance: number;
    percentaje_avance_cursando: number;
    foto: string;
    creditos_complementarios?: number;
    num_mat_rep_no_acreditadas?: string;
}