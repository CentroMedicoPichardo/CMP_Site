// src/app/api/nosotros/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { nosotros } from "@/lib/schema/index";
import { eq } from "drizzle-orm";
import { withUserEmail, getUserEmailFromRequest } from "@/lib/db-with-user";

export async function GET() {
  try {
    const resultado = await db.select().from(nosotros).limit(1);

    if (resultado.length === 0) {
      return NextResponse.json({ error: "No se encontró información de la sección" }, { status: 404 });
    }

    return NextResponse.json(resultado[0]);
  } catch (error) {
    console.error("Error en API Nosotros:", error);
    return NextResponse.json(
      { error: "Error interno al obtener los datos" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const userEmail = getUserEmailFromRequest(request);

    console.log("========== PUT NOSOTROS ==========");
    console.log("📧 Email usuario:", userEmail);
    console.log("📦 Datos:", body);

    const existing = await db.select().from(nosotros).limit(1);

    const resultado = await withUserEmail(userEmail, async () => {
      if (existing.length === 0) {
        const nuevo = await db.insert(nosotros).values({
          mision: body.mision || "",
          vision: body.vision || "",
          valores: body.valores || [],
          nuestraHistoria: body.nuestraHistoria || "",
          compromiso: body.compromiso || "",
          urlImagen: body.urlImagen || "/pediatric-illustration.png"
        }).returning();
        
        console.log("🟢 POST - Nuevo registro creado:", nuevo[0]);
        return nuevo[0];
      }

      const actualizado = await db.update(nosotros)
        .set({
          mision: body.mision,
          vision: body.vision,
          valores: body.valores,
          nuestraHistoria: body.nuestraHistoria,
          compromiso: body.compromiso,
          urlImagen: body.urlImagen,
        })
        .where(eq(nosotros.id, existing[0].id))
        .returning();
      
      console.log("🟢 PUT - Registro actualizado:", actualizado[0]);
      return actualizado[0];
    });

    return NextResponse.json(resultado);
  } catch (error: any) {
    console.error("🔴 Error en PUT nosotros:", error);
    return NextResponse.json(
      { error: error.message || "Error interno al actualizar" },
      { status: 500 }
    );
  }
}