import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Base de datos temporal (se limpia al reiniciar el servidor)
let db_citas: any[] = []

export async function GET() {
  return NextResponse.json(db_citas)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { numero_control, especialidad, fecha, motivo } = body

    if (!numero_control || !especialidad || !fecha) {
      return NextResponse.json(
        { message: 'Faltan datos (Control, Especialidad o Fecha)' },
        { status: 400 }
      )
    }

    // REGLA: Solo una cita pendiente por tipo
    const yaTieneUna = db_citas.find(c => 
      c.numero_control === numero_control && 
      c.especialidad === especialidad && 
      c.status === 'Pendiente'
    )

    if (yaTieneUna) {
      return NextResponse.json(
        { message: `Ya tienes una solicitud de ${especialidad} en proceso.` },
        { status: 409 }
      )
    }

    const nuevaCita = {
      id: Date.now(),
      numero_control,
      especialidad,
      fecha,
      motivo,
      status: 'Pendiente',
      fecha_creacion: new Date().toISOString()
    }

    db_citas.push(nuevaCita)

    return NextResponse.json(
      { message: 'Cita tramitada con éxito', data: nuevaCita },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ message: 'Error interno' }, { status: 500 })
  }
}