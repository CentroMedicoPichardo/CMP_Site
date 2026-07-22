// src/lib/cloudinary.ts

import "server-only";

import { v2 as cloudinary } from "cloudinary";

const CLOUDINARY_COMPROBANTES_ROOT =
  "centro-medico/comprobantes-cursos";

interface CloudinaryServerConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

let configured = false;

function getRequiredEnv(
  names: readonly string[]
): string {
  for (const name of names) {
    const value =
      process.env[name]?.trim();

    if (value) {
      return value;
    }
  }

  throw new Error(
    `Falta configurar una variable de entorno: ${names.join(
      " o "
    )}`
  );
}

export function getCloudinaryServerConfig():
  CloudinaryServerConfig {
  return {
    cloudName: getRequiredEnv([
      "CLOUDINARY_CLOUD_NAME",
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    ]),
    apiKey: getRequiredEnv([
      "CLOUDINARY_API_KEY",
      "NEXT_PUBLIC_CLOUDINARY_API_KEY",
    ]),
    apiSecret: getRequiredEnv([
      "CLOUDINARY_API_SECRET",
    ]),
  };
}

export function getCloudinary() {
  const config =
    getCloudinaryServerConfig();

  if (!configured) {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
      secure: true,
    });

    configured = true;
  }

  return cloudinary;
}

export function getComprobanteFolder(
  compraId: number
): string {
  return `${CLOUDINARY_COMPROBANTES_ROOT}/compra-${compraId}`;
}

export function getComprobantePublicIdPrefix(
  compraId: number,
  usuarioId: number
): string {
  return `comprobante-compra-${compraId}-usuario-${usuarioId}-`;
}