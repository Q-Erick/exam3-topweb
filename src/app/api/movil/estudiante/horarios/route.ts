import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')

  const response = await fetch('https://sii.celaya.tecnm.mx/api/movil/estudiante/horarios', {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
    },
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}