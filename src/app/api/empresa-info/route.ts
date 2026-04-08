// src/app/api/empresa-info/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { empresaInfoInClinica } from '@/lib/schema/index';
import { withUserEmail, getUserEmailFromRequest } from '@/lib/db-with-user';
import { eq } from 'drizzle-orm';

// GET - Obtener información de la empresa
export async function GET() {
  try {
    // Obtener el primer registro (solo debe haber uno)
    const resultado = await db.select().from(empresaInfoInClinica).limit(1);

    if (resultado.length === 0) {
      // Si no hay datos, devolver un objeto vacío o error
      return NextResponse.json(
        { error: "No se encontró información de la empresa" },
        { status: 404 }
      );
    }

    return NextResponse.json(resultado[0]);
  } catch (error: any) {
    console.error("Error en GET empresa-info:", error);
    return NextResponse.json(
      { error: "Error al obtener información de la empresa", detalle: error.message },
      { status: 500 }
    );
  }
}

// PUT - Actualizar información de la empresa
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const userEmail = getUserEmailFromRequest(request);

    console.log("========== PUT EMPRESA INFO ==========");
    console.log("📧 Email usuario:", userEmail);
    console.log("📦 Datos:", body);

    // Validar campos requeridos
    if (!body.nombre || !body.direccion || !body.telefono || !body.correo || !body.horario) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: nombre, direccion, telefono, correo, horario" },
        { status: 400 }
      );
    }

    // Verificar si ya existe un registro
    const existing = await db.select().from(empresaInfoInClinica).limit(1);

    // Ejecutar la actualización o creación con contexto de auditoría
    const resultado = await withUserEmail(userEmail, async () => {
      if (existing.length === 0) {
        // Si no existe, crear uno nuevo
        const nuevo = await db.insert(empresaInfoInClinica).values({
          nombre: body.nombre,
          direccion: body.direccion,
          telefono: body.telefono,
          correo: body.correo,
          facebook: body.facebook || null,
          instagram: body.instagram || null,
          horario: body.horario,
          logoUrl: body.logoUrl || null,
          correoSoporte: body.correoSoporte || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }).returning();
        
        console.log("🟢 POST - Nuevo registro creado ID:", nuevo[0]?.id);
        return nuevo[0];
      }

      // Actualizar el existente
      const actualizado = await db.update(empresaInfoInClinica)
        .set({
          nombre: body.nombre,
          direccion: body.direccion,
          telefono: body.telefono,
          correo: body.correo,
          facebook: body.facebook || null,
          instagram: body.instagram || null,
          horario: body.horario,
          logoUrl: body.logoUrl || null,
          correoSoporte: body.correoSoporte || null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(empresaInfoInClinica.id, existing[0].id))
        .returning();
      
      console.log("🟢 PUT - Registro actualizado ID:", actualizado[0]?.id);
      return actualizado[0];
    });

    return NextResponse.json(resultado);
  } catch (error: any) {
    console.error("🔴 Error en PUT empresa-info:", error);
    return NextResponse.json(
      { error: error.message || "Error interno al actualizar" },
      { status: 500 }
    );
  }
}