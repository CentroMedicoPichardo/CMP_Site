// src/app/api/compras-cursos/[id]/comprobante/route.ts

import {
  mkdir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import {
  auth,
  normalizeRole,
} from "@/lib/auth";
import {
  ComprobanteCursoError,
  getComprobanteDirectory,
  getMimeTypeFromStoredName,
  getStoredFileName,
  resolveStoredComprobantePath,
  sanitizeOriginalFileName,
  validateComprobanteFile,
} from "@/lib/comprobantes-cursos";
import { db } from "@/lib/db";
import {
  comprasCursos,
} from "@/lib/schema";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function parsePositiveId(
  value: string
): number | null {
  const id = Number(value);

  return Number.isSafeInteger(id) &&
    id > 0
    ? id
    : null;
}

async function getPurchaseOwner(
  purchaseId: number
): Promise<number | null> {
  const [purchase] = await db
    .select({
      userId:
        comprasCursos.idusuario,
    })
    .from(comprasCursos)
    .where(
      eq(
        comprasCursos.idcompra,
        BigInt(purchaseId)
      )
    )
    .limit(1);

  return purchase?.userId ?? null;
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      {
        error: "No autenticado",
      },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const purchaseId = parsePositiveId(id);

  if (!purchaseId) {
    return NextResponse.json(
      {
        error:
          "El identificador de la compra no es válido",
      },
      { status: 400 }
    );
  }

  try {
    const ownerId =
      await getPurchaseOwner(purchaseId);

    if (!ownerId) {
      return NextResponse.json(
        {
          error: "Compra no encontrada",
        },
        { status: 404 }
      );
    }

    if (
      ownerId !== session.user.id
    ) {
      return NextResponse.json(
        {
          error:
            "No tienes permiso para modificar esta compra",
        },
        { status: 403 }
      );
    }

    const formData =
      await request.formData();

    const file =
      validateComprobanteFile(
        formData.get("comprobante")
      );

    const storedFileName =
      getStoredFileName(file.type);

    const directory =
      getComprobanteDirectory(
        session.user.id,
        purchaseId
      );

    await mkdir(directory, {
      recursive: true,
    });

    const absolutePath =
      resolveStoredComprobantePath(
        session.user.id,
        purchaseId,
        storedFileName
      );

    const bytes = new Uint8Array(
      await file.arrayBuffer()
    );

    await writeFile(
      absolutePath,
      bytes,
      {
        flag: "wx",
      }
    );

    const originalFileName =
      sanitizeOriginalFileName(
        file.name
      );

    const protectedUrl =
      `/api/compras-cursos/${purchaseId}/comprobante?archivo=${encodeURIComponent(
        storedFileName
      )}`;

    return NextResponse.json(
      {
        message:
          "Comprobante cargado correctamente",
        comprobante: {
          rutaComprobante:
            protectedUrl,
          nombreArchivoOriginal:
            originalFileName,
          tipoArchivo:
            file.type,
          size:
            file.size,
        },
      },
      { status: 201 }
    );
  } catch (errorValue: unknown) {
    console.error(
      "Error cargando comprobante de curso:",
      errorValue
    );

    if (
      errorValue instanceof
      ComprobanteCursoError
    ) {
      return NextResponse.json(
        {
          error:
            errorValue.message,
        },
        {
          status:
            errorValue.status,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Error interno al cargar el comprobante",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      {
        error: "No autenticado",
      },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const purchaseId = parsePositiveId(id);

  if (!purchaseId) {
    return NextResponse.json(
      {
        error:
          "El identificador de la compra no es válido",
      },
      { status: 400 }
    );
  }

  try {
    const ownerId =
      await getPurchaseOwner(purchaseId);

    if (!ownerId) {
      return NextResponse.json(
        {
          error: "Compra no encontrada",
        },
        { status: 404 }
      );
    }

    const isAdmin =
      normalizeRole(
        session.user.rol
      ) === "admin";

    if (
      !isAdmin &&
      ownerId !== session.user.id
    ) {
      return NextResponse.json(
        {
          error:
            "No tienes permiso para consultar este comprobante",
        },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const storedFileName =
      url.searchParams.get(
        "archivo"
      );

    if (!storedFileName) {
      return NextResponse.json(
        {
          error:
            "No se indicó el comprobante",
        },
        { status: 400 }
      );
    }

    const absolutePath =
      resolveStoredComprobantePath(
        ownerId,
        purchaseId,
        storedFileName
      );

    const fileStats =
      await stat(absolutePath);

    if (!fileStats.isFile()) {
      return NextResponse.json(
        {
          error:
            "Comprobante no encontrado",
        },
        { status: 404 }
      );
    }

    const fileBuffer =
      await readFile(absolutePath);

    return new NextResponse(
      new Uint8Array(fileBuffer),
      {
        status: 200,
        headers: {
          "Content-Type":
            getMimeTypeFromStoredName(
              storedFileName
            ),
          "Content-Length":
            String(fileStats.size),
          "Content-Disposition":
            `inline; filename="${storedFileName}"`,
          "Cache-Control":
            "private, no-store",
          "X-Content-Type-Options":
            "nosniff",
        },
      }
    );
  } catch (errorValue: unknown) {
    console.error(
      "Error consultando comprobante de curso:",
      errorValue
    );

    if (
      errorValue instanceof
      ComprobanteCursoError
    ) {
      return NextResponse.json(
        {
          error:
            errorValue.message,
        },
        {
          status:
            errorValue.status,
        }
      );
    }

    const errorCode =
      isRecordWithCode(
        errorValue
      )
        ? errorValue.code
        : null;

    if (errorCode === "ENOENT") {
      return NextResponse.json(
        {
          error:
            "Comprobante no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Error interno al consultar el comprobante",
      },
      { status: 500 }
    );
  }
}

function isRecordWithCode(
  value: unknown
): value is {
  code: string;
} {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    typeof value.code === "string"
  );
}