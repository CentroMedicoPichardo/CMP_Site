export type PublicSection = "empresa" | "nosotros" | "servicios" | "medicos";

const DB_NAME = "cmp-public-offline";
const STORE_NAME = "sections";
const IMAGE_CACHE = "cmp-public-images-v1";
const MAX_IMAGES = 50;
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_SINGLE_IMAGE_BYTES = 2 * 1024 * 1024;
const LOCAL_PUBLIC_IMAGES = new Set([
  "/logo.png", "/Pichardo.jpg", "/headerquienesomos.png", "/headerimg.png",
  "/headermedico.png", "/no_imagen_uwvduy.png", "/pediatric-illustration.png",
]);

const ENDPOINTS: Record<PublicSection, string> = {
  empresa: "/api/empresa-info",
  nosotros: "/api/nosotros",
  servicios: "/api/servicios",
  medicos: "/api/medicos",
};

const SECTIONS: PublicSection[] = ["empresa", "nosotros", "servicios", "medicos"];

type RecordValue = Record<string, unknown>;

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function publicImage(value: unknown): string | null {
  const source = text(value);
  if (!source || source === "no_imagen_uwvduy" || source.includes("default-doctor.jpg") || source.includes("default-service.jpg")) {
    return null;
  }
  if (LOCAL_PUBLIC_IMAGES.has(source)) return source;
  try {
    const url = new URL(source);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com" ? url.href : null;
  } catch {
    return null;
  }
}

export function sanitizePublicSection(section: PublicSection, value: unknown): unknown {
  if (section === "empresa") {
    if (!isRecord(value)) throw new Error("Ficha de empresa inválida");
    const company = {
      nombre: text(value.nombre),
      direccion: text(value.direccion),
      telefono: text(value.telefono),
      correo: text(value.correo),
      horario: text(value.horario),
    };
    if (!company.nombre || !company.direccion || !company.telefono || !company.correo || !company.horario) {
      throw new Error("Ficha de empresa incompleta");
    }
    return company;
  }

  if (section === "nosotros") {
    if (!isRecord(value) || !Array.isArray(value.valores)) throw new Error("Información institucional inválida");
    const about = {
      nuestraHistoria: text(value.nuestraHistoria),
      compromiso: text(value.compromiso),
      mision: text(value.mision),
      vision: text(value.vision),
      valores: value.valores.map(text).filter(Boolean),
      imagen: publicImage(value.urlImagen),
    };
    if (!about.nuestraHistoria || !about.mision || !about.vision) throw new Error("Información institucional incompleta");
    return about;
  }

  if (section === "servicios") {
    if (!Array.isArray(value)) throw new Error("Lista de servicios inválida");
    return value.map((item) => {
      if (!isRecord(item) || typeof item.idServicio !== "number" || !text(item.tituloServicio)) {
        throw new Error("Servicio inválido");
      }
      return {
        id: item.idServicio,
        titulo: text(item.tituloServicio),
        descripcion: text(item.descripcion),
        imagen: publicImage(item.urlImage),
      };
    });
  }

  if (!Array.isArray(value)) throw new Error("Directorio médico inválido");
  return value.map((item) => {
    if (!isRecord(item) || typeof item.idMedico !== "number") throw new Error("Médico inválido");
    const nombre = [item.nombres, item.apellidoPaterno, item.apellidoMaterno].map(text).filter(Boolean).join(" ");
    if (!nombre) throw new Error("Nombre médico inválido");
    return {
      id: item.idMedico,
      nombre,
      especialidad: text(item.especialidad),
      imagen: publicImage(item.urlFoto),
    };
  });
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readKeys(): Promise<Set<string>> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAllKeys();
    request.onsuccess = () => resolve(new Set(request.result.map(String)));
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

async function saveSection(key: PublicSection, data: unknown): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put({ key, updatedAt: new Date().toISOString(), data });
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => { database.close(); reject(transaction.error); };
  });
}

async function savePublicImage(source: string): Promise<void> {
  if (!("caches" in window)) return;
  const cache = await caches.open(IMAGE_CACHE);
  if (await cache.match(source)) return;

  const response = await fetch(source, { mode: "cors", credentials: "omit" });
  if (!response.ok || response.type === "opaque" || !response.headers.get("Content-Type")?.startsWith("image/")) return;
  const blob = await response.blob();
  if (!blob.size || blob.size > MAX_SINGLE_IMAGE_BYTES) return;

  const keys = [...await cache.keys()];
  let totalBytes = 0;
  for (const key of keys) {
    const saved = await cache.match(key);
    if (saved) totalBytes += (await saved.blob()).size;
  }
  while (keys.length >= MAX_IMAGES || totalBytes + blob.size > MAX_IMAGE_BYTES) {
    const oldest = keys.shift();
    if (!oldest) break;
    const saved = await cache.match(oldest);
    if (saved) totalBytes -= (await saved.blob()).size;
    await cache.delete(oldest);
  }
  await cache.put(source, new Response(blob, { headers: { "Content-Type": blob.type } }));
}

async function saveSectionImages(data: unknown): Promise<void> {
  const images: string[] = [];
  if (Array.isArray(data)) {
    for (const item of data) if (isRecord(item) && typeof item.imagen === "string") images.push(item.imagen);
  } else if (isRecord(data) && typeof data.imagen === "string") {
    images.push(data.imagen);
  }
  for (const source of images) {
    try { await savePublicImage(source); } catch { /* La copia textual sigue disponible. */ }
  }
}

let syncing = false;

export async function syncPublicSnapshots(pathname: string): Promise<void> {
  if (syncing || !navigator.onLine || !("indexedDB" in window)) return;
  syncing = true;
  try {
    const saved = await readKeys().catch(() => new Set<string>());
    const priority: PublicSection[] = pathname === "/quienes-somos"
      ? ["empresa", "nosotros"]
      : pathname === "/servicios"
        ? ["servicios"]
        : pathname === "/directorio-medico"
          ? ["medicos"]
          : SECTIONS;
    const targets = SECTIONS.filter((section) => priority.includes(section) || !saved.has(section));
    await Promise.all(targets.map(async (section) => {
      try {
        const response = await fetch(ENDPOINTS[section], {
          cache: "no-store",
          credentials: "omit",
          headers: { Accept: "application/json" },
        });
        if (!response.ok || !response.headers.get("Content-Type")?.includes("application/json")) return;
        const data = sanitizePublicSection(section, await response.json());
        await saveSection(section, data);
        await saveSectionImages(data);
      } catch {
        // Mantener la última copia correcta cuando la red o el almacenamiento fallen.
      }
    }));
  } finally {
    syncing = false;
  }
}
