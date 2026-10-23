import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {createRequire} from "node:module";
import vm from "node:vm";
import ts from "typescript";

const realRequire = createRequire(import.meta.url);
const ROUTE = "src/app/api/profile/privacy-preferences/route.ts";

function environment(options = {}) {
  const state = {user: 5, row: null, fail: false, ...options};
  const seen = {writes: [], conflicts: [], wheres: 0, logs: []};
  const builder = {
    from() {return this;},
    where() {seen.wheres++; return this;},
    async limit() {
      if (state.fail) throw new Error("private failure");
      return state.row ? [state.row] : [];
    },
    values(data) {seen.writes.push(data); this.data = data; return this;},
    onConflictDoUpdate(config) {seen.conflicts.push(config); return this;},
    async returning() {
      if (state.fail) throw new Error("private failure");
      const d = this.data;
      state.row = {usuarioId: d.usuarioId, comunicacionesNoEsenciales: d.comunicacionesNoEsenciales,
        analitica: d.analitica, compartirProgreso: d.compartirProgreso,
        // postgres devuelve timestamp sin zona como "YYYY-MM-DD HH:mm:ss.SSS"
        updatedAt: d.updatedAt.replace("T", " ").replace("Z", "")};
      return [state.row];
    },
  };
  const db = {select() {return Object.create(builder);}, insert() {return Object.create(builder);}};
  const session = () => state.user ? {user: {id: state.user, rol: "cliente", correo: "fixture@example.com"}} : null;
  const fakeAuth = {requireApiAuth: async () => ({
    session: session(),
    error: state.user ? null : Response.json({message: "No autenticado"}, {status: 401}),
  })};
  let route;
  function load() {
    if (route) return route;
    const path = resolve(ROUTE);
    const loadedModule = {exports: {}};
    const output = ts.transpileModule(readFileSync(path, "utf8"), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true}, fileName: path}).outputText;
    const require = spec => {
      if (spec === "@/lib/db") return {db};
      if (spec === "@/lib/auth") return fakeAuth;
      if (spec === "@/lib/schema") return {preferenciasPrivacidad: {usuarioId: "usuarioId"}};
      if (spec === "next/server") return {NextResponse: {json: (body, init) => Response.json(body, init)}};
      if (spec === "drizzle-orm") return {eq: () => ({})};
      // Ningun cliente real de base de datos ni transporte puede cargarse.
      assert.ok(!["postgres", "pg", "jose", "next/headers"].includes(spec), "unexpected I/O dependency " + spec);
      return realRequire(spec);
    };
    vm.runInNewContext(output, {module: loadedModule, exports: loadedModule.exports, require, Response, Request, Headers, Date,
      console: {error: (...args) => seen.logs.push(args), log: (...args) => seen.logs.push(args)}}, {filename: path});
    route = loadedModule.exports;
    return route;
  }
  const url = "https://cmp.test/api/profile/privacy-preferences";
  const get = () => load().GET(new Request(url));
  const put = body => load().PUT(new Request(url, {
    method: "PUT", headers: {"content-type": "application/json"},
    body: typeof body === "string" ? body : JSON.stringify(body)}));
  return {state, seen, get, put};
}

const ALL_TRUE = {nonEssentialCommunications: true, analytics: true, shareProgress: true};

test("GET sin sesion devuelve 401 sin consultar la base", async () => {
  const env = environment({user: 0});
  const response = await env.get();
  assert.equal(response.status, 401);
  assert.equal(env.seen.wheres, 0);
});

test("PUT sin sesion devuelve 401 sin escribir", async () => {
  const env = environment({user: 0});
  const response = await env.put(ALL_TRUE);
  assert.equal(response.status, 401);
  assert.equal(env.seen.writes.length, 0);
});

test("GET sin preferencias guardadas devuelve tres false y updatedAt null", async () => {
  const response = await environment().get();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /no-store/);
  assert.deepEqual(await response.json(), {
    preferences: {nonEssentialCommunications: false, analytics: false, shareProgress: false},
    updatedAt: null,
  });
});

test("GET devuelve lo guardado con updatedAt en ISO 8601 UTC", async () => {
  const env = environment({row: {usuarioId: 5, comunicacionesNoEsenciales: true, analitica: false,
    compartirProgreso: true, updatedAt: "2026-10-22 18:30:15.123"}});
  const body = await (await env.get()).json();
  assert.deepEqual(body, {
    preferences: {nonEssentialCommunications: true, analytics: false, shareProgress: true},
    updatedAt: "2026-10-22T18:30:15.123Z",
  });
});

test("PUT guarda para el usuario de la sesion (upsert) y responde como GET", async () => {
  const env = environment({user: 7});
  const response = await env.put({nonEssentialCommunications: true, analytics: false, shareProgress: true});
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /no-store/);
  const body = await response.json();
  assert.deepEqual(body.preferences, {nonEssentialCommunications: true, analytics: false, shareProgress: true});
  assert.equal(new Date(body.updatedAt).toISOString(), body.updatedAt);
  assert.equal(env.seen.writes.length, 1);
  assert.equal(env.seen.writes[0].usuarioId, 7);
  assert.equal(env.seen.conflicts.length, 1);
  assert.deepEqual(await (await env.get()).json(), body);
});

for (const [name, body] of [
  ["falta nonEssentialCommunications", {analytics: true, shareProgress: true}],
  ["falta analytics", {nonEssentialCommunications: true, shareProgress: true}],
  ["falta shareProgress", {nonEssentialCommunications: true, analytics: true}],
  ["cuerpo vacio", {}],
  ["string en lugar de boolean", {...ALL_TRUE, analytics: "true"}],
  ["numero en lugar de boolean", {...ALL_TRUE, shareProgress: 1}],
  ["null", {...ALL_TRUE, nonEssentialCommunications: null}],
  ["campo extra", {...ALL_TRUE, extra: true}],
  ["usuarioId en el cuerpo", {...ALL_TRUE, usuarioId: 1}],
  ["arreglo", [true, true, true]],
  ["JSON invalido", "{no es json"],
  ["valor no objeto", "true"],
]) {
  test("PUT rechaza con 400: " + name, async () => {
    const env = environment();
    const response = await env.put(body);
    assert.equal(response.status, 400);
    assert.equal(env.seen.writes.length, 0);
    assert.match(response.headers.get("cache-control"), /no-store/);
  });
}

test("errores de base de datos devuelven 500 sin filtrar detalles", async () => {
  for (const method of ["get", "put"]) {
    const env = environment({fail: true});
    const response = await (method === "get" ? env.get() : env.put(ALL_TRUE));
    assert.equal(response.status, 500);
    assert.ok(!(await response.text()).includes("private failure"));
  }
});

test("migracion 0003 es idempotente, solo crea la tabla y el snapshot conserva el historial", () => {
  const previous = JSON.parse(readFileSync("drizzle/meta/0002_snapshot.json", "utf8"));
  const current = JSON.parse(readFileSync("drizzle/meta/0003_snapshot.json", "utf8"));
  assert.equal(current.prevId, previous.id);
  assert.notEqual(current.id, previous.id);
  assert.ok(current.tables["seguridad.preferencias_privacidad"]);
  delete current.tables["seguridad.preferencias_privacidad"];
  for (const field of ["id", "prevId"]) {delete current[field]; delete previous[field];}
  assert.deepEqual(current, previous);
  const migration = readFileSync("drizzle/0003_preferencias_privacidad.sql", "utf8");
  assert.match(migration, /CREATE TABLE IF NOT EXISTS "seguridad"\."preferencias_privacidad"/);
  assert.match(migration, /REFERENCES "seguridad"\."usuarios"\("id"\) ON DELETE cascade/);
  assert.doesNotMatch(migration, /DROP|DELETE FROM|ALTER TABLE/i);
});
