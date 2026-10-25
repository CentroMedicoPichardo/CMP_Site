// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  usuariosInSeguridad,
  rolesInSeguridad,
  aceptacionesLegales,
} from "@/lib/schema/index";
import { eq } from "drizzle-orm";
import { otpMemoria, verificarOTP } from "@/lib/otpStore";
import {
  TIPOS_DOCUMENTO_LEGAL,
  obtenerDocumentosLegalesVigentes,
} from "@/lib/legal/documentos";

const ROL_POR_DEFECTO = 1; // ID del rol cliente

function normalizarTexto(valor: unknown, maxLength = 255) {
  if (typeof valor !== "string") {
    return "";
  }

  return valor.trim().slice(0, maxLength);
}

function normalizarCorreo(valor: unknown) {
  return normalizarTexto(valor, 150).toLowerCase();
}

function normalizarEdad(valor: unknown) {
  const edad = Number(valor);

  if (!Number.isInteger(edad) || edad <= 0 || edad > 120) {
    return null;
  }

  return edad;
}

function correoValido(correo: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function validarContrasena(contrasena: string) {
  if (!contrasena || contrasena.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }

  const passRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  if (!passRegex.test(contrasena)) {
    return "La contraseña es muy débil (faltan números o símbolos).";
  }

  const secuencias = ["123", "234", "345", "456", "789", "abc", "qwe"];

  if (secuencias.some((secuencia) => contrasena.toLowerCase().includes(secuencia))) {
    return "La contraseña contiene secuencias inseguras.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const codigoVerificacion = normalizarTexto(body.codigoVerificacion, 20);
    const nombre = normalizarTexto(body.nombre, 100);
    const apellidoPaterno = normalizarTexto(body.apellidoPaterno, 100);
    const apellidoMaterno = normalizarTexto(body.apellidoMaterno, 100) || null;
    const edad = normalizarEdad(body.edad);
    const sexo = normalizarTexto(body.sexo, 30);
    const telefono = normalizarTexto(body.telefono, 30);
    const correo = normalizarCorreo(body.correo);
    const contrasena =
      typeof body.contrasena === "string" ? body.contrasena : "";

    if (!correo || !codigoVerificacion) {
      return NextResponse.json(
        { message: "Faltan datos (correo o código de verificación)" },
        { status: 400 }
      );
    }

    if (!correoValido(correo)) {
      return NextResponse.json(
        { message: "El correo no tiene un formato válido" },
        { status: 400 }
      );
    }

    if (!nombre || !apellidoPaterno || !edad || !sexo || !telefono) {
      return NextResponse.json(
        {
          message:
            "Faltan campos obligatorios: nombre, apellidoPaterno, edad, sexo y telefono",
        },
        { status: 400 }
      );
    }

    const errorContrasena = validarContrasena(contrasena);

    if (errorContrasena) {
      return NextResponse.json(
        { message: errorContrasena },
        { status: 400 }
      );
    }

    // Nunca se registra a un usuario sin un Aviso de Privacidad y
    // unos Términos vigentes a los que referenciar su aceptación.
    // Se comprueba antes de verificar el OTP, que se consume al
    // validarse, para que el usuario no pierda su código.
    const documentosVigentes =
      await obtenerDocumentosLegalesVigentes();

    const documentosAceptables = TIPOS_DOCUMENTO_LEGAL.map(
      (tipo) =>
        documentosVigentes.find(
          (documento) => documento.tipo === tipo
        )
    );

    if (documentosAceptables.some((documento) => !documento)) {
      console.error(
        "Registro bloqueado: falta un documento legal vigente",
        TIPOS_DOCUMENTO_LEGAL.filter(
          (tipo) =>
            !documentosVigentes.some(
              (documento) => documento.tipo === tipo
            )
        )
      );

      return NextResponse.json(
        {
          message:
            "El registro no está disponible por el momento. Inténtalo más tarde.",
        },
        { status: 500 }
      );
    }

    const otpValidation = verificarOTP(correo, codigoVerificacion);

    if (!otpValidation.valido) {
      return NextResponse.json(
        { message: otpValidation.mensaje },
        { status: 400 }
      );
    }

    const usuariosEncontrados = await db
      .select({
        id: usuariosInSeguridad.id,
      })
      .from(usuariosInSeguridad)
      .where(eq(usuariosInSeguridad.correo, correo))
      .limit(1);

    if (usuariosEncontrados.length > 0) {
      return NextResponse.json(
        { message: "El correo ya está registrado en el sistema" },
        { status: 409 }
      );
    }

    const rolesEncontrados = await db
      .select({
        id: rolesInSeguridad.id,
      })
      .from(rolesInSeguridad)
      .where(eq(rolesInSeguridad.id, ROL_POR_DEFECTO))
      .limit(1);

    if (rolesEncontrados.length === 0) {
      return NextResponse.json(
        {
          message:
            'Error de configuración: El Rol "Cliente" (ID 1) no existe.',
        },
        { status: 500 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    // El usuario y su aceptación de los documentos vigentes se
    // guardan en la misma transacción: no queda una cuenta sin
    // constancia de la versión que aceptó.
    const usuarioCreado = await db.transaction(async (tx) => {
      const [creado] = await tx
        .insert(usuariosInSeguridad)
        .values({
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          edad,
          sexo,
          telefono,
          correo,
          contrasena: hashedPassword,
          rolId: ROL_POR_DEFECTO,
          activo: true,
        })
        .returning();

      if (!creado) {
        return undefined;
      }

      await tx.insert(aceptacionesLegales).values(
        documentosVigentes.map((documento) => ({
          usuarioId: creado.id,
          idDocumento: documento.idDocumento,
        }))
      );

      return creado;
    });

    if (!usuarioCreado) {
      return NextResponse.json(
        { message: "Error al crear el usuario" },
        { status: 500 }
      );
    }

    otpMemoria.delete(correo);

    const { contrasena: _, ...usuarioSinPass } = usuarioCreado;

    return NextResponse.json(
      {
        mensaje: "Usuario verificado y registrado exitosamente",
        usuario: usuarioSinPass,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}