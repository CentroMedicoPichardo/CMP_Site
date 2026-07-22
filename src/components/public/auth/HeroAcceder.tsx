import Image from "next/image";
import {
  BookOpenText,
  CheckCircle2,
  GraduationCap,
  HeartHandshake,
  LogIn,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";

interface HeroAccederProps {
  modo: "login" | "registro";
  onCambiarModo: (
    modo: "login" | "registro",
  ) => void;
}

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

export function HeroAcceder({
  modo,
  onCambiarModo,
}: HeroAccederProps) {
  const esLogin = modo === "login";

  return (
    <aside className="relative hidden min-h-full overflow-hidden bg-[#061C2E] lg:flex lg:w-1/2">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image
          src="/login-bg.png"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover object-center opacity-20"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 bg-gradient-to-br from-[#061C2E]/95 via-[#0A3D62]/92 to-[#1A4F7A]/88"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:34px_34px]"
          aria-hidden="true"
        />
      </div>

      {/* Decoraciones */}
      <div
        className="pointer-events-none absolute -left-28 -top-24 h-72 w-72 rounded-full bg-[#FFC300]/15 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute right-10 top-14 h-28 w-28 rounded-full border border-white/10"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute right-16 top-20 h-16 w-16 rounded-full border border-[#FFC300]/20"
        aria-hidden="true"
      />

      {/* Contenido */}
      <div className="relative z-10 flex w-full items-center px-7 py-8 xl:px-10 xl:py-10 2xl:px-14">
        <div className="mx-auto w-full max-w-[760px]">
          {/* Marca */}
          <header className="flex items-center justify-between gap-5">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-md">
                <div
                  className="absolute inset-2 rounded-xl bg-[#FFC300]/20 blur-lg"
                  aria-hidden="true"
                />

                <Image
                  src="/logo.png"
                  alt="Centro Médico Pichardo"
                  width={54}
                  height={54}
                  priority
                  className="relative h-13 w-13 object-contain"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFC300]">
                  Centro Médico
                </p>

                <p className="mt-0.5 text-2xl font-extrabold leading-none text-white">
                  Pichardo
                </p>

                <p className="mt-1 text-xs font-medium text-white/55">
                  Salud, aprendizaje y comunidad
                </p>
              </div>
            </div>

            <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-200 xl:inline-flex">
              <ShieldCheck
                size={12}
                strokeWidth={2}
                aria-hidden="true"
              />

              Plataforma segura
            </span>
          </header>

          {/* Mensaje principal */}
          <div className="mt-8 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
              <Sparkles
                size={12}
                className="text-[#FFC300]"
                aria-hidden="true"
              />

              Comunidad de aprendizaje pediátrico
            </span>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white xl:text-4xl 2xl:text-[42px]">
              {esLogin
                ? "Continúa acompañando el bienestar de tu familia"
                : "Forma parte de una comunidad dedicada al cuidado infantil"}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70 xl:text-base xl:leading-7">
              {esLogin
                ? "Accede a tus cursos, inscripciones y recursos educativos desde un mismo espacio."
                : "Crea tu cuenta para acceder a cursos, publicaciones y recursos preparados por especialistas."}
            </p>
          </div>

          {/* Beneficios en una sola fila */}
          <div className="mt-7 grid grid-cols-3 gap-3">
            <BeneficioAcceso
              icono={
                <GraduationCap
                  size={21}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              }
              titulo="Cursos"
              descripcion="Consulta actividades y talleres."
            />

            <BeneficioAcceso
              icono={
                <MessageCircle
                  size={20}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              }
              titulo="Comunidad"
              descripcion="Comparte experiencias con familias."
            />

            <BeneficioAcceso
              icono={
                <BookOpenText
                  size={20}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              }
              titulo="Contenido"
              descripcion="Accede a guías y publicaciones."
            />
          </div>

          {/* Información adicional */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 backdrop-blur-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFC300] text-[#0A3D62]">
                <HeartHandshake
                  size={18}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white">
                  Atención cercana
                </p>

                <p className="mt-0.5 truncate text-[10px] text-white/55">
                  Contenido pensado para las familias
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 backdrop-blur-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#FFC300]">
                <CheckCircle2
                  size={18}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white">
                  Información confiable
                </p>

                <p className="mt-0.5 truncate text-[10px] text-white/55">
                  Recursos preparados por especialistas
                </p>
              </div>
            </div>
          </div>

          {/* Selector de modo */}
          <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.14)] backdrop-blur-md">
            <div
              className="grid grid-cols-2 gap-1.5"
              role="tablist"
              aria-label="Seleccionar tipo de acceso"
            >
              <button
                type="button"
                role="tab"
                aria-selected={esLogin}
                onClick={() =>
                  onCambiarModo("login")
                }
                className={cn(
                  "group flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-extrabold uppercase tracking-[0.06em] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]",
                  esLogin
                    ? "bg-[#FFC300] text-[#0A3D62] shadow-[0_8px_22px_rgba(255,195,0,0.22)]"
                    : "text-white/75 hover:bg-white/10 hover:text-white",
                )}
              >
                <LogIn
                  size={16}
                  strokeWidth={2}
                  className={cn(
                    "transition-transform duration-200",
                    esLogin &&
                      "translate-x-0.5",
                  )}
                  aria-hidden="true"
                />

                Iniciar sesión
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={!esLogin}
                onClick={() =>
                  onCambiarModo("registro")
                }
                className={cn(
                  "group flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-extrabold uppercase tracking-[0.06em] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]",
                  !esLogin
                    ? "bg-[#FFC300] text-[#0A3D62] shadow-[0_8px_22px_rgba(255,195,0,0.22)]"
                    : "text-white/75 hover:bg-white/10 hover:text-white",
                )}
              >
                <UserPlus
                  size={16}
                  strokeWidth={2}
                  className={cn(
                    "transition-transform duration-200",
                    !esLogin &&
                      "scale-105",
                  )}
                  aria-hidden="true"
                />

                Crear cuenta
              </button>
            </div>
          </div>

          {/* Pie */}
          <footer className="mt-5 flex items-center justify-center gap-2 text-center text-[10px] font-medium text-white/45">
            <ShieldCheck
              size={13}
              className="text-emerald-300/70"
              aria-hidden="true"
            />

            Tus datos se transmiten mediante una conexión segura.
          </footer>
        </div>
      </div>

      {/* Línea decorativa */}
      <div
        className="absolute bottom-0 right-0 top-0 w-1 bg-gradient-to-b from-transparent via-[#FFC300] to-transparent"
        aria-hidden="true"
      />
    </aside>
  );
}

interface BeneficioAccesoProps {
  icono: React.ReactNode;
  titulo: string;
  descripcion: string;
}

function BeneficioAcceso({
  icono,
  titulo,
  descripcion,
}: BeneficioAccesoProps) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FFC300]/30 hover:bg-white/10">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#FFC300] transition-colors duration-200 group-hover:bg-[#FFC300] group-hover:text-[#0A3D62]">
        {icono}
      </span>

      <h2 className="mt-3 text-sm font-extrabold text-white">
        {titulo}
      </h2>

      <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-white/55 xl:text-[11px]">
        {descripcion}
      </p>
    </div>
  );
}