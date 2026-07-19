import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type PostgresClient = ReturnType<typeof postgres>;

// Reutilización del cliente durante el desarrollo local
declare global {
  var postgresClient: PostgresClient | undefined;
}

function crearClientePostgres(): PostgresClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL no está definida");
  }

  // Configuración para Vercel
  if (process.env.VERCEL_ENV) {
    return postgres(connectionString, {
      prepare: false,
      ssl: "require",
      max: 10,
      idle_timeout: 20,
      connect_timeout: 15,
    });
  }

  // Reutilizar conexión durante desarrollo local
  if (!globalThis.postgresClient) {
    globalThis.postgresClient = postgres(connectionString, {
      prepare: false,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idle_timeout: 20,
      connect_timeout: 15,
    });
  }

  return globalThis.postgresClient;
}

/**
 * Cliente postgres.js para consultas SQL directas,
 * transacciones y generación de respaldos.
 */
export const postgresClient = crearClientePostgres();

/**
 * Instancia de Drizzle utilizada por el resto del sistema.
 */
export const db = drizzle(postgresClient, {
  schema,
});