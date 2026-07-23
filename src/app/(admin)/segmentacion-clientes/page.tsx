import {
  BrainCircuit,
  Database,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

import SegmentacionClientesPanel from "@/components/admin/segmentacion-clientes/segmentacion-clientes-panel";

import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SegmentacionClientesPage() {
  const session = await requireRole(
    "admin",
    "/",
  );

  const nombreAdministrador =
    session.user.nombreCompleto?.trim() ||
    session.user.nombre?.trim() ||
    "Administrador";

  return (
    <main className="relative min-h-screen min-w-0 overflow-hidden bg-[#F4F7FA]">
      {/* Elementos decorativos del fondo */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -right-28 -top-24 h-80 w-80 rounded-full bg-[#FFC300]/10 blur-3xl sm:h-96 sm:w-96" />

        <div className="absolute -left-32 top-72 h-80 w-80 rounded-full bg-[#0A3D62]/8 blur-3xl sm:h-96 sm:w-96" />

        <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(10,61,98,0.06)_0%,rgba(10,61,98,0)_100%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
        <div className="space-y-5 sm:space-y-6">
          {/* Encabezado del módulo */}
          <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div
              className="h-1 w-full bg-[#FFC300]"
              aria-hidden="true"
            />

            <div className="p-4 sm:p-6 lg:p-7">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0A3D62] text-[#FFC300] shadow-sm sm:h-14 sm:w-14">
                    <BrainCircuit
                      size={26}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                        Analítica y aprendizaje automático
                      </p>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFC300]/40 bg-[#FFF9E6] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#0A3D62]">
                        <Sparkles
                          size={11}
                          aria-hidden="true"
                        />

                        Propuesta 2
                      </span>
                    </div>

                    <h1 className="mt-2 whitespace-normal break-words text-xl font-black leading-tight text-[#0A3D62] sm:text-2xl lg:text-3xl">
                      Segmentación de clientes
                    </h1>

                    <p className="mt-2 max-w-3xl whitespace-normal break-words text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
                      Analiza el comportamiento de compra de los
                      clientes mediante K-Means, identifica perfiles
                      relevantes y consulta las características de
                      cada segmento.
                    </p>
                  </div>
                </div>

                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:w-auto xl:min-w-[520px]">
                  <div className="flex min-h-20 items-center gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A3D62] shadow-sm">
                      <UsersRound
                        size={18}
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />
                    </span>

                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                        Administrador
                      </p>

                      <p className="mt-1 whitespace-normal break-words text-sm font-extrabold text-[#0A3D62]">
                        {nombreAdministrador}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-h-20 items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                      <ShieldCheck
                        size={18}
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />

                      <span
                        className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"
                        aria-hidden="true"
                      />
                    </span>

                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-600">
                        Acceso autorizado
                      </p>

                      <p className="mt-1 whitespace-normal break-words text-sm font-extrabold text-emerald-800">
                        Módulo administrativo
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flujo resumido */}
              <div className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF2F8] text-xs font-black text-[#0A3D62]">
                    1
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#0A3D62]">
                      Preparar datos
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Consolidación del comportamiento de compra.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF2F8] text-xs font-black text-[#0A3D62]">
                    2
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#0A3D62]">
                      Ejecutar K-Means
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Entrenamiento, evaluación y asignación.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF2F8] text-xs font-black text-[#0A3D62]">
                    3
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#0A3D62]">
                      Consultar resultados
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Segmentos, métricas y clientes asignados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Aviso de fuente de datos */}
          <section className="flex flex-col gap-3 rounded-2xl border border-[#0A3D62]/15 bg-[#F2F7FA] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A3D62] shadow-sm">
                <Database
                  size={17}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#0A3D62]">
                  Datos conectados con PostgreSQL
                </p>

                <p className="mt-1 whitespace-normal break-words text-[11px] leading-5 text-slate-500">
                  El panel utilizará la información consolidada de
                  usuarios, compras, cursos y pagos para ejecutar la
                  segmentación.
                </p>
              </div>
            </div>

            <span className="inline-flex self-start items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-[10px] font-extrabold text-emerald-700 sm:self-auto">
              <span
                className="h-2 w-2 rounded-full bg-emerald-500"
                aria-hidden="true"
              />

              Fuente preparada
            </span>
          </section>

          {/* Panel principal */}
          <section
            aria-label="Panel de segmentación de clientes"
            className="min-w-0"
          >
            <SegmentacionClientesPanel
              adminName={nombreAdministrador}
            />
          </section>
        </div>
      </div>
    </main>
  );
}