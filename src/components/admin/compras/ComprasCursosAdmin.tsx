// src/components/admin/compras/ComprasCursosAdmin.tsx
"use client";

import {
  AlertCircle,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getApiErrorMessage } from "@/types/api";
import type {
  CompraCursoAdminListaItem,
  FiltroComprasCursosAdmin,
  ListarComprasCursosAdminResponse,
  PaginacionComprasCursosAdmin,
  ResumenComprasCursosAdmin,
} from "@/types/admin-compras-cursos";

const PAGINATION_INITIAL:
  PaginacionComprasCursosAdmin = {
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  };

const RESUMEN_INITIAL:
  ResumenComprasCursosAdmin = {
    total: 0,
    conPagoReportado: 0,
    enValidacion: 0,
    sinPagoRelacionado: 0,
    montoReportado: "0.00",
  };

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

function parseResponse(
  value: unknown
): ListarComprasCursosAdminResponse | null {
  if (
    !isRecord(value) ||
    !Array.isArray(value.compras) ||
    !isRecord(value.pagination) ||
    !isRecord(value.resumen)
  ) {
    return null;
  }

  return value as unknown as ListarComprasCursosAdminResponse;
}

function formatCurrency(value: string): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return value;
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
}

function formatDate(value: string | null): string {
  if (!value) {
    return "Sin reporte";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getEstadoClassName(
  estado: string
): string {
  switch (estado) {
    case "Pago reportado":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "En validación":
      return "border-blue-200 bg-blue-50 text-blue-700";

    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
}

export function ComprasCursosAdmin() {
  const [compras, setCompras] = useState<
    CompraCursoAdminListaItem[]
  >([]);
  const [pagination, setPagination] =
    useState(PAGINATION_INITIAL);
  const [resumen, setResumen] =
    useState(RESUMEN_INITIAL);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] =
    useState(false);
  const [error, setError] = useState<string | null>(
    null
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] =
    useState(10);
  const [filtro, setFiltro] =
    useState<FiltroComprasCursosAdmin>(
      "todos"
    );
  const [searchInput, setSearchInput] =
    useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(
        searchInput.trim()
      );
      setPage(1);
    }, 350);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchInput]);

  const cargarCompras = useCallback(
    async (cargaInicial = false) => {
      if (cargaInicial) {
        setLoading(true);
      } else {
        setActualizando(true);
      }

      setError(null);

      try {
        const params =
          new URLSearchParams({
            page: String(page),
            pageSize:
              String(pageSize),
            filtro,
          });

        if (search) {
          params.set(
            "search",
            search
          );
        }

        const response = await fetch(
          `/api/admin/compras-cursos?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const payload =
          await readJsonResponse(response);

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              payload,
              "No fue posible obtener las compras"
            )
          );
        }

        const result = parseResponse(payload);

        if (!result) {
          throw new Error(
            "La respuesta de compras no es válida"
          );
        }

        setCompras(result.compras);
        setPagination(
          result.pagination
        );
        setResumen(result.resumen);

        if (
          result.pagination.page !==
          page
        ) {
          setPage(
            result.pagination.page
          );
        }
      } catch (errorValue: unknown) {
        setError(
          errorValue instanceof Error
            ? errorValue.message
            : "No fue posible obtener las compras"
        );
      } finally {
        setLoading(false);
        setActualizando(false);
      }
    },
    [
      filtro,
      page,
      pageSize,
      search,
    ]
  );

  useEffect(() => {
    void cargarCompras(true);
  }, [cargarCompras]);

  const cambiarFiltro = (
    value: FiltroComprasCursosAdmin
  ) => {
    setFiltro(value);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2
            size={22}
            className="animate-spin"
          />
          Cargando compras pendientes...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A] p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-100">
              Administración
            </p>

            <h1 className="text-2xl font-bold md:text-3xl">
              Pagos de cursos
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              Los pagos más recientes aparecen primero.
              Usa los filtros para localizar compras sin
              cargar todos los registros a la vez.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void cargarCompras(false);
            }}
            disabled={actualizando}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 font-medium text-white ring-1 ring-white/20 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={
                actualizando
                  ? "animate-spin"
                  : ""
              }
            />

            {actualizando
              ? "Actualizando..."
              : "Actualizar"}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ResumenCard
          label="Resultados"
          value={String(resumen.total)}
          icon={<FileSearch size={20} />}
        />

        <ResumenCard
          label="Con pago"
          value={String(
            resumen.conPagoReportado
          )}
          icon={<WalletCards size={20} />}
        />

        <ResumenCard
          label="En validación"
          value={String(
            resumen.enValidacion
          )}
          icon={<CalendarClock size={20} />}
        />

        <ResumenCard
          label="Monto reportado"
          value={formatCurrency(
            resumen.montoReportado
          )}
          icon={<WalletCards size={20} />}
        />
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
          <div>
            <label
              htmlFor="buscar-compras"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Buscar
            </label>

            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="buscar-compras"
                type="search"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value
                  )
                }
                placeholder="Folio, comprador, correo o curso"
                className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-gray-900 outline-none placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#0A3D62]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="filtro-compras"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Filtro
            </label>

            <div className="relative">
              <Filter
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                id="filtro-compras"
                value={filtro}
                onChange={(event) =>
                  cambiarFiltro(
                    event.target
                      .value as FiltroComprasCursosAdmin
                  )
                }
                className="min-w-52 appearance-none rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-8 text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0A3D62]"
              >
                <option value="todos">
                  Todos
                </option>
                <option value="con_pago">
                  Con pago reportado
                </option>
                <option value="en_validacion">
                  En validación
                </option>
                <option value="sin_pago">
                  Sin pago relacionado
                </option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="page-size"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Por página
            </label>

            <select
              id="page-size"
              value={pageSize}
              onChange={(event) => {
                setPageSize(
                  Number(
                    event.target.value
                  )
                );
                setPage(1);
              }}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0A3D62]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              No fue posible cargar las compras
            </p>
            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        </div>
      )}

      {!error && compras.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#0A3D62]">
            <FileSearch size={26} />
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            No se encontraron compras
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
            Cambia el filtro o la búsqueda para consultar
            otros registros.
          </p>
        </section>
      ) : (
        <section className="grid gap-5">
          {compras.map((compra) => (
            <CompraAdminCard
              key={compra.idCompra}
              compra={compra}
            />
          ))}
        </section>
      )}

      {!error &&
        pagination.totalItems > 0 && (
          <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Mostrando{" "}
              <strong>
                {(pagination.page - 1) *
                  pagination.pageSize +
                  1}
              </strong>{" "}
              a{" "}
              <strong>
                {Math.min(
                  pagination.page *
                    pagination.pageSize,
                  pagination.totalItems
                )}
              </strong>{" "}
              de{" "}
              <strong>
                {pagination.totalItems}
              </strong>
            </p>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setPage((current) =>
                    Math.max(
                      1,
                      current - 1
                    )
                  )
                }
                disabled={
                  pagination.page <= 1 ||
                  actualizando
                }
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Anterior
              </button>

              <span className="text-sm font-medium text-gray-700">
                Página {pagination.page} de{" "}
                {pagination.totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      pagination.totalPages,
                      current + 1
                    )
                  )
                }
                disabled={
                  pagination.page >=
                    pagination.totalPages ||
                  actualizando
                }
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente
                <ChevronRight size={17} />
              </button>
            </div>
          </section>
        )}
    </div>
  );
}

function CompraAdminCard({
  compra,
}: {
  compra: CompraCursoAdminListaItem;
}) {
  const pagoCompleto =
    Number(compra.totalReportado) >=
    Number(compra.total);

  const tienePago =
    compra.cantidadPagos > 0;

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-5 p-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getEstadoClassName(
                compra.estado
              )}`}
            >
              {compra.estado}
            </span>

            <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
              {compra.folioCompra}
            </span>

            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                !tienePago
                  ? "border-gray-200 bg-gray-50 text-gray-600"
                  : pagoCompleto
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {!tienePago
                ? "Sin pago relacionado"
                : pagoCompleto
                  ? "Monto completo"
                  : "Monto incompleto"}
            </span>
          </div>

          <h2 className="text-lg font-bold text-[#0A3D62] md:text-xl">
            {compra.tituloCurso}
          </h2>

          <div className="mt-4 grid gap-4 text-sm text-gray-600 sm:grid-cols-2 xl:grid-cols-4">
            <DatoCompra
              icon={<UserRound size={17} />}
              label="Comprador"
              value={compra.compradorNombre}
              secondary={
                compra.compradorCorreo
              }
            />

            <DatoCompra
              icon={<Users size={17} />}
              label="Cupos"
              value={`${compra.cantidadCupos}`}
              secondary={`${compra.cantidadPagos} pago(s) reportado(s)`}
            />

            <DatoCompra
              icon={<WalletCards size={17} />}
              label="Total de compra"
              value={formatCurrency(
                compra.total
              )}
              secondary={`Reportado: ${formatCurrency(
                compra.totalReportado
              )}`}
            />

            <DatoCompra
              icon={<CalendarClock size={17} />}
              label="Último reporte"
              value={formatDate(
                compra.fechaUltimoReporte
              )}
              secondary={`Compra: ${formatDate(
                compra.fechaCompra
              )}`}
            />
          </div>
        </div>

        <div className="shrink-0">
          <Link
            href={`/compras-cursos/${compra.idCompra}`}
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#0A3D62] px-5 py-2.5 font-semibold text-white transition hover:bg-[#1A4F7A] xl:w-auto"
          >
            Revisar compra
          </Link>
        </div>
      </div>
    </article>
  );
}

function ResumenCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0A3D62]">
        {icon}
      </div>

      <p className="truncate text-2xl font-bold text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        {label}
      </p>
    </div>
  );
}

function DatoCompra({
  icon,
  label,
  value,
  secondary,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  secondary?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-[#0A3D62]">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="mt-0.5 break-words font-medium text-gray-800">
          {value}
        </p>

        {secondary && (
          <p className="mt-0.5 break-words text-xs text-gray-500">
            {secondary}
          </p>
        )}
      </div>
    </div>
  );
}