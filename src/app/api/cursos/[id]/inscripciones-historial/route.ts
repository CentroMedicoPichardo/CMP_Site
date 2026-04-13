// src/app/api/cursos/[id]/inscripciones-historial/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { inscripcionesCursos } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cursoId = parseInt(params.id);
    
    console.log('=== DEBUG INSCRIPCIONES ===');
    console.log('Curso ID:', cursoId);
    
    if (isNaN(cursoId)) {
      return NextResponse.json({ success: false, error: 'ID inválido' }, { status: 400 });
    }
    
    // Primero, verificar si hay inscripciones para este curso
    const todasInscripciones = await db
      .select()
      .from(inscripcionesCursos)
      .where(eq(inscripcionesCursos.cursoId, cursoId));
    
    console.log('Todas las inscripciones encontradas:', todasInscripciones.length);
    console.log('Muestra de datos:', JSON.stringify(todasInscripciones.slice(0, 3), null, 2));
    
    if (todasInscripciones.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }
    
    // Obtener inscripciones agrupadas por fecha usando SQL directo para más compatibilidad
    const inscripcionesAgrupadas = await db.execute(sql`
      SELECT 
        DATE(fecha_inscripcion) as fecha,
        COUNT(*) as inscripciones_dia
      FROM academia.inscripciones_cursos
      WHERE curso_id = ${cursoId}
      GROUP BY DATE(fecha_inscripcion)
      ORDER BY fecha ASC
    `);
    
    console.log('Inscripciones agrupadas:', inscripcionesAgrupadas.length);
    
    if (!inscripcionesAgrupadas.length) {
      return NextResponse.json({ success: true, data: [] });
    }
    
    // Calcular acumulados
    let acumulado = 0;
    const dataConAcumulados = inscripcionesAgrupadas.map((row: any) => {
      const inscripcionesDia = Number(row.inscripciones_dia);
      acumulado += inscripcionesDia;
      return {
        fecha: row.fecha,
        inscripciones: inscripcionesDia,
        acumuladas: acumulado
      };
    });
    
    console.log('Datos procesados:', dataConAcumulados);
    
    return NextResponse.json({ success: true, data: dataConAcumulados });
    
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}