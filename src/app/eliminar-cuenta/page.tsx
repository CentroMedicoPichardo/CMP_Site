import type { Metadata } from "next";
import Link from "next/link";
import { auth, normalizeRole } from "@/lib/auth";
import SolicitudBajaLogica from "@/components/arco/SolicitudBajaLogica";

export const metadata: Metadata = {
  title: "Solicitud de baja de cuenta | Centro Médico Pichardo",
  description: "Información y solicitud para desactivar el acceso de clientes de Centro Médico Pichardo.",
};

export default async function PaginaEliminarCuenta() {
  const session = await auth();
  const esCliente = session && normalizeRole(session.user.rol) === "cliente";

  return (
    <section className="mx-auto max-w-3xl px-5 py-12 text-gray-900">
      <h1 className="text-3xl font-bold">Solicitar baja de cuenta</h1>
      <p className="mt-5 leading-7">
        Puedes solicitar que se desactive tu cuenta del Centro Médico Pichardo.
        Una vez aprobada por un administrador, no podrás iniciar sesión en el
        sitio web ni en la aplicación móvil y tus sesiones anteriores dejarán
        de ser válidas.
      </p>
      <div className="mt-5 rounded-lg border p-5">
        <h2 className="text-lg font-semibold">Qué datos se conservan</h2>
        <p className="mt-2 leading-7">
          Esta operación es una baja lógica, no una eliminación de datos.
          Tu registro de usuario y los datos personales vinculados permanecen
          en la base de datos, junto con las compras, pagos, inscripciones,
          participantes y registros históricos. No se borran ni anonimizan.
        </p>
        <p className="mt-3 leading-7">
          Si deseas solicitar además la eliminación de datos personales,
          comunícate con el Centro Médico a través de la
          {" "}<Link href="/contacto" className="underline">página de contacto</Link>.
          Esa gestión requiere una revisión por separado.
        </p>
      </div>
      {esCliente ? (
        <SolicitudBajaLogica />
      ) : session ? (
        <p className="mt-6 rounded-lg border p-4">
          Esta opción está disponible para cuentas de cliente.
        </p>
      ) : (
        <div className="mt-6 rounded-lg border bg-white p-5">
          <p>Para solicitar la baja lógica, inicia sesión con tu cuenta de cliente.</p>
          <Link href="/acceder" className="mt-3 inline-block font-semibold underline">
            Iniciar sesión
          </Link>
          <p className="mt-3 text-sm">
            Si ya no puedes acceder a tu cuenta, puedes pedir ayuda mediante
            {" "}<Link href="/contacto" className="underline">Contacto</Link>.
          </p>
        </div>
      )}
    </section>
  );
}
