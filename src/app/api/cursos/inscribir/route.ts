import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('BODY:', body);

    const { cursoId, metodoPago, montoPagado } = body;

    const cursoIdNum = Number(cursoId);
    if (!cursoId || isNaN(cursoIdNum)) {
      return NextResponse.json({ error: 'Curso ID inválido' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
    }

    const usuarioId = decoded.userId;

    // ✅ Verificar usuario
    const usuario = await db.execute(sql`
      SELECT id, activo
      FROM seguridad.usuarios
      WHERE id = ${usuarioId}
    `);

    if (!usuario.length || usuario[0].activo === false) {
      return NextResponse.json({ error: 'Usuario no encontrado o inactivo' }, { status: 400 });
    }

    // 🚀 USAMOS TRANSACCIÓN CORRECTA
    return await db.transaction(async (tx) => {

      // ✅ Verificar inscripción existente (DENTRO de la transacción)
      const inscripcionExistente = await tx.execute(sql`
        SELECT id_inscripcion
        FROM academia.inscripciones_cursos
        WHERE curso_id = ${cursoIdNum}
        AND usuario_id = ${usuarioId}
      `);

      if (inscripcionExistente.length > 0) {
        return NextResponse.json(
          { error: 'Ya estás inscrito en este curso' },
          { status: 400 }
        );
      }

      // ✅ Obtener curso con lock
      const curso = await tx.execute(sql`
        SELECT 
          id_curso, 
          cupo_maximo, 
          cupos_ocupados, 
          activo, 
          fecha_inicio,
          costo
        FROM academia.cursos
        WHERE id_curso = ${cursoIdNum}
        FOR UPDATE
      `);

      if (!curso.length) {
        return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
      }

      const cupoMaximo = Number(curso[0].cupo_maximo ?? 0);
      const cuposOcupados = Number(curso[0].cupos_ocupados ?? 0);
      const cursoActivo = curso[0].activo === true;

      // ✅ Manejo seguro de fecha
      let fechaInicio: Date | null = null;
      const rawFecha = curso[0].fecha_inicio;

      if (rawFecha) {
        if (typeof rawFecha === 'string' || typeof rawFecha === 'number') {
          fechaInicio = new Date(rawFecha);
        } else if (rawFecha instanceof Date) {
          fechaInicio = rawFecha;
        }

        if (fechaInicio && isNaN(fechaInicio.getTime())) {
          fechaInicio = null;
        }
      }

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      // ✅ Manejo de costo
      let costo = '0.00';
      if (montoPagado) {
        costo = String(montoPagado);
      } else if (curso[0].costo) {
        costo = String(curso[0].costo);
      }

      // ✅ Validaciones
      if (!cursoActivo) {
        return NextResponse.json({ error: 'El curso no está disponible' }, { status: 400 });
      }

      if (fechaInicio && fechaInicio < hoy) {
        return NextResponse.json({ error: 'El curso ya comenzó' }, { status: 400 });
      }

      if (cupoMaximo > 0 && cuposOcupados >= cupoMaximo) {
        return NextResponse.json({ error: 'No hay cupos disponibles' }, { status: 400 });
      }

      try {
        // ✅ Insertar inscripción
        const nuevaInscripcion = await tx.execute(sql`
          INSERT INTO academia.inscripciones_cursos (
            curso_id,
            usuario_id,
            fecha_inscripcion,
            estado,
            monto_pagado,
            metodo_pago
          )
          VALUES (
            ${cursoIdNum},
            ${usuarioId},
            CURRENT_TIMESTAMP,
            'activo',
            ${costo}::numeric(10,2),
            ${metodoPago || 'pendiente'}
          )
          RETURNING id_inscripcion
        `);

        if (!nuevaInscripcion.length) {
          throw new Error('No se pudo crear la inscripción');
        }

        // ✅ Actualizar cupos
        if (cupoMaximo > 0) {
          await tx.execute(sql`
            UPDATE academia.cursos
            SET cupos_ocupados = COALESCE(cupos_ocupados, 0) + 1
            WHERE id_curso = ${cursoIdNum}
          `);
        }

        return NextResponse.json({
          success: true,
          message: 'Inscripción exitosa',
          inscripcionId: nuevaInscripcion[0].id_inscripcion
        });

      } catch (error: any) {
        console.error('ERROR DB:', error);

        // ✅ Manejo de UNIQUE
        if (
          error?.message?.includes('unique_inscripcion_curso_usuario') ||
          error?.message?.includes('duplicate key')
        ) {
          return NextResponse.json(
            { error: 'Ya estás inscrito en este curso' },
            { status: 400 }
          );
        }

        return NextResponse.json(
          {
            error: 'Error en la base de datos',
            details: error.message
          },
          { status: 500 }
        );
      }
    });

  } catch (error: any) {
    console.error('ERROR GENERAL:', error);

    return NextResponse.json(
      {
        error: 'Error al procesar la inscripción',
        details: error.message || 'Error desconocido'
      },
      { status: 500 }
    );
  }
}