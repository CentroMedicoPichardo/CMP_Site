
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { auditoriaAcciones, usuarios } from "@/lib/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ACCION_BAJA_LOGICA = "ARCO_BAJA_LOGICA";
const ACCION_ANONIMIZACION = "ARCO_ANONIMIZACION_FINAL";
const TABLA_USUARIOS = "seguridad.usuarios";
const USUARIO_JOB = "sistema:job-anonimizacion";

// Mismo lock que protege la fila de usuario en los
// endpoints ARCO (DELETE /api/account, web-request y
// desactivar).
const LOCK_ARCO = 170017;

type Modo = "simular" | "ejecutar";

function responder(datos: unknown, status = 200) {
  return NextResponse.json(datos, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

// Comparación en tiempo constante: se comparan los
// SHA-256 (longitud fija), no los textos originales.
function secretoValido(
  request: Request,
  secreto: string,
): boolean {
  const autorizacion =
    request.headers.get("authorization") ?? "";

  const coincidencia = /^Bearer (.+)$/.exec(autorizacion);

  if (!coincidencia) {
    return false;
  }

  const recibido = createHash("sha256")
    .update(coincidencia[1])
    .digest();

  const esperado = createHash("sha256")
    .update(secreto)
    .digest();

  return timingSafeEqual(recibido, esperado);
}

// Baja lógica registrada (la más reciente) hace al
// menos 18 meses. Sin fila de auditoría el resultado
// es NULL y la cuenta no es elegible.
const bajaLogicaCumplioRetencion = sql`
  (
    SELECT max(${auditoriaAcciones.fechaHora})
    FROM ${auditoriaAcciones}
    WHERE ${auditoriaAcciones.accion} = ${ACCION_BAJA_LOGICA}
      AND ${auditoriaAcciones.tablaAfectada} = ${TABLA_USUARIOS}
      AND ${auditoriaAcciones.registroId} = ${usuarios.id}
  ) <= (CURRENT_TIMESTAMP - interval '18 months')
`;

// Cuenta desactivada, aún sin anonimizar y con la
// retención cumplida.
function condicionElegible() {
  return and(
    eq(usuarios.activo, false),
    isNull(usuarios.fechaAnonimizacion),
    bajaLogicaCumplioRetencion,
  );
}

// Anonimiza una cuenta en su propia transacción.
// Devuelve false si dejó de ser elegible (por ejemplo,
// otra ejecución ya la procesó).
async function anonimizarCuenta(
  usuarioId: number,
  contrasenaHash: string,
): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`
      SELECT pg_advisory_xact_lock(
        ${LOCK_ARCO},
        ${usuarioId}
      )
    `);

    // Se bloquea la fila y se vuelve a evaluar la
    // elegibilidad ya con el lock.
    const [vigente] = await tx
      .select({ id: usuarios.id })
      .from(usuarios)
      .where(
        and(
          eq(usuarios.id, usuarioId),
          condicionElegible(),
        ),
      )
      .limit(1)
      .for("update");

    if (!vigente) {
      return false;
    }

    const [actualizado] = await tx
      .update(usuarios)
      .set({
        nombre: "Usuario eliminado",
        apellidoPaterno: "-",
        apellidoMaterno: null,
        edad: 0,
        sexo: "-",
        telefono: "-",
        correo: `eliminado-${usuarioId}@anonimizado.local`,
        contrasena: contrasenaHash,
        resetToken: null,
        resetTokenExpiry: null,
        intentosFallidos: 0,
        bloqueadoHasta: null,
        secretoMfa: null,
        mfaHabilitado: false,
        versionToken: sql`
          COALESCE(${usuarios.versionToken}, 1) + 1
        `,
        fechaAnonimizacion: sql`now()`,
      })
      .where(
        and(
          eq(usuarios.id, usuarioId),
          condicionElegible(),
        ),
      )
      .returning({
        fechaAnonimizacion: usuarios.fechaAnonimizacion,
      });

    if (!actualizado) {
      return false;
    }

    // Sin nombre, correo ni otros datos personales.
    await tx.insert(auditoriaAcciones).values({
      usuario: USUARIO_JOB,
      accion: ACCION_ANONIMIZACION,
      tablaAfectada: TABLA_USUARIOS,
      registroId: usuarioId,
      aplicacionOrigen: "CMP_Site",
      datosAnteriores: {
        activo: false,
        anonimizado: false,
      },
      datosNuevos: {
        activo: false,
        anonimizado: true,
        fechaAnonimizacion: actualizado.fechaAnonimizacion,
      },
    });

    return true;
  });
}

/**
 * B-6.3 - Anonimización final de cuentas con baja lógica.
 *
 * POST /api/sistema/jobs/anonimizar-cuentas
 *
 * Lo invoca un workflow programado, sin sesión de usuario:
 * se autoriza con Authorization: Bearer
 * ARCO_ANONIMIZACION_JOB_SECRET.
 *
 * modo=simular: solo consulta y devuelve las cuentas
 * elegibles (IDs, sin datos personales).
 *
 * modo=ejecutar: requiere ARCO_ANONIMIZACION_HABILITADA=true.
 * Cada cuenta se procesa en su propia transacción.
 */
export async function POST(request: Request) {
  const secreto =
    process.env.ARCO_ANONIMIZACION_JOB_SECRET?.trim();

  // Sin secreto configurado el endpoint queda cerrado.
  if (!secreto) {
    console.error(
      "ARCO_ANONIMIZACION_JOB_SECRET no está configurado",
    );

    return responder(
      {
        message:
          "El job no está configurado correctamente.",
      },
      500,
    );
  }

  if (!secretoValido(request, secreto)) {
    return responder({ message: "No autorizado" }, 401);
  }

  const payload: unknown =
    await request.json().catch(() => null);

  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    return responder(
      { message: "Cuerpo JSON inválido." },
      400,
    );
  }

  const { modo } = payload as Record<string, unknown>;

  if (modo !== "simular" && modo !== "ejecutar") {
    return responder(
      {
        message:
          "El modo debe ser simular o ejecutar.",
      },
      400,
    );
  }

  const modoSolicitado: Modo = modo;

  // La ejecución permanece deshabilitada salvo
  // configuración explícita del servidor.
  const ejecucionHabilitada =
    process.env.ARCO_ANONIMIZACION_HABILITADA === "true";

  if (modoSolicitado === "ejecutar" && !ejecucionHabilitada) {
    return responder(
      {
        message:
          "La anonimización real está deshabilitada en el servidor.",
        modo: modoSolicitado,
        ejecucionHabilitada: false,
        procesadas: 0,
        anonimizadas: 0,
      },
      423,
    );
  }

  try {
    const elegibles = await db
      .select({ id: usuarios.id })
      .from(usuarios)
      .where(condicionElegible())
      .orderBy(asc(usuarios.id));

    if (modoSolicitado === "simular") {
      return responder({
        modo: modoSolicitado,
        ejecucionHabilitada,
        procesadas: 0,
        anonimizadas: 0,
        elegibles: elegibles.length,
        ids: elegibles.map((fila) => fila.id),
      });
    }

    let anonimizadas = 0;

    for (const { id } of elegibles) {
      try {
        // Hash de un valor aleatorio e inservible; se
        // calcula fuera de la transacción.
        const contrasenaHash = await bcrypt.hash(
          randomBytes(32).toString("hex"),
          12,
        );

        if (await anonimizarCuenta(id, contrasenaHash)) {
          anonimizadas++;
        }
      } catch (errorCuenta) {
        // Una cuenta con error no detiene las demás;
        // su transacción ya se revirtió.
        console.error(
          `Error al anonimizar la cuenta ${id}:`,
          errorCuenta,
        );
      }
    }

    return responder({
      modo: modoSolicitado,
      ejecucionHabilitada,
      procesadas: elegibles.length,
      anonimizadas,
    });
  } catch (error) {
    console.error(
      "Error en el job de anonimización:",
      error,
    );

    return responder(
      {
        message:
          "No fue posible ejecutar la anonimización.",
      },
      500,
    );
  }
}
