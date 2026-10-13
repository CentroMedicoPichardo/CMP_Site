
"use client";

import Link from "next/link";
import {
  Suspense,
  useState,
  type FormEvent,
} from "react";
import { useSearchParams } from "next/navigation";

type RespuestaApi = {
  message?: string;
  error?: string;
};

function FormularioRestablecimiento() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] =
    useState("");
  const [mostrarContrasena, setMostrarContrasena] =
    useState(false);
  const [cargando, setCargando] = useState(false);
  const [completado, setCompletado] = useState(false);
  const [error, setError] = useState("");

  const tokenValido = /^[a-f0-9]{64}$/.test(token);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (cargando || completado) {
      return;
    }

    setError("");

    if (!tokenValido) {
      setError("El enlace de recuperación no es válido.");
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (contrasena.length < 8) {
      setError(
        "La contraseña debe tener al menos 8 caracteres."
      );
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(
        "/api/auth/password-reset/confirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            contrasena,
            confirmarContrasena,
          }),
          cache: "no-store",
          referrerPolicy: "no-referrer",
        }
      );

      const datos: RespuestaApi =
        await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(
          datos.message ||
            datos.error ||
            "No fue posible restablecer la contraseña."
        );
      }

      setCompletado(true);
      setContrasena("");
      setConfirmarContrasena("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado."
      );
    } finally {
      setCargando(false);
    }
  }

  if (!tokenValido) {
    return (
      <div className="space-y-5 text-center">
        <h1 className="text-2xl font-bold text-[#0A3D62]">
          Enlace no válido
        </h1>

        <p className="text-sm text-gray-600">
          El enlace de recuperación está incompleto o no
          es válido. Solicita uno nuevo desde el inicio
          de sesión.
        </p>

        <Link
          href="/acceder"
          className="inline-block rounded-xl bg-[#0A3D62] px-6 py-3 font-semibold text-white"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  if (completado) {
    return (
      <div className="space-y-5 text-center">
        <div className="text-5xl text-green-700">✓</div>

        <h1 className="text-2xl font-bold text-[#0A3D62]">
          Contraseña actualizada
        </h1>

        <p className="text-sm text-gray-600">
          Tu contraseña se restableció correctamente.
          Ya puedes iniciar sesión con tu nueva contraseña.
        </p>

        <Link
          href="/acceder"
          className="inline-block rounded-xl bg-[#0A3D62] px-6 py-3 font-semibold text-white"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#0A3D62]">
          Restablecer contraseña
        </h1>

        <p className="mt-3 text-sm text-gray-600">
          Ingresa una nueva contraseña para tu cuenta
          del Centro Médico Pichardo.
        </p>
      </div>

      <div>
        <label
          htmlFor="contrasena"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Nueva contraseña
        </label>

        <input
          id="contrasena"
          type={mostrarContrasena ? "text" : "password"}
          value={contrasena}
          onChange={(event) =>
            setContrasena(event.target.value)
          }
          autoComplete="new-password"
          required
          minLength={8}
          disabled={cargando}
          placeholder="Ingresa tu nueva contraseña"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#0A3D62]"
        />
      </div>

      <div>
        <label
          htmlFor="confirmarContrasena"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Confirmar contraseña
        </label>

        <input
          id="confirmarContrasena"
          type={mostrarContrasena ? "text" : "password"}
          value={confirmarContrasena}
          onChange={(event) =>
            setConfirmarContrasena(event.target.value)
          }
          autoComplete="new-password"
          required
          minLength={8}
          disabled={cargando}
          placeholder="Repite la nueva contraseña"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#0A3D62]"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={mostrarContrasena}
          onChange={(event) =>
            setMostrarContrasena(event.target.checked)
          }
          disabled={cargando}
        />
        Mostrar contraseñas
      </label>

      <p className="text-xs leading-5 text-gray-500">
        Utiliza al menos 8 caracteres, incluyendo letras,
        números y un símbolo. Evita secuencias comunes.
      </p>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="w-full rounded-xl bg-[#FFC300] px-5 py-3 font-bold text-[#0A3D62] disabled:opacity-60"
      >
        {cargando
          ? "Actualizando contraseña..."
          : "Guardar nueva contraseña"}
      </button>

      <div className="text-center">
        <Link
          href="/acceder"
          className="text-sm font-semibold text-[#0A3D62] underline"
        >
          Volver al inicio de sesión
        </Link>
      </div>
    </form>
  );
}

export default function RestablecerPasswordPage() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <Suspense
          fallback={
            <p className="text-center text-gray-600">
              Cargando formulario...
            </p>
          }
        >
          <FormularioRestablecimiento />
        </Suspense>
      </div>
    </section>
  );
}
