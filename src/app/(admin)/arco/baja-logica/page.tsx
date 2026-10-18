
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Baja lógica administrativa | Centro Médico Pichardo",
};

/**
 * A17 - Baja lógica de cuentas.
 *
 * La administración de solicitudes ARCO
 * se centraliza en /arco/cancelaciones.
 *
 * Se conserva esta ruta para que los
 * enlaces antiguos sigan funcionando,
 * pero no se utiliza el panel duplicado.
 *
 * La ruta requiere autenticación
 * con rol administrador.
 */
export default async function PaginaBajaLogica() {
  await requireRole("admin", "/acceder");

  redirect("/arco/cancelaciones");
}
