"use client";

import Image from "next/image";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetInfo,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import {
  FileImage,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface ComprobanteCloudinaryAsset {
  publicId: string;
  url: string;
  nombreArchivo: string;
  tipoArchivo: string;
  width: number | null;
  height: number | null;
}

interface ComprobanteCloudinaryUploaderProps {
  compraId: string;
  usuarioId: number;
  value: ComprobanteCloudinaryAsset | null;
  onChange: (
    asset: ComprobanteCloudinaryAsset | null
  ) => void;
  disabled?: boolean;
}

interface EliminarComprobanteInput {
  compraId: string;
  publicId: string;
}

const MAX_FILE_SIZE = 5_000_000;

const FORMATOS_PERMITIDOS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
] as const;

const MIME_TYPES_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const CLOUDINARY_FOLDER_ROOT =
  "centro-medico/comprobantes-cursos";

function restaurarScrollPagina(): void {
  if (typeof document === "undefined") {
    return;
  }

  document.body.style.removeProperty(
    "overflow"
  );

  document.body.style.removeProperty(
    "padding-right"
  );

  document.documentElement.style.removeProperty(
    "overflow"
  );

  document.documentElement.style.removeProperty(
    "padding-right"
  );

  document.body.classList.remove(
    "cloudinary-widget-active"
  );

  document.documentElement.classList.remove(
    "cloudinary-widget-active"
  );
}

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

async function readJsonResponse(
  response: Response
): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function getErrorMessage(
  value: unknown,
  fallback: string
): string {
  if (
    isRecord(value) &&
    typeof value.error === "string" &&
    value.error.trim()
  ) {
    return value.error;
  }

  return fallback;
}

export async function eliminarComprobanteCloudinary({
  compraId,
  publicId,
}: EliminarComprobanteInput): Promise<void> {
  const response = await fetch(
    "/api/cloudinary/comprobantes/delete",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({
        compraId,
        publicId,
      }),
    }
  );

  const payload =
    await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        payload,
        "No fue posible eliminar el comprobante"
      )
    );
  }
}

function isUploadInfo(
  info:
    | string
    | CloudinaryUploadWidgetInfo
    | undefined
): info is CloudinaryUploadWidgetInfo {
  return (
    typeof info === "object" &&
    info !== null &&
    typeof info.public_id === "string" &&
    typeof info.secure_url === "string"
  );
}

function getMimeType(
  format: string
): string {
  const normalized =
    format.toLowerCase();

  if (
    normalized === "jpg" ||
    normalized === "jpeg"
  ) {
    return "image/jpeg";
  }

  if (normalized === "png") {
    return "image/png";
  }

  if (normalized === "webp") {
    return "image/webp";
  }

  return `image/${normalized}`;
}

function getOriginalFilename(
  info: CloudinaryUploadWidgetInfo
): string {
  const format =
    typeof info.format === "string"
      ? info.format.toLowerCase()
      : "";

  const extension =
    format.length > 0
      ? `.${format}`
      : "";

  if (
    typeof info.original_filename ===
      "string" &&
    info.original_filename.trim()
  ) {
    const originalName =
      info.original_filename.trim();

    const alreadyHasExtension =
      format.length > 0 &&
      originalName
        .toLowerCase()
        .endsWith(`.${format}`);

    return alreadyHasExtension
      ? originalName
      : `${originalName}${extension}`;
  }

  const publicIdParts =
    info.public_id.split("/");

  const lastPart =
    publicIdParts[
      publicIdParts.length - 1
    ] ?? "comprobante";

  return `${lastPart}${extension}`;
}

function crearSufijoCarga(): string {
  const randomPart =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
      "function"
      ? crypto
          .randomUUID()
          .replaceAll("-", "")
          .slice(0, 12)
      : Math.random()
          .toString(36)
          .slice(2, 14);

  return `${Date.now()}-${randomPart}`;
}

export function ComprobanteCloudinaryUploader({
  compraId,
  usuarioId,
  value,
  onChange,
  disabled = false,
}: ComprobanteCloudinaryUploaderProps) {
  const [isUploading, setIsUploading] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [uploadSuffix, setUploadSuffix] =
    useState(crearSufijoCarga);

  const [error, setError] =
    useState<string | null>(null);

  const compraIdNumber =
    Number(compraId);

  const folder = useMemo(
    () =>
      `${CLOUDINARY_FOLDER_ROOT}/compra-${compraIdNumber}`,
    [compraIdNumber]
  );

  const publicId = useMemo(
    () =>
      `comprobante-compra-${compraIdNumber}-usuario-${usuarioId}-${uploadSuffix}`,
    [
      compraIdNumber,
      usuarioId,
      uploadSuffix,
    ]
  );

  const signatureEndpoint =
    useMemo(
      () =>
        `/api/cloudinary/comprobantes/signature?compraId=${encodeURIComponent(
          compraId
        )}`,
      [compraId]
    );

  const finalizarWidget =
    useCallback(() => {
      setIsUploading(false);

      window.setTimeout(() => {
        restaurarScrollPagina();
      }, 150);
    }, []);

  useEffect(() => {
    return () => {
      restaurarScrollPagina();
    };
  }, []);

  const limpiarAssetSubido =
    useCallback(
      async (
        assetPublicId: string
      ): Promise<void> => {
        await eliminarComprobanteCloudinary({
          compraId,
          publicId: assetPublicId,
        });
      },
      [compraId]
    );

  const handleSuccess = useCallback(
    async (
      result: CloudinaryUploadWidgetResults
    ) => {
      if (!isUploadInfo(result.info)) {
        setError(
          "Cloudinary no devolvió información válida del archivo."
        );

        finalizarWidget();
        return;
      }

      const format =
        typeof result.info.format ===
        "string"
          ? result.info.format
          : "";

      const mimeType =
        getMimeType(format);

      const mimeTypePermitido =
        MIME_TYPES_PERMITIDOS.some(
          (item) => item === mimeType
        );

      if (!mimeTypePermitido) {
        try {
          await limpiarAssetSubido(
            result.info.public_id
          );
        } catch {
          // El endpoint registrará el error del servidor.
        }

        setError(
          "El comprobante debe ser JPG, PNG o WEBP."
        );

        finalizarWidget();
        return;
      }

      const asset:
        ComprobanteCloudinaryAsset = {
        publicId:
          result.info.public_id,

        url:
          result.info.secure_url,

        nombreArchivo:
          getOriginalFilename(
            result.info
          ),

        tipoArchivo:
          mimeType,

        width:
          typeof result.info.width ===
          "number"
            ? result.info.width
            : null,

        height:
          typeof result.info.height ===
          "number"
            ? result.info.height
            : null,
      };

      onChange(asset);
      setError(null);
      finalizarWidget();
    },
    [
      finalizarWidget,
      limpiarAssetSubido,
      onChange,
    ]
  );

  const handleRemove =
    useCallback(async () => {
      if (!value) {
        return;
      }

      setIsDeleting(true);
      setError(null);

      try {
        await limpiarAssetSubido(
          value.publicId
        );

        onChange(null);
        setUploadSuffix(
          crearSufijoCarga()
        );
      } catch (errorValue: unknown) {
        setError(
          errorValue instanceof Error
            ? errorValue.message
            : "No fue posible eliminar el comprobante"
        );
      } finally {
        setIsDeleting(false);
        restaurarScrollPagina();
      }
    }, [
      limpiarAssetSubido,
      onChange,
      value,
    ]);

  const invalidIds =
    !Number.isSafeInteger(
      compraIdNumber
    ) ||
    compraIdNumber <= 0 ||
    !Number.isSafeInteger(
      usuarioId
    ) ||
    usuarioId <= 0;

  return (
    <div className="space-y-4">
      {!value && (
        <CldUploadWidget
          signatureEndpoint={
            signatureEndpoint
          }
          options={{
            folder,

            publicId,

            tags: [
              "comprobante-curso",
              `compra-${compraIdNumber}`,
              `usuario-${usuarioId}`,
            ],

            context: {
              compra_id:
                String(compraIdNumber),
              usuario_id:
                String(usuarioId),
            },

            resourceType: "image",

            maxFiles: 1,

            multiple: false,

            maxFileSize:
              MAX_FILE_SIZE,

            clientAllowedFormats:
              [...FORMATOS_PERMITIDOS],

            sources: [
              "local",
              "camera",
            ],

            cropping: false,

            showAdvancedOptions:
              false,

            showUploadMoreButton:
              false,

            styles: {
              palette: {
                window: "#FFFFFF",
                windowBorder:
                  "#0A3D62",
                tabIcon: "#FFC300",
                menuIcons: "#0A3D62",
                textDark: "#0A3D62",
                textLight: "#FFFFFF",
                link: "#0A3D62",
                action: "#FFC300",
                inactiveTabIcon:
                  "#8E9AA6",
                error: "#EF4444",
                inProgress:
                  "#FFC300",
                complete: "#10B981",
                sourceBg: "#F3F4F6",
              },
            },
          }}
          onOpen={() => {
            setIsUploading(true);
            setError(null);
          }}
          onClose={() => {
            finalizarWidget();
          }}
          onSuccess={(result) => {
            void handleSuccess(result);
          }}
          onError={() => {
            setError(
              "No fue posible subir el comprobante."
            );

            finalizarWidget();
          }}
        >
          {({ open }) => (
            <button
              type="button"
              disabled={
                disabled ||
                isUploading ||
                isDeleting ||
                invalidIds ||
                !open
              }
              onClick={() => {
                setError(null);
                open();
              }}
              className="
                flex w-full flex-col
                items-center justify-center
                gap-3 rounded-xl border-2
                border-dashed border-slate-300
                bg-slate-50 px-6 py-10
                text-center transition
                hover:border-[#0A3D62]
                hover:bg-slate-100
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isUploading ? (
                <LoaderCircle
                  className="animate-spin text-[#0A3D62]"
                  size={30}
                />
              ) : (
                <Upload
                  className="text-[#0A3D62]"
                  size={30}
                />
              )}

              <div>
                <p className="font-semibold text-slate-800">
                  {isUploading
                    ? "Subiendo comprobante..."
                    : "Subir comprobante"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  JPG, PNG o WEBP. Máximo 5 MB.
                </p>
              </div>
            </button>
          )}
        </CldUploadWidget>
      )}

      {value && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="relative aspect-video bg-slate-100">
            <Image
              src={value.url}
              alt="Vista previa del comprobante"
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-contain"
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <FileImage
                  size={20}
                  className="text-[#0A3D62]"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">
                  {value.nombreArchivo}
                </p>

                <p className="text-xs text-slate-500">
                  {isDeleting
                    ? "Eliminando..."
                    : "Imagen cargada correctamente"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                void handleRemove();
              }}
              disabled={
                disabled ||
                isDeleting
              }
              className="
                inline-flex shrink-0
                items-center gap-2
                rounded-lg px-3 py-2
                text-sm font-medium
                text-red-600 transition
                hover:bg-red-50
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isDeleting ? (
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Trash2 size={17} />
              )}

              {isDeleting
                ? "Quitando..."
                : "Quitar"}
            </button>
          </div>
        </div>
      )}

      {invalidIds && (
        <p className="text-sm text-red-600">
          No fue posible identificar la compra o el usuario para cargar el comprobante.
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}