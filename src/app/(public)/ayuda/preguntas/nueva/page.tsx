import { requireAuth } from "@/lib/auth";
import NuevaPreguntaAyuda from "@/components/public/ayuda/NuevaPreguntaAyuda";

export default async function NuevaPreguntaAyudaPage() {
  await requireAuth(
    "/acceder?redirect=/ayuda/preguntas/nueva",
  );

  return <NuevaPreguntaAyuda />;
}
