import { NextRequest, NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SolicitudPrediccionPrecio {
  categoriaId?: number | string | null;
  modalidadId?: number | string | null;
  ubicacionId?: number | string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  cupoMaximo?: number | string | null;
}

interface RespuestaFuncionPython {
  ok?: boolean;
  precioSugerido?: number;
  precioMinimoEstimado?: number;
  precioMaximoEstimado?: number;
  margenOrientativo?: number;
  modelo?: string;
  algoritmo?: string;
  version?: string;
  variablesEntrada?: Record<string, unknown>;
  aviso?: string;
  message?: string;
}

interface DetalleRespuestaPython {
  intento: number;
  url: string;
  status?: number;
  statusText?: string;
  contentType?: string | null;
  contenido?: string;
}

class ErrorValidacion extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ErrorValidacion";
  }
}

class ErrorFuncionPython extends Error {
  readonly status: number;
  readonly detalle?: DetalleRespuestaPython;

  constructor(
    message: string,
    status = 502,
    detalle?: DetalleRespuestaPython,
  ) {
    super(message);
    this.name = "ErrorFuncionPython";
    this.status = status;
    this.detalle = detalle;
  }
}

function convertirEntero(
  valor: number | string | null | undefined,
  campo: string,
): number {
  if (
    valor === undefined ||
    valor === null ||
    String(valor).trim() === ""
  ) {
    throw new ErrorValidacion(
      `El campo '${campo}' es obligatorio.`,
    );
  }

  const numero = Number(valor);

  if (!Number.isFinite(numero) || !Number.isInteger(numero)) {
    throw new ErrorValidacion(
      `El campo '${campo}' debe ser un número entero.`,
    );
  }

  return numero;
}

function convertirFecha(
  valor: string | null | undefined,
  campo: string,
): Date {
  if (!valor || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    throw new ErrorValidacion(
      `El campo '${campo}' debe tener el formato YYYY-MM-DD.`,
    );
  }

  const [anio, mes, dia] = valor.split("-").map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));

  const esValida =
    fecha.getUTCFullYear() === anio &&
    fecha.getUTCMonth() === mes - 1 &&
    fecha.getUTCDate() === dia;

  if (!esValida) {
    throw new ErrorValidacion(
      `El campo '${campo}' contiene una fecha inválida.`,
    );
  }

  return fecha;
}

function calcularDuracionDias(
  fechaInicio: Date,
  fechaFin: Date,
): number {
  const milisegundosPorDia = 1000 * 60 * 60 * 24;
  const diferencia =
    fechaFin.getTime() - fechaInicio.getTime();

  if (diferencia < 0) {
    throw new ErrorValidacion(
      "La fecha de fin no puede ser anterior a la fecha de inicio.",
    );
  }

  /*
   * Se incluyen el día inicial y el día final:
   *
   * 10 al 10 = 1 día
   * 10 al 11 = 2 días
   */
  return Math.floor(diferencia / milisegundosPorDia) + 1;
}

function normalizarUbicacion(
  valor: number | string | null | undefined,
): string {
  if (
    valor === undefined ||
    valor === null ||
    String(valor).trim() === ""
  ) {
    return "Sin dato";
  }

  const texto = String(valor).trim();
  const numero = Number(texto);

  if (Number.isFinite(numero) && Number.isInteger(numero)) {
    return String(numero);
  }

  return texto;
}

function obtenerPrimerValorEncabezado(
  valor: string | null,
): string | null {
  if (!valor) {
    return null;
  }

  return valor.split(",")[0]?.trim() || null;
}

function obtenerUrlFuncionPython(
  request: NextRequest,
): URL {
  /*
   * Permite configurar una URL explícita cuando sea necesario.
   *
   * Ejemplo:
   * ML_PREDICT_URL=http://localhost:3000/api/ml/predict
   */
  const urlConfigurada =
    process.env.ML_PREDICT_URL?.trim();

  if (urlConfigurada) {
    return new URL(urlConfigurada);
  }

  /*
   * Con Vercel Dev y en producción, la aplicación puede estar
   * detrás de un proxy. Por eso se priorizan los encabezados
   * reenviados y no request.nextUrl.origin.
   */
  const host =
    obtenerPrimerValorEncabezado(
      request.headers.get("x-forwarded-host"),
    ) ??
    obtenerPrimerValorEncabezado(
      request.headers.get("host"),
    );

  const protocoloReenviado =
    obtenerPrimerValorEncabezado(
      request.headers.get("x-forwarded-proto"),
    );

  if (host) {
    const esLocal =
      host.startsWith("localhost") ||
      host.startsWith("127.0.0.1");

    const protocolo =
      protocoloReenviado ?? (esLocal ? "http" : "https");

    return new URL(
      "/api/ml/predict",
      `${protocolo}://${host}`,
    );
  }

  /*
   * Respaldo para despliegues de Vercel.
   */
  const vercelUrl =
    process.env.VERCEL_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL;

  if (vercelUrl) {
    return new URL(
      "/api/ml/predict",
      `https://${vercelUrl}`,
    );
  }

  throw new ErrorFuncionPython(
    "No fue posible determinar la dirección de la función de predicción.",
    500,
  );
}

function esperar(milisegundos: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milisegundos);
  });
}

async function llamarFuncionPython(
  url: URL,
  datosModelo: Record<string, unknown>,
): Promise<RespuestaFuncionPython> {
  const totalIntentos = 2;
  let ultimoDetalle: DetalleRespuestaPython | undefined;

  for (
    let numeroIntento = 1;
    numeroIntento <= totalIntentos;
    numeroIntento += 1
  ) {
    try {
      const respuesta = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(datosModelo),
        cache: "no-store",

        /*
         * La primera petición puede tardar debido a la
         * construcción o arranque en frío de Python.
         */
        signal: AbortSignal.timeout(60_000),
      });

      const contenido = await respuesta.text();

      const detalle: DetalleRespuestaPython = {
        intento: numeroIntento,
        url: url.toString(),
        status: respuesta.status,
        statusText: respuesta.statusText,
        contentType:
          respuesta.headers.get("content-type"),
        contenido: contenido.slice(0, 1500),
      };

      ultimoDetalle = detalle;

      if (!contenido.trim()) {
        console.error(
          "La función Python devolvió una respuesta vacía:",
          detalle,
        );

        if (numeroIntento < totalIntentos) {
          await esperar(1000);
          continue;
        }

        throw new ErrorFuncionPython(
          "La función de predicción devolvió una respuesta vacía.",
          502,
          detalle,
        );
      }

      let resultado: RespuestaFuncionPython;

      try {
        resultado = JSON.parse(
          contenido,
        ) as RespuestaFuncionPython;
      } catch {
        console.error(
          "La función Python devolvió contenido no JSON:",
          detalle,
        );

        /*
         * Vercel Dev puede estar terminando de construir o
         * iniciar la función. Se intenta una vez más.
         */
        if (numeroIntento < totalIntentos) {
          await esperar(1000);
          continue;
        }

        throw new ErrorFuncionPython(
          "La función de predicción devolvió una respuesta inválida.",
          502,
          detalle,
        );
      }

      if (!respuesta.ok || resultado.ok !== true) {
        const status =
          respuesta.status >= 400 &&
          respuesta.status < 500
            ? respuesta.status
            : 502;

        throw new ErrorFuncionPython(
          resultado.message ??
            "No fue posible calcular el precio sugerido.",
          status,
          detalle,
        );
      }

      return resultado;
    } catch (error) {
      if (error instanceof ErrorFuncionPython) {
        throw error;
      }

      const esTimeout =
        error instanceof Error &&
        (error.name === "TimeoutError" ||
          error.name === "AbortError");

      console.error(
        `Error llamando a Python. Intento ${numeroIntento}:`,
        error,
      );

      if (
        numeroIntento < totalIntentos &&
        !esTimeout
      ) {
        await esperar(1000);
        continue;
      }

      throw new ErrorFuncionPython(
        esTimeout
          ? "El modelo tardó demasiado en responder."
          : "No fue posible comunicarse con la función de predicción.",
        esTimeout ? 504 : 502,
        ultimoDetalle,
      );
    }
  }

  throw new ErrorFuncionPython(
    "No fue posible obtener una respuesta del modelo.",
    502,
    ultimoDetalle,
  );
}

export async function POST(request: NextRequest) {
  const autenticacion = await requireApiRole("admin");

  if (autenticacion.error) {
    return autenticacion.error;
  }

  if (!autenticacion.session) {
    return NextResponse.json(
      {
        ok: false,
        message: "No autenticado.",
      },
      { status: 401 },
    );
  }

  let bodyDesconocido: unknown;

  try {
    bodyDesconocido = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "El cuerpo de la solicitud no contiene JSON válido.",
      },
      { status: 400 },
    );
  }

  if (
    !bodyDesconocido ||
    typeof bodyDesconocido !== "object" ||
    Array.isArray(bodyDesconocido)
  ) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "El cuerpo de la solicitud debe ser un objeto JSON.",
      },
      { status: 400 },
    );
  }

  const body =
    bodyDesconocido as SolicitudPrediccionPrecio;

  try {
    const categoriaId = convertirEntero(
      body.categoriaId,
      "categoriaId",
    );

    const modalidadId = convertirEntero(
      body.modalidadId,
      "modalidadId",
    );

    const cupoMaximo = convertirEntero(
      body.cupoMaximo,
      "cupoMaximo",
    );

    const fechaInicio = convertirFecha(
      body.fechaInicio,
      "fechaInicio",
    );

    const fechaFin = convertirFecha(
      body.fechaFin,
      "fechaFin",
    );

    if (categoriaId <= 0) {
      throw new ErrorValidacion(
        "La categoría seleccionada no es válida.",
      );
    }

    if (modalidadId <= 0) {
      throw new ErrorValidacion(
        "La modalidad seleccionada no es válida.",
      );
    }

    if (cupoMaximo <= 0) {
      throw new ErrorValidacion(
        "El cupo máximo debe ser mayor que cero.",
      );
    }

    const duracionDias = calcularDuracionDias(
      fechaInicio,
      fechaFin,
    );

    const datosModelo = {
      categoria_id: String(categoriaId),
      modalidad_id: String(modalidadId),
      ubicacion_id: normalizarUbicacion(
        body.ubicacionId,
      ),
      anio_inicio: fechaInicio.getUTCFullYear(),
      mes_inicio: fechaInicio.getUTCMonth() + 1,
      duracion_dias: duracionDias,
      cupo_maximo: cupoMaximo,
    };

    const urlFuncionPython =
      obtenerUrlFuncionPython(request);

    console.log(
      "Solicitando predicción de precio:",
      {
        url: urlFuncionPython.toString(),
        datosModelo,
      },
    );

    const resultado = await llamarFuncionPython(
      urlFuncionPython,
      datosModelo,
    );

    if (
      typeof resultado.precioSugerido !== "number" ||
      !Number.isFinite(resultado.precioSugerido)
    ) {
      throw new ErrorFuncionPython(
        "La función de predicción no devolvió un precio válido.",
        502,
      );
    }

    return NextResponse.json(
      {
        ok: true,
        precioSugerido: resultado.precioSugerido,
        precioMinimoEstimado:
          resultado.precioMinimoEstimado,
        precioMaximoEstimado:
          resultado.precioMaximoEstimado,
        margenOrientativo:
          resultado.margenOrientativo,
        modelo: resultado.modelo,
        algoritmo: resultado.algoritmo,
        version: resultado.version,
        aviso: resultado.aviso,
        variablesEntrada:
          resultado.variablesEntrada ?? datosModelo,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ErrorValidacion) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        { status: 400 },
      );
    }

    if (error instanceof ErrorFuncionPython) {
      console.error(
        "Error en la función de predicción:",
        {
          message: error.message,
          status: error.status,
          detalle: error.detalle,
        },
      );

      return NextResponse.json(
        {
          ok: false,
          message: error.message,

          /*
           * El detalle solo se muestra localmente.
           * No se expone en producción.
           */
          debug:
            process.env.NODE_ENV === "development"
              ? error.detalle
              : undefined,
        },
        { status: error.status },
      );
    }

    console.error(
      "Error inesperado previsualizando el precio:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          "Ocurrió un error al solicitar el precio sugerido.",
      },
      { status: 500 },
    );
  }
}