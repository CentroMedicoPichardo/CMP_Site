// src/app/api/monitoreo/auditoria/export/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auditoriaAccionesInSeguridad } from "@/lib/schema/index";
import { and, desc, eq, gte, lte, sql, SQL } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";

const CAMPOS_PERMITIDOS = [
  "fecha_hora",
  "usuario",
  "ip_address",
  "accion",
  "tabla_afectada",
  "registro_id",
  "datos_anteriores",
  "datos_nuevos",
] as const;

type CampoPermitido = (typeof CAMPOS_PERMITIDOS)[number];

const headerMap: Record<CampoPermitido, string> = {
  fecha_hora: "Fecha y Hora",
  usuario: "Usuario",
  ip_address: "Dirección IP",
  accion: "Acción",
  tabla_afectada: "Tabla Afectada",
  registro_id: "ID del Registro",
  datos_anteriores: "Datos Anteriores",
  datos_nuevos: "Datos Nuevos",
};

function esCampoPermitido(campo: string): campo is CampoPermitido {
  return CAMPOS_PERMITIDOS.includes(campo as CampoPermitido);
}

function normalizarTexto(valor: string | null, maxLength = 100) {
  if (!valor) return null;

  const texto = valor.trim();

  if (!texto) return null;

  return texto.slice(0, maxLength);
}

function fechaValida(valor: string | null) {
  if (!valor) return null;

  const fecha = valor.trim();

  if (!fecha) return null;

  const parsed = new Date(fecha);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return fecha;
}

function escaparCSV(valor: unknown, campo: CampoPermitido) {
  if (valor === null || valor === undefined) {
    return "";
  }

  let valorFinal = valor;

  if (campo === "fecha_hora" && valorFinal) {
    const fecha = new Date(String(valorFinal));

    if (!Number.isNaN(fecha.getTime())) {
      valorFinal = fecha.toLocaleString("es-MX");
    }
  }

  if (
    (campo === "datos_anteriores" || campo === "datos_nuevos") &&
    typeof valorFinal === "object"
  ) {
    valorFinal = JSON.stringify(valorFinal);
  }

  let texto = String(valorFinal);

  texto = texto.replace(/"/g, '""');

  if (
    texto.includes(",") ||
    texto.includes('"') ||
    texto.includes("\n") ||
    texto.includes("\r")
  ) {
    texto = `"${texto}"`;
  }

  return texto;
}

function crearNombreArchivo() {
  const fecha = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `auditoria_${fecha}.csv`;
}

export async function GET(request: Request) {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const { searchParams } = new URL(request.url);

    const fieldsRaw =
      searchParams
        .get("fields")
        ?.split(",")
        .map((campo) => campo.trim())
        .filter(Boolean) || [];

    if (!fieldsRaw.length) {
      return NextResponse.json(
        { error: "No se seleccionaron campos" },
        { status: 400 }
      );
    }

    const camposInvalidos = fieldsRaw.filter(
      (campo) => !esCampoPermitido(campo)
    );

    if (camposInvalidos.length > 0) {
      return NextResponse.json(
        { error: "Uno o más campos no son válidos" },
        { status: 400 }
      );
    }

    const fields = Array.from(new Set(fieldsRaw)) as CampoPermitido[];

    const tabla = normalizarTexto(searchParams.get("tabla"));
    const accion = normalizarTexto(searchParams.get("accion"));
    const fechaInicio = fechaValida(searchParams.get("fecha_inicio"));
    const fechaFin = fechaValida(searchParams.get("fecha_fin"));

    const filters: SQL[] = [];

    if (tabla) {
      filters.push(eq(auditoriaAccionesInSeguridad.tablaAfectada, tabla));
    }

    if (accion) {
      filters.push(eq(auditoriaAccionesInSeguridad.accion, accion));
    }

    if (fechaInicio) {
      filters.push(
        gte(
          auditoriaAccionesInSeguridad.fechaHora,
          sql`${fechaInicio}::timestamp`
        )
      );
    }

    if (fechaFin) {
      filters.push(
        lte(
          auditoriaAccionesInSeguridad.fechaHora,
          sql`${fechaFin}::timestamp`
        )
      );
    }

    const whereCondition = filters.length ? and(...filters) : undefined;

    const rows = await db
      .select({
        fecha_hora: auditoriaAccionesInSeguridad.fechaHora,
        usuario: auditoriaAccionesInSeguridad.usuario,
        ip_address: auditoriaAccionesInSeguridad.ipAddress,
        accion: auditoriaAccionesInSeguridad.accion,
        tabla_afectada: auditoriaAccionesInSeguridad.tablaAfectada,
        registro_id: auditoriaAccionesInSeguridad.registroId,
        datos_anteriores: auditoriaAccionesInSeguridad.datosAnteriores,
        datos_nuevos: auditoriaAccionesInSeguridad.datosNuevos,
      })
      .from(auditoriaAccionesInSeguridad)
      .where(whereCondition)
      .orderBy(desc(auditoriaAccionesInSeguridad.fechaHora))
      .limit(10000);

    if (!rows.length) {
      return NextResponse.json(
        { error: "No hay datos para exportar" },
        { status: 404 }
      );
    }

    const headers = fields.map((field) => headerMap[field]);

    const csvRows = rows.map((row) => {
      return fields
        .map((field) => escaparCSV(row[field], field))
        .join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const csvWithBom = `\uFEFF${csvContent}`;

    return new NextResponse(csvWithBom, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${crearNombreArchivo()}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error exportando auditoría:", error);

    return NextResponse.json(
      { error: "Error al exportar datos" },
      { status: 500 }
    );
  }
}