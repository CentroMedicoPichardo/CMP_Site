// src/app/api/auth/verify-email/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usuarios } from "@/lib/schema/index";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Estos Map deben ser los mismos que en register
const verificationCodes = new Map<string, { codigo: string; expira: Date; intentos: number }>();
const tempUsers = new Map<string, any>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, codigo } = body;

    if (!email || !codigo) {
      return NextResponse.json(
        { error: "Email y código son requeridos" },
        { status: 400 }
      );
    }

    // Obtener código guardado
    const storedCode = verificationCodes.get(email);
    const userData = tempUsers.get(email);

    if (!storedCode || !userData) {
      return NextResponse.json(
        { error: "Código no encontrado o expirado. Solicita un nuevo código" },
        { status: 404 }
      );
    }

    // Verificar expiración del código
    if (new Date() > storedCode.expira) {
      verificationCodes.delete(email);
      tempUsers.delete(email);
      return NextResponse.json(
        { error: "Código expirado. Solicita un nuevo código" },
        { status: 410 }
      );
    }

    // Verificar expiración de datos del usuario
    if (new Date() > userData.expira) {
      verificationCodes.delete(email);
      tempUsers.delete(email);
      return NextResponse.json(
        { error: "Tiempo de registro expirado. Debes iniciar el registro nuevamente" },
        { status: 410 }
      );
    }

    // Verificar intentos (máximo 5)
    if (storedCode.intentos >= 5) {
      verificationCodes.delete(email);
      tempUsers.delete(email);
      return NextResponse.json(
        { error: "Demasiados intentos. Solicita un nuevo código" },
        { status: 429 }
      );
    }

    // Verificar código
    if (storedCode.codigo !== codigo) {
      storedCode.intentos++;
      verificationCodes.set(email, storedCode);
      return NextResponse.json(
        { error: `Código incorrecto. Te quedan ${5 - storedCode.intentos} intentos` },
        { status: 401 }
      );
    }

    // Código correcto - crear usuario
    const hashedPassword = await bcrypt.hash(userData.contrasena, 10);

    // Crear usuario (rol por defecto cliente = 2)
    const newUser = await db.insert(usuarios).values({
      nombre: userData.nombre,
      apellidoPaterno: userData.apellidoPaterno,
      apellidoMaterno: userData.apellidoMaterno || null,
      edad: parseInt(userData.edad),
      sexo: userData.sexo,
      telefono: userData.telefono,
      correo: email,
      contrasena: hashedPassword,
      rolId: 2, // ID del rol cliente
      activo: true
    }).returning();

    // Limpiar datos temporales
    verificationCodes.delete(email);
    tempUsers.delete(email);

    return NextResponse.json({
      success: true,
      message: "Cuenta verificada exitosamente",
      usuario: {
        id: newUser[0].id,
        nombre: newUser[0].nombre,
        correo: newUser[0].correo
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error verificando email:", error);
    return NextResponse.json(
      { error: error.message || "Error al verificar email" },
      { status: 500 }
    );
  }
}