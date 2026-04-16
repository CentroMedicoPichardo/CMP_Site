// src/app/api/dashboard-admin/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    console.log('=== API DASHBOARD ADMIN ===');
    
    // 1. Estadísticas de usuarios
    const totalUsuarios = await db.execute(sql`
      SELECT COUNT(*) as total FROM seguridad.usuarios WHERE activo = true
    `);

    const usuariosNuevosMes = await db.execute(sql`
      SELECT COUNT(*) as total FROM seguridad.usuarios 
      WHERE activo = true
    `);

    // 2. Estadísticas de cursos
    const totalCursos = await db.execute(sql`
      SELECT COUNT(*) as total FROM academia.cursos
    `);

    const cursosActivos = await db.execute(sql`
      SELECT COUNT(*) as total FROM academia.cursos WHERE activo = true
    `);

    // 3. Estadísticas de inscripciones
    const totalInscripciones = await db.execute(sql`
      SELECT COUNT(*) as total FROM academia.inscripciones_cursos WHERE estado = 'activo'
    `);

    const ingresosTotales = await db.execute(sql`
      SELECT COALESCE(SUM(monto_pagado::numeric), 0) as total FROM academia.inscripciones_cursos
    `);

    const tasaOcupacion = await db.execute(sql`
      SELECT COALESCE(AVG(cupos_ocupados::float / NULLIF(cupo_maximo, 0) * 100), 0) as promedio
      FROM academia.cursos
      WHERE activo = true
    `);

    // 4. Cursos recientes
    const cursosRecientes = await db.execute(sql`
      SELECT 
        c.id_curso, 
        c.titulo_curso, 
        c.cupos_ocupados, 
        c.cupo_maximo, 
        c.fecha_inicio, 
        c.activo
      FROM academia.cursos c
      ORDER BY c.id_curso DESC
      LIMIT 5
    `);

    // 5. Usuarios recientes - USANDO COMILLAS DOBLES
    const usuariosRecientes = await db.execute(sql`
      SELECT 
        u.id, 
        u.nombre, 
        u."apellidoPaterno", 
        u.correo, 
        r.nombre as rol
      FROM seguridad.usuarios u
      LEFT JOIN seguridad.roles r ON u.rol_id = r.id
      WHERE u.activo = true
      ORDER BY u.id DESC
      LIMIT 5
    `);

    // 6. Inscripciones recientes - TAMBIÉN CON COMILLAS DOBLES
    const inscripcionesRecientes = await db.execute(sql`
      SELECT 
        i.id_inscripcion,
        c.titulo_curso as curso,
        CONCAT(u.nombre, ' ', u."apellidoPaterno") as usuario,
        i.fecha_inscripcion as fecha,
        i.estado
      FROM academia.inscripciones_cursos i
      JOIN academia.cursos c ON i.curso_id = c.id_curso
      JOIN seguridad.usuarios u ON i.usuario_id = u.id
      ORDER BY i.id_inscripcion DESC
      LIMIT 5
    `);

    const responseData = {
      stats: {
        totalUsuarios: Number(totalUsuarios[0]?.total) || 0,
        totalCursos: Number(totalCursos[0]?.total) || 0,
        totalInscripciones: Number(totalInscripciones[0]?.total) || 0,
        ingresosTotales: Number(ingresosTotales[0]?.total) || 0,
        cursosActivos: Number(cursosActivos[0]?.total) || 0,
        usuariosNuevosMes: Number(usuariosNuevosMes[0]?.total) || 0,
        tasaOcupacion: Math.round(Number(tasaOcupacion[0]?.promedio) || 0)
      },
      cursosRecientes: cursosRecientes.map(c => ({
        idCurso: c.id_curso,
        tituloCurso: c.titulo_curso,
        cuposOcupados: c.cupos_ocupados || 0,
        cupoMaximo: c.cupo_maximo || 0,
        fechaInicio: c.fecha_inicio,
        activo: c.activo
      })),
      usuariosActivos: usuariosRecientes.map(u => ({
        id: u.id,
        nombre: u.nombre,
        apellidoPaterno: u.apellidoPaterno,
        correo: u.correo,
        rol: u.rol || 'cliente'
      })),
      inscripcionesRecientes: inscripcionesRecientes.map(i => ({
        id: i.id_inscripcion,
        curso: i.curso,
        usuario: i.usuario,
        fecha: i.fecha,
        estado: i.estado
      }))
    };

    console.log('Dashboard data loaded successfully');
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Error en dashboard API:', error);
    
    // Datos de ejemplo por si falla la API
    return NextResponse.json({
      stats: {
        totalUsuarios: 0,
        totalCursos: 0,
        totalInscripciones: 0,
        ingresosTotales: 0,
        cursosActivos: 0,
        usuariosNuevosMes: 0,
        tasaOcupacion: 0
      },
      cursosRecientes: [],
      usuariosActivos: [],
      inscripcionesRecientes: []
    });
  }
}