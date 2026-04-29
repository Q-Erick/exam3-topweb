import { NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabase';

async function validarTokenSITEC(token: string) {
    try {
        const response = await fetch('https://sii.celaya.tecnm.mx/api/movil/estudiante', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return null;
        const json = await response.json();
        return json.data || null; 
    } catch {
        return null;
    }
}

// --- LEER CITAS (GET) ---
export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');
        if (!token) return NextResponse.json({ error: 'Token requerido' }, { status: 401 });

        const usuario = await validarTokenSITEC(token);
        if (!usuario) return NextResponse.json({ error: 'Sesión expirada' }, { status: 401 });

        const ncReal = usuario.numero_control;
        const isAdmin = usuario.email === 'l22030574@celaya.tecnm.mx';

        const { searchParams } = new URL(request.url);
        const ncParam = searchParams.get('numero_control');

        let query = supabase.from('citas').select('*').order('created_at', { ascending: false });

        // 🛡️ REGLA DE ORO: Validar que el token coincida con el pedido
        if (ncParam === 'admin') {
            if (!isAdmin) {
                return NextResponse.json({ error: 'No autorizado como admin' }, { status: 403 });
            }
            // Admin ve todo (no aplicamos eq)
        } else if (ncParam) {
            // Si NO eres admin y pides un número que no es el tuyo -> ERROR
            if (!isAdmin && ncParam !== ncReal) {
                return NextResponse.json({ 
                    error: 'Error de identidad: Las credenciales del token no coinciden con el número solicitado.' 
                }, { status: 403 });
            }
            query = query.eq('numero_control', ncParam);
        } else {
            query = query.eq('numero_control', ncReal);
        }

        const { data, error } = await query;
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

// --- CREAR CITA (POST) ---
export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');
        const usuario = await validarTokenSITEC(token || '');
        if (!usuario) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

        const body = await request.json();
        const ncReal = usuario.numero_control;
        const isAdmin = usuario.email === 'l22030574@celaya.tecnm.mx';

        // 🛡️ VALIDACIÓN DE INSERT: No puedes insertar con un NC ajeno
        // A menos que seas admin, pero por lógica de negocio, 
        // incluso el admin debería insertar con su NC real si está en su perfil personal.
        if (body.numero_control !== ncReal && !isAdmin) {
            return NextResponse.json({ error: 'No puedes agendar citas para otro número de control.' }, { status: 403 });
        }

        const { data, error } = await supabase.from('citas').insert([{ 
            ...body, 
            numero_control: body.numero_control || ncReal, // Usamos el del body si es admin, si no el real
            nombre_estudiante: usuario.persona,
            status: 'Pendiente'
        }]);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true, data }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Error al procesar' }, { status: 500 });
    }
}

// --- ELIMINAR CITA (DELETE) ---
export async function DELETE(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');
        const usuario = await validarTokenSITEC(token || '');
        if (!usuario) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const isAdmin = usuario.email === 'l22030574@celaya.tecnm.mx';

        let query = supabase.from('citas').delete().eq('id', id);
        
        // 🛡️ Si no eres admin, solo puedes borrar si la cita te pertenece
        if (!isAdmin) {
            query = query.eq('numero_control', usuario.numero_control);
        }

        const { error } = await query;
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
    }
}