import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  GraduationCap,
  HeartPulse,
  Newspaper,
  Sparkles,
  Video,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { publicRoutes } from "@/config/routes";

interface NoticiaInicio {
  id?: string | number;
  idNoticia?: string | number;
  titulo?: string | null;
  tituloNoticia?: string | null;
  resumen?: string | null;
  descripcion?: string | null;
  categoria?: string | null;
  fechaPublicacion?: string | null;
  imagenSrc?: string | null;
  urlImagen?: string | null;
  urlImagenPortada?: string | null;
}

interface SaberPediatricoSectionProps {
  noticias: NoticiaInicio[];
}

interface NoticiaNormalizada {
  id: string | number;
  titulo: string;
  descripcion: string;
  categoria: string;
  fecha: string;
  imagenSrc?: string;
}

function normalizarNoticia(
  noticia: NoticiaInicio,
  index: number,
): NoticiaNormalizada {
  return {
    id:
      noticia.idNoticia ??
      noticia.id ??
      `noticia-inicio-${index}`,

    titulo:
      noticia.tituloNoticia?.trim() ||
      noticia.titulo?.trim() ||
      "Contenido de salud pediátrica",

    descripcion:
      noticia.resumen?.trim() ||
      noticia.descripcion?.trim() ||
      "Información confiable para acompañar el cuidado y desarrollo de niñas y niños.",

    categoria:
      noticia.categoria?.trim() ||
      "Salud infantil",

    fecha:
      formatearFecha(
        noticia.fechaPublicacion,
      ),

    imagenSrc:
      noticia.urlImagenPortada?.trim() ||
      noticia.urlImagen?.trim() ||
      noticia.imagenSrc?.trim() ||
      undefined,
  };
}

function formatearFecha(
  fecha: string | null | undefined,
): string {
  if (!fecha?.trim()) {
    return "Contenido reciente";
  }

  const fechaParseada = new Date(fecha);

  if (
    Number.isNaN(fechaParseada.getTime())
  ) {
    return fecha;
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(fechaParseada);
}

export function SaberPediatricoSection({
  noticias,
}: SaberPediatricoSectionProps) {
  const noticiasDestacadas = Array.isArray(
    noticias,
  )
    ? noticias
        .slice(0, 3)
        .map(normalizarNoticia)
    : [];

  return (
    <section
      className="relative overflow-hidden border-t border-gray-200 bg-[#F7FAFC] py-10 sm:py-11 lg:py-12"
      aria-labelledby="saber-pediatrico-titulo"
    >
      {/* Separador superior */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div className="h-1 w-20 rounded-full bg-[#FFC300]" />
      </div>

      {/* Decoraciones */}
      <div
        className="pointer-events-none absolute -left-24 top-12 h-48 w-48 rounded-full bg-[#FFC300]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-52 w-52 rounded-full bg-[#0A3D62]/10 blur-3xl"
        aria-hidden="true"
      />

      <Container>
        {/* Encabezado compacto */}
        <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0A3D62]/10 bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#0A3D62] shadow-sm">
              <Sparkles
                size={12}
                className="text-[#B88600]"
                aria-hidden="true"
              />

              Educación para las familias
            </span>

            <h2
              id="saber-pediatrico-titulo"
              className="mt-2.5 text-2xl font-extrabold leading-tight text-[#0A3D62] sm:text-3xl lg:text-4xl"
            >
              Saber{" "}
              <span className="relative inline-block">
                <span className="relative z-10">
                  Pediátrico
                </span>

                <span
                  className="absolute bottom-0.5 left-0 h-2.5 w-full rounded-full bg-[#FFC300]/35"
                  aria-hidden="true"
                />
              </span>
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Información médica, consejos y recursos
              prácticos para acompañar cada etapa del
              crecimiento infantil.
            </p>
          </div>

          <Link
            href={publicRoutes.saberPediatrico}
            className="group inline-flex min-h-10 w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#FFC300] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2"
          >
            Explorar contenido

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Contenido principal */}
        <div className="relative grid items-stretch gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(310px,0.55fr)]">
          {/* Artículos */}
          <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(10,61,98,0.07)]">
            <header className="flex items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 py-3.5 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
                  <Newspaper
                    size={19}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-[#0A3D62] sm:text-base">
                    Artículos destacados
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Información preparada para el
                    bienestar de tu familia.
                  </p>
                </div>
              </div>

              <span className="hidden rounded-full bg-[#FFF6D6] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#8A6700] sm:inline-flex">
                Contenido reciente
              </span>
            </header>

            {noticiasDestacadas.length > 0 ? (
              <div className="grid gap-px bg-gray-200 sm:grid-cols-2 xl:grid-cols-3">
                {noticiasDestacadas.map(
                  (noticia) => (
                    <NoticiaCard
                      key={String(noticia.id)}
                      noticia={noticia}
                    />
                  ),
                )}
              </div>
            ) : (
              <div className="flex min-h-[240px] flex-col items-center justify-center px-5 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2F8] text-[#0A3D62]">
                  <BookOpenText
                    size={26}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <h4 className="mt-4 text-base font-extrabold text-[#0A3D62]">
                  Próximamente nuevos artículos
                </h4>

                <p className="mt-1.5 max-w-sm text-sm leading-6 text-gray-500">
                  Estamos preparando contenido educativo
                  sobre salud, crianza y desarrollo infantil.
                </p>
              </div>
            )}

            <footer className="flex items-center justify-between gap-3 border-t border-gray-100 bg-[#F8FAFC] px-4 py-3 sm:px-5">
              <p className="text-[11px] font-semibold text-gray-500">
                Consejos respaldados por profesionales
                de la salud.
              </p>

              <Link
                href={publicRoutes.saberPediatrico}
                className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-extrabold text-[#0A3D62] transition-colors hover:text-[#B88600]"
              >
                Ver artículos

                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </footer>
          </article>

          {/* Recursos */}
          <aside className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <RecursoCard
              href={`${publicRoutes.saberPediatrico}/videos`}
              icono={
                <Video
                  size={20}
                  aria-hidden="true"
                />
              }
              etiqueta="Contenido audiovisual"
              titulo="Videoblog"
              descripcion="Respuestas claras de nuestros especialistas a las dudas más frecuentes."
              accion="Ver videos"
              variante="azul"
            />

            <RecursoCard
              href={`${publicRoutes.saberPediatrico}/guias`}
              icono={
                <HeartPulse
                  size={20}
                  aria-hidden="true"
                />
              }
              etiqueta="Desarrollo infantil"
              titulo="Guías prácticas"
              descripcion="Hitos del desarrollo, nutrición y orientación para cada etapa."
              accion="Explorar guías"
              variante="blanco"
            />

            <div className="relative overflow-hidden rounded-2xl bg-[#FFC300] p-4 shadow-[0_8px_24px_rgba(255,195,0,0.18)] sm:col-span-2 lg:col-span-1">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/30 blur-2xl"
                aria-hidden="true"
              />

              <div className="relative flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
                  <GraduationCap
                    size={22}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#0A3D62]/60">
                    Formación especializada
                  </p>

                  <h3 className="mt-0.5 text-base font-extrabold text-[#0A3D62]">
                    Cursos y talleres
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#0A3D62]/75">
                    Aprende con especialistas y fortalece
                    el cuidado de tu familia.
                  </p>
                </div>
              </div>

              <Link
                href={publicRoutes.cursos}
                className="group relative mt-3 inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white hover:text-[#0A3D62]"
              >
                Ver cursos disponibles

                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

function NoticiaCard({
  noticia,
}: {
  noticia: NoticiaNormalizada;
}) {
  return (
    <article className="group flex min-w-0 flex-col bg-white">
      <div className="relative h-32 overflow-hidden bg-[#EAF2F8] sm:h-36">
        {noticia.imagenSrc ? (
          <Image
            src={noticia.imagenSrc}
            alt={noticia.titulo}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A]">
            <BookOpenText
              size={30}
              className="text-white/70"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-[#061C2E]/70 to-transparent"
          aria-hidden="true"
        />

        <span className="absolute bottom-2.5 left-2.5 rounded-full bg-[#FFC300] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.1em] text-[#0A3D62]">
          {noticia.categoria}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-center gap-1.5 text-[9px] font-semibold text-gray-400">
          <CalendarDays
            size={11}
            aria-hidden="true"
          />

          {noticia.fecha}
        </div>

        <h4 className="mt-1.5 line-clamp-2 text-sm font-extrabold leading-5 text-[#0A3D62]">
          {noticia.titulo}
        </h4>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
          {noticia.descripcion}
        </p>
      </div>
    </article>
  );
}

interface RecursoCardProps {
  href: string;
  icono: React.ReactNode;
  etiqueta: string;
  titulo: string;
  descripcion: string;
  accion: string;
  variante: "azul" | "blanco";
}

function RecursoCard({
  href,
  icono,
  etiqueta,
  titulo,
  descripcion,
  accion,
  variante,
}: RecursoCardProps) {
  const esAzul = variante === "azul";

  return (
    <Link
      href={href}
      className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-3"
    >
      <article
        className={
          esAzul
            ? "relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[#0A3D62] p-4 text-white shadow-[0_8px_24px_rgba(10,61,98,0.14)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_30px_rgba(10,61,98,0.20)]"
            : "relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 text-[#0A3D62] shadow-[0_8px_24px_rgba(10,61,98,0.07)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[#FFC300]/60 group-hover:shadow-[0_14px_30px_rgba(10,61,98,0.12)]"
        }
      >
        {esAzul && (
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#FFC300]/15 blur-2xl"
            aria-hidden="true"
          />
        )}

        <div className="relative flex items-start gap-3">
          <span
            className={
              esAzul
                ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFC300] text-[#0A3D62]"
                : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]"
            }
          >
            {icono}
          </span>

          <div className="min-w-0 flex-1">
            <p
              className={
                esAzul
                  ? "text-[8px] font-bold uppercase tracking-[0.13em] text-[#FFC300]"
                  : "text-[8px] font-bold uppercase tracking-[0.13em] text-[#B88600]"
              }
            >
              {etiqueta}
            </p>

            <h3 className="mt-0.5 text-base font-extrabold">
              {titulo}
            </h3>

            <p
              className={
                esAzul
                  ? "mt-1 text-xs leading-5 text-white/70"
                  : "mt-1 text-xs leading-5 text-gray-500"
              }
            >
              {descripcion}
            </p>
          </div>
        </div>

        <div
          className={
            esAzul
              ? "relative mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-xs font-bold text-[#FFC300]"
              : "relative mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5 text-xs font-bold text-[#0A3D62]"
          }
        >
          <span>{accion}</span>

          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </article>
    </Link>
  );
}