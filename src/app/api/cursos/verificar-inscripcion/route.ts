// src/app/api/cursos/verificar-inscripcion/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursoId = searchParams.get('cursoId');
    
    if (!cursoId) {
      return NextResponse.json({ error: 'Curso ID requerido' }, { status: 400 });
    }
    
    // Obtener token del usuario
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ inscrito: false, error: 'No autorizado' }, { status: 200 });
    }
    
    // Verificar token
    const secret = process.env.JWT_SECRET!;
    let decoded: any;
    
    try {
      decoded = jwt.verify(token, secret);
    } catch (error) {
      return NextResponse.json({ inscrito: false, error: 'Sesión inválida' }, { status: 200 });
    }
    
    const usuarioId = decoded.userId;
    
    // Verificar si ya está inscrito
    const inscripcion = await db.execute(sql`
      SELECT id_inscripcion, estado
      FROM academia.inscripciones_cursos
      WHERE curso_id = ${parseInt(cursoId)}
      AND usuario_id = ${usuarioId}
      AND estado = 'activo'
    `);
    
    return NextResponse.json({ 
      inscrito: inscripcion.length > 0,
      inscripcionId: inscripcion[0]?.id_inscripcion || null
    });
    
  } catch (error) {
    console.error('Error verificando inscripción:', error);
    return NextResponse.json({ 
      inscrito: false, 
      error: 'Error al verificar inscripción' 
    }, { status: 500 });
  }
}