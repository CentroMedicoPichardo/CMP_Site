// src/app/api/cursos/nuevo/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { sendEmail } from '@/lib/email';
import { NuevoCursoEmail } from '@/lib/NuevoCursoEmail';

export async function POST(req: Request) {
  try {
    const { cursoId } = await req.json();

    // ✅ CORREGIDO: usar nombres reales de columnas
    const cursoResult = await db.execute(sql`
      SELECT titulo_curso, costo
      FROM academia.cursos
      WHERE id_curso = ${cursoId}
    `);

    const curso = cursoResult;

    if (!curso.length) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const c = curso[0];

    // Usuarios activos
    const usuarios = await db.execute(sql`
      SELECT correo FROM seguridad.usuarios WHERE activo = true
    `);

    for (const u of usuarios) {
      await sendEmail(
        String(u.correo),
        `✨ Nuevo curso disponible: ${c.titulo_curso}`,
        NuevoCursoEmail({
          titulo: String(c.titulo_curso),
          costo: String(c.costo ?? '0.00')
        })
      );
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('❌ ERROR NUEVO CURSO:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}