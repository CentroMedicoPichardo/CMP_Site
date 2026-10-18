/**
 * Pruebas A17 sin PostgreSQL ni peticiones HTTP reales.
 * Guardar como tests/a17-offline.test.mjs en CMP_Site.
 * Ejecutar desde la raiz: node --test tests/a17-offline.test.mjs
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const ORIGIN = "http://localhost:3000";
const WEB = "src/app/api/account/web-request/route.ts";
const MOBILE = "src/app/api/account/route.ts";
const ADMIN = "src/app/api/admin/arco/cancelaciones/[id]/desactivar/route.ts";
const LOGIN = "src/app/api/auth/login/route.ts";

function leer(ruta) {
  return readFileSync(resolve(process.cwd(), ruta), "utf8");
}

function respuesta(body, options = {}) {
  return { status: options.status ?? 200, body };
}

function cargarRuta(ruta, { sesion = null, usuario = null, habilitada = false } = {}) {
  const codigo = ts.transpileModule(leer(ruta), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: ruta,
    reportDiagnostics: true,
  });
  const errores = (codigo.diagnostics ?? []).filter(
    (d) => d.category === ts.DiagnosticCategory.Error,
  );
  assert.equal(errores.length, 0, `No se pudo compilar ${ruta}`);

  // Cualquier acceso inesperado a PostgreSQL falla la prueba.
  const prohibido = () => {
    throw new Error("PRUEBA CANCELADA: intento de acceder a PostgreSQL");
  };
  const db = {
    query: { usuarios: { findFirst: async () => usuario } },
    select: prohibido,
    update: prohibido,
    insert: prohibido,
    execute: prohibido,
    transaction: prohibido,
  };
  const respuestaAuth = async () =>
    sesion
      ? { session: sesion, error: null }
      : { session: null, error: respuesta({ message: "No autenticado" }, { status: 401 }) };

  const dependencias = {
    "next/server": { NextResponse: { json: respuesta } },
    "drizzle-orm": {
      eq: (...args) => args,
      and: (...args) => args,
      desc: (arg) => arg,
      inArray: (...args) => args,
      isNull: (arg) => arg,
      like: (...args) => args,
      sql: Object.assign((parts, ...values) => ({ parts, values }), {}),
    },
    bcryptjs: { compare: async () => false },
    jose: { SignJWT: class { constructor() { prohibido(); } } },
    "@/lib/auth": {
      requireApiAuth: respuestaAuth,
      requireApiRole: respuestaAuth,
      normalizeRole: (rol) => (rol ?? "cliente").toLowerCase().trim(),
      AUTH_COOKIE_NAME: "auth_token",
    },
    "@/lib/db": { db },
    "@/lib/schema": {
      usuarios: { id: "id", correo: "correo" },
      preguntasUsuarios: {},
      roles: {},
      auditoriaAcciones: {},
    },
    "@/lib/schema/index": {
      usuarios: { id: "id", correo: "correo" },
      preguntasUsuarios: {},
      roles: {},
      auditoriaAcciones: {},
    },
  };
  const modulo = { exports: {} };
  const requireAislado = (nombre) => {
    if (!Object.hasOwn(dependencias, nombre)) {
      throw new Error(`Dependencia no simulada: ${nombre}`);
    }
    return dependencias[nombre];
  };
  runInNewContext(codigo.outputText, {
    module: modulo,
    exports: modulo.exports,
    require: requireAislado,
    process: { env: { ARCO_DESACTIVACION_HABILITADA: habilitada ? "true" : "false" } },
    console,
    URL,
    TextEncoder,
  }, { filename: ruta, timeout: 3000 });
  return modulo.exports;
}

function peticion({ body = {}, origin = ORIGIN, authorization, contentType = "application/json" } = {}) {
  const valores = new Map();
  if (origin !== null) valores.set("origin", origin);
  if (authorization !== undefined) valores.set("authorization", authorization);
  if (contentType !== null) valores.set("content-type", contentType);
  valores.set("sec-fetch-site", "same-origin");
  return {
    url: `${ORIGIN}/api/a17-prueba`,
    nextUrl: { origin: ORIGIN },
    headers: { get: (nombre) => valores.get(nombre.toLowerCase()) ?? null },
    json: async () => body,
  };
}

const cliente = { user: { id: 7, rol: "cliente" } };
const admin = { user: { id: 9, rol: "admin" } };
const parametros = { params: Promise.resolve({ id: "25" }) };

test("WEB: rechaza una petición de otro origen", async () => {
  const { POST } = cargarRuta(WEB, { sesion: cliente });
  assert.equal((await POST(peticion({ origin: "https://otro-sitio.example" }))).status, 403);
});

test("WEB: exige una sesión autenticada", async () => {
  const { POST } = cargarRuta(WEB);
  assert.equal((await POST(peticion())).status, 401);
});

test("WEB: rechaza cuentas administrativas", async () => {
  const { POST } = cargarRuta(WEB, { sesion: admin });
  assert.equal((await POST(peticion())).status, 403);
});

test("WEB: exige contraseña y confirmación", async () => {
  const { POST } = cargarRuta(WEB, { sesion: cliente });
  assert.equal((await POST(peticion({ body: { contrasena: "clave", confirmacion: false } }))).status, 400);
});

test("MÓVIL: exige un token Bearer", async () => {
  const { DELETE } = cargarRuta(MOBILE, { sesion: cliente });
  assert.equal((await DELETE(peticion())).status, 401);
});

test("MÓVIL: rechaza a administradores", async () => {
  const { DELETE } = cargarRuta(MOBILE, { sesion: admin });
  assert.equal((await DELETE(peticion({ authorization: "Bearer token-simulado" }))).status, 403);
});

test("MÓVIL: exige contraseña y confirmación", async () => {
  const { DELETE } = cargarRuta(MOBILE, { sesion: cliente });
  const req = peticion({ authorization: "Bearer token-simulado", body: { contrasena: "clave", confirmacion: false } });
  assert.equal((await DELETE(req)).status, 400);
});

test("ADMIN: exige una sesión autenticada", async () => {
  const { POST } = cargarRuta(ADMIN);
  assert.equal((await POST(peticion(), parametros)).status, 401);
});

test("ADMIN: rechaza otro origen", async () => {
  const { POST } = cargarRuta(ADMIN, { sesion: admin });
  assert.equal((await POST(peticion({ origin: "https://otro-sitio.example" }), parametros)).status, 403);
});

test("ADMIN: con ejecución deshabilitada no llega a PostgreSQL", async () => {
  const { POST } = cargarRuta(ADMIN, { sesion: admin });
  const req = peticion({ body: { modo: "ejecutar", confirmacion: "DESACTIVAR CUENTA", usuarioIdConfirmado: 7 } });
  const res = await POST(req, parametros);
  assert.equal(res.status, 423);
  assert.equal(res.body.ejecucionHabilitada, false);
});

test("ADMIN: habilitado exige la frase de confirmación exacta", async () => {
  const { POST } = cargarRuta(ADMIN, { sesion: admin, habilitada: true });
  const req = peticion({ body: { modo: "ejecutar", confirmacion: "DESACTIVAR", usuarioIdConfirmado: 7 } });
  assert.equal((await POST(req, parametros)).status, 400);
});

test("LOGIN WEB: una cuenta inactiva se rechaza sin modificarla", async () => {
  const { POST } = cargarRuta(LOGIN, { usuario: { id: 7, correo: "prueba@example.com", activo: false } });
  const req = peticion({ body: { correo: "prueba@example.com", contrasena: "cualquiera" } });
  assert.equal((await POST(req)).status, 403);
});

test("WEB: el marcador se busca literalmente, sin comodines LIKE", () => {
  const fuente = leer(WEB);
  assert.match(fuente, /POSITION\s*\(/);
  assert.match(fuente, /BAJA_LOGICA_CONFIRMADA_WEB/);
});

test("ADMIN: contempla versionToken nulo", () => {
  const fuente = leer(ADMIN);
  assert.match(fuente, /isNull\s*\(\s*usuarios\.versionToken\s*\)/);
});
