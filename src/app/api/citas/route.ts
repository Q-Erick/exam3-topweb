import { NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabase'; // Asegúrate de que esta ruta apunte a tu cliente de Supabase

// LEER CITAS (GET)
export async function GET(request: Request) {
  try {
    // Obtenemos la URL y sacamos el parametro 'numero_control'
    const { searchParams } = new URL(request.url);
    const numero_control = searchParams.get('numero_control');

    let query = supabase.from('citas').select('*').order('created_at', { ascending: false });

    // Si nos mandan un numero_control, filtramos. Si no, devuelve todas (útil para el Admin luego)
    if (numero_control) {
      query = query.eq('numero_control', numero_control);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// CREAR CITA (POST)
// CREAR CITA (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // --- 🛡️ NUEVO CANDADO BACKEND 🛡️ ---
    // Buscamos si ya existe una cita pendiente para este alumno y esta especialidad
    const { data: existentes, error: checkError } = await supabase
      .from('citas')
      .select('id')
      .eq('numero_control', body.numero_control)
      .eq('especialidad', body.especialidad)
      .eq('status', 'Pendiente')
      .limit(1);

    if (checkError) {
      return NextResponse.json({ error: 'Error al verificar citas existentes' }, { status: 500 });
    }

    if (existentes && existentes.length > 0) {
      return NextResponse.json(
        { error: `Ya tienes una solicitud de ${body.especialidad} pendiente.` }, 
        { status: 400 }
      );
    }
    // ------------------------------------

    // Si pasa el filtro, la insertamos normalmente
    const { data, error } = await supabase
      .from('citas')
      .insert([body]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
  }
}

// ELIMINAR CITA (DELETE)
export async function DELETE(request: Request) {
  try {
    // Sacamos el ID de la cita que viene por la URL (?id=...)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Falta el ID de la cita' }, { status: 400 });
    }

    const { error } = await supabase
      .from('citas')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al intentar eliminar' }, { status: 500 });
  }
}