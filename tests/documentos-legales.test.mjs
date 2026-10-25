import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync, existsSync} from "node:fs";
import {resolve, dirname} from "node:path";
import {createRequire} from "node:module";
import vm from "node:vm";
import ts from "typescript";
import {PgDialect} from "drizzle-orm/pg-core";

const realRequire = createRequire(import.meta.url);
const API = "src/app/api/legal/[tipo]/route.ts";
const REGISTER = "src/app/api/auth/register/route.ts";
const NAME = Symbol.for("drizzle:Name");
const AVISO = "aviso_privacidad";
const TERMINOS = "terminos_condiciones";

const documento = (idDocumento, tipo, version, extra = {}) => ({
  idDocumento, tipo, version, resumen: `Resumen ${tipo} ${version}`, contenido: `# ${tipo} ${version}\n\nTexto.`,
  vigenteDesde: "2026-10-24 15:30:00.000", activo: true, ...extra,
});
const documentosBase = () => [
  documento(1, AVISO, "1.0"), documento(2, TERMINOS, "1.0"),
];

function environment(options = {}) {
  const state = {documentos: documentosBase(), users: [], aceptaciones: [], rolExiste: true, otpValido: true,
    failDocs: false, failAceptaciones: false, ...options};
  const cache = new Map();
  const dialect = new PgDialect();
  const seen = {logs: [], otpCalls: 0, conditions: []};
  let nextUserId = 100;

  function selectBuilder() {
    const q = {};
    const builder = {
      from(table) {q.table = table[NAME]; return builder;},
      where(condition) {q.cond = dialect.sqlToQuery(condition); seen.conditions.push({table: q.table, query: q.cond}); return builder;},
      limit() {return builder;},
      then(resolveFn, rejectFn) {
        return Promise.resolve().then(() => {
          if (state.failDocs && q.table === "documentos_legales") throw new Error("private failure");
          if (q.table === "documentos_legales") {
            assert.match(q.cond.sql, /"activo" = \$/);
            assert.ok(q.cond.params.includes(true));
            if (/ in \(/.test(q.cond.sql)) {
              assert.ok(q.cond.params.includes(AVISO) && q.cond.params.includes(TERMINOS));
              return state.documentos.filter(d => d.activo).map(d => ({idDocumento: d.idDocumento, tipo: d.tipo}));
            }
            const tipo = q.cond.params.find(p => p === AVISO || p === TERMINOS);
            const d = state.documentos.find(x => x.activo && x.tipo === tipo);
            return d ? [{version: d.version, resumen: d.resumen, contenido: d.contenido, vigenteDesde: d.vigenteDesde}] : [];
          }
          if (q.table === "usuarios") return state.users.filter(u => u.correo === q.cond.params[0]).map(u => ({id: u.id}));
          if (q.table === "roles") return state.rolExiste ? [{id: 1}] : [];
          assert.fail("tabla inesperada " + q.table);
        }).then(resolveFn, rejectFn);
      },
    };
    return builder;
  }

  function txApi() {
    return {
      insert(table) {
        const name = table[NAME];
        return {
          values(v) {
            const rows = Array.isArray(v) ? v : [v];
            const apply = () => {
              if (name === "usuarios") {
                const row = {id: nextUserId++, ...rows[0]};
                state.users.push(row);
                return [row];
              }
              if (name === "aceptaciones_legales") {
                if (state.failAceptaciones) throw new Error("fallo al guardar la aceptacion");
                for (const r of rows) state.aceptaciones.push({...r, fechaAceptacion: "now"});
                return [];
              }
              assert.fail("insert inesperado en " + name);
            };
            return {
              returning: async () => apply(),
              then(resolveFn, rejectFn) {return Promise.resolve().then(apply).then(resolveFn, rejectFn);},
            };
          },
        };
      },
    };
  }

  const db = {
    select: () => selectBuilder(),
    async transaction(callback) {
      const snapshot = structuredClone({users: state.users, aceptaciones: state.aceptaciones});
      try {
        return await callback(txApi());
      } catch (error) {
        state.users = snapshot.users; state.aceptaciones = snapshot.aceptaciones;
        throw error;
      }
    },
  };

  const fakeOtp = {
    otpMemoria: new Map(),
    verificarOTP: () => {seen.otpCalls++; return state.otpValido ? {valido: true, mensaje: "ok"} : {valido: false, mensaje: "Codigo incorrecto"};},
  };
  const fakeBcrypt = {genSalt: async () => "salt", hash: async () => "hash-de-prueba"};

  function load(name) {
    const path = resolve(name);
    if (cache.has(path)) return cache.get(path).exports;
    const loadedModule = {exports: {}}; cache.set(path, loadedModule);
    const output = ts.transpileModule(readFileSync(path, "utf8"), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true}, fileName: path}).outputText;
    const require = spec => {
      if (spec === "@/lib/db") return {db};
      if (spec === "@/lib/otpStore") return fakeOtp;
      if (spec === "bcryptjs") return {default: fakeBcrypt, ...fakeBcrypt};
      if (spec === "next/server") return {NextResponse: {json: (body, init) => Response.json(body, init)}};
      if (spec.startsWith("@/") || spec.startsWith(".")) {
        let target = spec.startsWith("@/") ? resolve("src", spec.slice(2)) : resolve(dirname(path), spec);
        if (!/\.tsx?$/.test(target)) {try {readFileSync(target + ".ts"); target += ".ts";} catch {target += "/index.ts";}}
        return load(target);
      }
      assert.ok(!["postgres", "pg", "next/headers", "jose"].includes(spec), "unexpected dependency " + spec);
      return realRequire(spec);
    };
    vm.runInNewContext(output, {module: loadedModule, exports: loadedModule.exports, require, URL, Response, Request, Headers, Date,
      console: {error: (...args) => seen.logs.push(args), log: (...args) => seen.logs.push(args)}, process: {env: {}}, TextEncoder, Buffer},
    {filename: path});
    return loadedModule.exports;
  }

  const getLegal = tipo => load(API).GET(new Request("https://cmp.test/api/legal/" + tipo), {params: Promise.resolve({tipo})});
  const body = (extra = {}) => ({codigoVerificacion: "123456", nombre: "Ana", apellidoPaterno: "Lopez", apellidoMaterno: "Diaz",
    edad: 30, sexo: "femenino", telefono: "7711408883", correo: "ana@example.com", contrasena: "ClaveSegura7#x", ...extra});
  const register = payload => load(REGISTER).POST(new Request("https://cmp.test/api/auth/register", {
    method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify(payload ?? body())}));
  return {state, seen, getLegal, register, body, load};
}

// ---------- GET /api/legal/[tipo] ----------

test("GET devuelve el documento vigente con el contrato exacto y cache publico", async () => {
  const env = environment();
  const response = await env.getLegal(AVISO);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "public, max-age=300");
  assert.deepEqual(await response.json(), {
    tipo: AVISO, version: "1.0", resumen: "Resumen aviso_privacidad 1.0", contenido: "# aviso_privacidad 1.0\n\nTexto.",
    vigenteDesde: "2026-10-24T15:30:00.000Z",
  });
  const terminos = await (await env.getLegal(TERMINOS)).json();
  assert.equal(terminos.tipo, TERMINOS);
});

test("GET devuelve solo la version activa aunque existan versiones anteriores", async () => {
  const env = environment({documentos: [documento(1, AVISO, "1.0", {activo: false}), documento(3, AVISO, "1.1"), documento(2, TERMINOS, "1.0")]});
  const body = await (await env.getLegal(AVISO)).json();
  assert.equal(body.version, "1.1");
});

for (const tipo of ["", "otro", "AVISO_PRIVACIDAD", "aviso_privacidad ", "aviso-privacidad", "../etc/passwd", "aviso_privacidad;--", "terminos"]) {
  test("GET responde 400 con tipo invalido " + JSON.stringify(tipo), async () => {
    const env = environment();
    const response = await env.getLegal(tipo);
    assert.equal(response.status, 400);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(env.seen.conditions.length, 0);
  });
}

test("GET responde 404 sin cache si no hay documento vigente de ese tipo", async () => {
  const env = environment({documentos: [documento(1, AVISO, "1.0", {activo: false}), documento(2, TERMINOS, "1.0")]});
  const response = await env.getLegal(AVISO);
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), {message: "No hay un documento vigente de este tipo"});
});

test("GET responde 500 generico sin filtrar detalles ni cachear", async () => {
  const env = environment({failDocs: true});
  const response = await env.getLegal(AVISO);
  assert.equal(response.status, 500);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.ok(!(await response.text()).includes("private failure"));
  assert.ok(env.seen.logs.length > 0);
});

test("el endpoint es publico: no importa ni usa autenticacion", () => {
  const source = readFileSync(API, "utf8");
  assert.doesNotMatch(source, /@\/lib\/auth|requireApi|auth\(\)/);
});

// ---------- registro: aceptacion versionada ----------

test("registro exitoso guarda el usuario y una aceptacion por cada documento vigente", async () => {
  const env = environment({documentos: [...documentosBase(), documento(7, AVISO, "0.9", {activo: false})]});
  const response = await env.register();
  assert.equal(response.status, 201);
  const json = await response.json();
  assert.ok(!("contrasena" in json.usuario));
  assert.equal(env.state.users.length, 1);
  const usuarioId = env.state.users[0].id;
  assert.deepEqual(env.state.aceptaciones.map(a => ({usuarioId: a.usuarioId, idDocumento: a.idDocumento})).sort((a, b) => a.idDocumento - b.idDocumento),
    [{usuarioId, idDocumento: 1}, {usuarioId, idDocumento: 2}]);
  assert.equal(env.seen.otpCalls, 1);
});

test("registro bloqueado (500) si falta el aviso o los terminos vigentes, sin consumir el OTP ni crear usuario", async () => {
  for (const documentos of [[], [documento(1, AVISO, "1.0")], [documento(2, TERMINOS, "1.0")],
    [documento(1, AVISO, "1.0", {activo: false}), documento(2, TERMINOS, "1.0")]]) {
    const env = environment({documentos});
    const response = await env.register();
    assert.equal(response.status, 500);
    assert.ok(!JSON.stringify(await response.json()).includes("aviso_privacidad"));
    assert.equal(env.seen.otpCalls, 0);
    assert.equal(env.state.users.length, 0);
    assert.equal(env.state.aceptaciones.length, 0);
    assert.ok(env.seen.logs.length > 0);
  }
});

test("si falla guardar la aceptacion se revierte la creacion del usuario (misma transaccion)", async () => {
  const env = environment({failAceptaciones: true});
  const response = await env.register();
  assert.equal(response.status, 500);
  assert.equal(env.state.users.length, 0);
  assert.equal(env.state.aceptaciones.length, 0);
});

test("registro rechazado (OTP invalido, correo duplicado, datos incompletos) no guarda aceptaciones", async () => {
  const otp = environment({otpValido: false});
  assert.equal((await otp.register()).status, 400);
  const duplicado = environment({users: [{id: 1, correo: "ana@example.com"}]});
  assert.equal((await duplicado.register()).status, 409);
  const incompleto = environment();
  assert.equal((await incompleto.register(incompleto.body({nombre: ""}))).status, 400);
  for (const env of [otp, duplicado, incompleto]) assert.equal(env.state.aceptaciones.length, 0);
  assert.equal(incompleto.seen.otpCalls, 0);
});

test("el registro falla con 500 generico si no puede consultar los documentos", async () => {
  const env = environment({failDocs: true});
  const response = await env.register();
  assert.equal(response.status, 500);
  assert.ok(!(await response.text()).includes("private failure"));
  assert.equal(env.state.users.length, 0);
});

// ---------- migracion, seed y snapshot ----------

const SQL = readFileSync("drizzle/0005_documentos_legales.sql", "utf8");

test("migracion 0005: tablas, restricciones e indice unico parcial del documento activo", () => {
  assert.match(SQL, /CREATE TABLE IF NOT EXISTS "seguridad"\."documentos_legales"/);
  assert.match(SQL, /CREATE TABLE IF NOT EXISTS "seguridad"\."aceptaciones_legales"/);
  assert.match(SQL, /CONSTRAINT "uq_documento_legal_tipo_version" UNIQUE\("tipo","version"\)/);
  assert.match(SQL, /CONSTRAINT "chk_documento_legal_tipo" CHECK \(\(tipo\)::text = ANY \(\(ARRAY\['aviso_privacidad'::character varying, 'terminos_condiciones'::character varying\]\)::text\[\]\)\)/);
  assert.match(SQL, /CREATE UNIQUE INDEX IF NOT EXISTS "idx_documento_legal_activo_unico" ON "seguridad"\."documentos_legales" USING btree \("tipo" text_ops\) WHERE \(activo = true\)/);
  assert.match(SQL, /CONSTRAINT "uq_aceptacion_usuario_documento" UNIQUE\("usuario_id","id_documento"\)/);
  assert.match(SQL, /"usuario_id"\) REFERENCES "seguridad"\."usuarios"\("id"\) ON DELETE cascade/);
  assert.match(SQL, /"id_documento"\) REFERENCES "seguridad"\."documentos_legales"\("id_documento"\)/);
  assert.match(SQL, /CREATE INDEX IF NOT EXISTS "idx_aceptaciones_legales_usuario"/);
  assert.match(SQL, /"id_aceptacion" bigserial PRIMARY KEY/);
  // Sin sentencias destructivas (fuera del texto de los documentos sembrados).
  const sinTextos = SQL.replace(/\$(AVISO|TERMINOS)\$[\s\S]*?\$\1\$/g, "''");
  assert.doesNotMatch(sinTextos, /\bDROP\b|\bDELETE FROM\b|\bTRUNCATE\b|\bUPDATE\s+"|ALTER TABLE/i);
});

test("seed: version 1.0 de ambos documentos, activos, idempotente y sin reescribir el contenido aprobado", () => {
  assert.match(SQL, /'aviso_privacidad',\s*'1\.0'/);
  assert.match(SQL, /'terminos_condiciones',\s*'1\.0'/);
  assert.match(SQL, /WHERE NOT EXISTS \(\s*SELECT 1\s*FROM "seguridad"\."documentos_legales" d\s*WHERE d\.tipo = v\.tipo AND d\.version = v\.version\s*\)/);
  const aviso = /\$AVISO\$([\s\S]*?)\$AVISO\$/.exec(SQL)[1];
  const terminos = /\$TERMINOS\$([\s\S]*?)\$TERMINOS\$/.exec(SQL)[1];
  assert.match(aviso, /^\n# Aviso de Privacidad\n## CMP Móvil — Centro Médico Pichardo\n/);
  assert.equal((aviso.match(/^## \d+\. /gm) ?? []).length, 10);
  assert.match(aviso, /\*\*Versión de este Aviso: 1\.0\*\*, vigente desde la fecha indicada en esta página\.\n$/);
  assert.match(aviso, /\| Vercel Inc\. \|/);
  assert.match(terminos, /^\n# Términos y Condiciones de Uso\n## CMP Móvil — Centro Médico Pichardo\n/);
  assert.equal((terminos.match(/^## \d+\. /gm) ?? []).length, 12);
  assert.match(terminos, /## 5\. Cancelaciones y reembolsos\n\nEl Centro dará a conocer su política de cancelaciones y reembolsos de cursos a través de esta misma sección en cuanto esté definida\./);
  assert.match(terminos, /\*\*Versión de estos Términos: 1\.0\*\*, vigente desde la fecha indicada en esta página\.\n$/);
  assert.match(SQL, /Puedes ejercer tus derechos ARCO y oponerte a los usos secundarios desde Mi cuenta\./);
  assert.match(SQL, /el uso indebido de la app puede dar lugar a la suspensión de tu cuenta\./);
});

test("snapshot 0005 conserva el historial y solo agrega las dos tablas; journal consistente", () => {
  const previous = JSON.parse(readFileSync("drizzle/meta/0004_snapshot.json", "utf8"));
  const current = JSON.parse(readFileSync("drizzle/meta/0005_snapshot.json", "utf8"));
  assert.equal(current.prevId, previous.id);
  assert.notEqual(current.id, previous.id);
  assert.ok(current.tables["seguridad.documentos_legales"].indexes.idx_documento_legal_activo_unico.isUnique);
  assert.equal(current.tables["seguridad.documentos_legales"].indexes.idx_documento_legal_activo_unico.where, "(activo = true)");
  assert.ok(current.tables["seguridad.aceptaciones_legales"].foreignKeys.fk_aceptacion_legal_usuario.onDelete === "cascade");
  delete current.tables["seguridad.documentos_legales"];
  delete current.tables["seguridad.aceptaciones_legales"];
  for (const field of ["id", "prevId"]) {delete current[field]; delete previous[field];}
  assert.deepEqual(current, previous);
  const journal = JSON.parse(readFileSync("drizzle/meta/_journal.json", "utf8")).entries;
  assert.equal(journal.at(-1).tag, "0005_documentos_legales");
  assert.equal(journal.at(-1).idx, journal.length - 1);
});

test("rollback 0005 protege las aceptaciones registradas", () => {
  const rollback = readFileSync("drizzle/rollback/0005_documentos_legales.sql", "utf8");
  assert.match(rollback, /Rollback rechazado: hay aceptaciones legales registradas/);
  assert.match(rollback, /DROP TABLE IF EXISTS seguridad\.aceptaciones_legales;\s*DROP TABLE IF EXISTS seguridad\.documentos_legales;/);
});

// ---------- paginas publicas y formulario ----------

test("el contenido markdown del seed se renderiza (encabezados, tabla) y el HTML crudo no se ejecuta", async () => {
  const React = realRequire("react");
  const {renderToStaticMarkup} = realRequire("react-dom/server");
  const {default: ReactMarkdown} = await import("react-markdown");
  const {default: remarkGfm} = await import("remark-gfm");
  const render = text => renderToStaticMarkup(React.createElement(ReactMarkdown, {remarkPlugins: [remarkGfm]}, text));
  const aviso = render(/\$AVISO\$([\s\S]*?)\$AVISO\$/.exec(SQL)[1]);
  assert.match(aviso, /<h1>Aviso de Privacidad<\/h1>/);
  assert.match(aviso, /<h2>1\. Identidad y domicilio del responsable<\/h2>/);
  assert.match(aviso, /<table>/);
  assert.match(aviso, /<td>Vercel Inc\.<\/td>/);
  assert.match(aviso, /<strong>Centro Médico Pichardo<\/strong>/);
  const hostil = render("Hola <script>alert(1)</script> [x](javascript:alert(1)) <img src=x onerror=alert(1)>");
  // El HTML crudo queda como texto escapado y el enlace javascript: se descarta.
  assert.doesNotMatch(hostil, /<script|<img/i);
  assert.doesNotMatch(hostil, /href="javascript:/i);
  assert.match(hostil, /&lt;script&gt;/);
});

test("paginas /privacidad y /terminos existen, usan el documento correcto y el Footer las enlaza", () => {
  const privacidad = readFileSync("src/app/(public)/privacidad/page.tsx", "utf8");
  const terminos = readFileSync("src/app/(public)/terminos/page.tsx", "utf8");
  assert.match(privacidad, /<DocumentoLegal tipo="aviso_privacidad" \/>/);
  assert.match(terminos, /<DocumentoLegal tipo="terminos_condiciones" \/>/);
  const footer = readFileSync("src/components/layout/Footer.tsx", "utf8");
  assert.match(footer, /href="\/privacidad"/);
  assert.match(footer, /href="\/terminos"/);
  const routes = readFileSync("src/config/routes.ts", "utf8");
  assert.match(routes, /privacidad: "\/privacidad"/);
  assert.match(routes, /terminos: "\/terminos"/);
  assert.ok(existsSync("src/components/public/legal/DocumentoLegal.tsx"));
});

test("el formulario de registro web muestra el resumen junto a la casilla con 'Ver más' en otra pestana, sin modal", () => {
  const form = readFileSync("src/components/public/auth/RegisterForm.tsx", "utf8");
  assert.match(form, /import \{ ResumenLegalRegistro \} from "@\/components\/public\/legal\/ResumenLegalRegistro"/);
  assert.match(form, /<\/label>\s*<ResumenLegalRegistro \/>/);
  const resumen = readFileSync("src/components/public/legal/ResumenLegalRegistro.tsx", "utf8");
  assert.match(resumen, /\/api\/legal\/\$\{tipo\}/);
  assert.match(resumen, /href: "\/privacidad"/);
  assert.match(resumen, /href: "\/terminos"/);
  assert.match(resumen, /target="_blank"/);
  assert.match(resumen, /rel="noopener noreferrer"/);
  assert.match(resumen, /Ver más/);
  assert.doesNotMatch(resumen, /role="dialog"|aria-modal|<dialog|fixed inset|createPortal/);
});
