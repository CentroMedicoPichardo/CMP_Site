import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { sendEmail } from '@/lib/email';
import { PromocionCursoEmail } from '@/lib/PromocionCursoEmail';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cursoId = Number(body.cursoId);

    if (!cursoId || isNaN(cursoId)) {
      return NextResponse.json(
        { error: 'Curso ID inválido' },
        { status: 400 }
      );
    }

    // ✅ CORREGIDO nombres de columnas
    const cursoResult = await db.execute(sql`
      SELECT titulo_curso, cupo_maximo, cupos_ocupados, costo
      FROM academia.cursos
      WHERE id_curso = ${cursoId}
    `);

    if (!cursoResult.length) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    const curso = cursoResult[0];

    const titulo = String(curso.titulo_curso);
    const cupoMaximo = Number(curso.cupo_maximo ?? 0);
    const cuposOcupados = Number(curso.cupos_ocupados ?? 0);
    const costo = String(curso.costo ?? '0.00');

    const disponibles = Math.max(cupoMaximo - cuposOcupados, 0);

    const usuarios = await db.execute(sql`
      SELECT correo
      FROM seguridad.usuarios
      WHERE activo = true
        AND correo IS NOT NULL
    `);

    let enviados = 0;
    let fallidos = 0;

    for (const u of usuarios) {
      const email = String(u.correo);

      const html = PromocionCursoEmail({
        titulo,
        lugaresDisponibles: disponibles,
        costo
      });

      const result = await sendEmail(
        email,
        `🎓 ${titulo}`,
        html
      );

      result.success ? enviados++ : fallidos++;
    }

    return NextResponse.json({
      success: true,
      enviados,
      fallidos,
      total: usuarios.length
    });

  } catch (error: any) {
    console.error('❌ ERROR PROMOCIÓN:', error);

    return NextResponse.json(
      {
        error: 'Error al enviar promoción',
        details: error.message
      },
      { status: 500 }
    );
  }
}