import { type ClassValue, clsx } from 'clsx'

// Combinar clases de Tailwind
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}

// Color según calificación
export function getGradeColor(grade: string | null): string {
    if (!grade) return 'text-gray-400'
    const num = parseFloat(grade)
    if (num >= 90) return 'text-green-500'
    if (num >= 70) return 'text-yellow-500'
    return 'text-red-500'
}

export function getGradeBg(grade: string | null): string {
    if (!grade) return 'bg-gray-100 text-gray-400'
    const num = parseFloat(grade)
    if (num >= 90) return 'bg-green-100 text-green-700'
    if (num >= 70) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
}

// Iniciales del nombre
// Iniciales del nombre
export function getInitials(name: string | null | undefined): string {
    // Si el nombre no existe, devolvemos un string vacío o un placeholder
    if (!name || typeof name !== 'string') return '??'

    return name
        .trim() // Eliminamos espacios extra al inicio o final
        .split(/\s+/) // Dividimos por cualquier espacio en blanco
        .filter(Boolean) // Eliminamos entradas vacías si hay doble espacio
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
}

// Promedio de calificaciones de una materia
export function calcularPromedio(calificaciones: (string | null)[]): string {
    const validas = calificaciones
        .filter((c) => c !== null)
        .map((c) => parseFloat(c!))

    if (validas.length === 0) return '--'
    const promedio = validas.reduce((a, b) => a + b, 0) / validas.length
    return promedio.toFixed(1)
}