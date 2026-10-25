import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {resolve, dirname} from "node:path";
import {createRequire} from "node:module";
import vm from "node:vm";
import ts from "typescript";
import {PgDialect} from "drizzle-orm/pg-core";

const realRequire = createRequire(import.meta.url);
const ROUTE = "src/app/api/sistema/jobs/anonimizar-cuentas/route.ts";
const SECRET = "secreto-de-prueba-del-job";
const NOW = new Date("2026-10-24T12:00:00Z");
const NOW_STR = "2026-10-24 12:00:00.000";
const monthsAgo = n => new Date(NOW.getTime() - n * 30.44 * 24 * 3600 * 1000);

const usuario = (id, extra = {}) => ({
  id, nombre: "Maria " + id, apellidoPaterno: "Lopez", apellidoMaterno: "Diaz", edad: 33, sexo: "femenino",
  telefono: "5551234567", correo: `maria${id}@example.com`, contrasena: "$2a$12$hashoriginal" + id, rolId: 2,
  resetToken: "tok" + id, resetTokenExpiry: "2026-10-30 00:00:00", intentosFallidos: 3, bloqueadoHasta: "2026-10-30 00:00:00",
  versionToken: 4, mfaHabilitado: true, secretoMfa: "SECRETO" + id, activo: false, fechaAnonimizacion: null, ...extra,
});
const baja = (registroId, fechaHora, extra = {}) => ({accion: "ARCO_BAJA_LOGICA", tablaAfectada: "seguridad.usuarios", registroId, fechaHora, ...extra});

function escenario() {
  return {
    users: [
      usuario(1), usuario(2), usuario(3), usuario(4, {activo: true}), usuario(5, {fechaAnonimizacion: "2026-01-01 00:00:00"}),
      usuario(6), usuario(7), usuario(8), usuario(9),
    ],
    audit: [
      baja(1, monthsAgo(20)),
      baja(2, monthsAgo(30)), baja(2, monthsAgo(19)),          // la mas reciente tambien cumple
      baja(3, monthsAgo(6)),                                    // retencion no cumplida
      baja(4, monthsAgo(24)),                                   // sigue activa
      baja(5, monthsAgo(24)),                                   // ya anonimizada
      // 6: sin fila de auditoria
      baja(7, monthsAgo(24), {accion: "OTRA_ACCION"}),          // otra accion
      baja(8, monthsAgo(30)), baja(8, monthsAgo(3)),            // la mas reciente no cumple
      baja(9, monthsAgo(24), {tablaAfectada: "seguridad.roles"}), // otra tabla
    ],
  };
}
const ELEGIBLES = [1, 2];

function environment(options = {}) {
  const state = {...escenario(), secret: SECRET, habilitada: "true", failList: false, failAuditFor: null,
    onLock: null, realBcrypt: false, ...options};
  const cache = new Map();
  const dialect = new PgDialect();
  const seen = {locks: [], conditions: [], hashCalls: [], logs: [], transactions: 0, writes: 0};
  const env = {ARCO_ANONIMIZACION_JOB_SECRET: state.secret, ARCO_ANONIMIZACION_HABILITADA: state.habilitada};
  if (state.secret === undefined) delete env.ARCO_ANONIMIZACION_JOB_SECRET;
  if (state.habilitada === undefined) delete env.ARCO_ANONIMIZACION_HABILITADA;

  const isSql = value => typeof value === "object" && value !== null && "queryChunks" in value;
  function ultimaBaja(id) {
    const fechas = state.audit.filter(a => a.accion === "ARCO_BAJA_LOGICA" && a.tablaAfectada === "seguridad.usuarios" && a.registroId === id).map(a => a.fechaHora);
    return fechas.length ? new Date(Math.max(...fechas)) : null;
  }
  function elegible(user) {
    const fecha = user && ultimaBaja(user.id);
    return !!user && user.activo === false && user.fechaAnonimizacion === null && !!fecha && fecha <= new Date(NOW.getTime() - 18 * 30.4375 * 24 * 3600 * 1000);
  }
  // La condicion SQL real debe contener cada requisito del criterio de elegibilidad.
  function inspeccionar(query) {
    seen.conditions.push(query);
    assert.match(query.sql, /"activo" = \$/);
    assert.match(query.sql, /"fecha_anonimizacion" is null/);
    assert.match(query.sql, /max\("seguridad"\."auditoria_acciones"\."fecha_hora"\)/);
    assert.match(query.sql, /"accion" = \$/);
    assert.match(query.sql, /"tabla_afectada" = \$/);
    assert.match(query.sql, /"registro_id" = "seguridad"\."usuarios"\."id"/);
    assert.match(query.sql, /<= \(CURRENT_TIMESTAMP - interval '18 months'\)/);
    assert.ok(query.params.includes("ARCO_BAJA_LOGICA"));
    assert.ok(query.params.includes("seguridad.usuarios"));
    assert.ok(query.params.includes(false));
  }

  function selectBuilder(shape, inTx) {
    const q = {};
    const builder = {
      from() {return builder;},
      where(c) {q.cond = dialect.sqlToQuery(c); inspeccionar(q.cond); return builder;},
      orderBy() {return builder;},
      limit() {return builder;},
      for(mode) {assert.equal(mode, "update"); q.forUpdate = true; return builder;},
      then(res, rej) {
        return Promise.resolve().then(() => {
          if (state.failList && !inTx) throw new Error("private failure");
          if (inTx) {
            assert.ok(q.forUpdate, "la fila debe bloquearse con FOR UPDATE");
            const id = q.cond.params[0];
            return elegible(state.users.find(u => u.id === id)) ? [{id}] : [];
          }
          return state.users.filter(elegible).sort((a, b) => a.id - b.id).map(u => ({id: u.id}));
        }).then(res, rej);
      },
    };
    return builder;
  }

  function txApi() {
    return {
      async execute(sqlObject) {
        const q = dialect.sqlToQuery(sqlObject);
        assert.match(q.sql, /pg_advisory_xact_lock/);
        seen.locks.push(q.params);
        if (state.onLock) state.onLock(q.params[1], state);
      },
      select: shape => selectBuilder(shape, true),
      update() {
        const u = {};
        const builder = {
          set(d) {u.data = d; return builder;},
          where(c) {u.cond = dialect.sqlToQuery(c); inspeccionar(u.cond); return builder;},
          then(res, rej) {return Promise.resolve().then(() => []).then(res, rej);},
          async returning() {
            const id = u.cond.params[0];
            const user = state.users.find(x => x.id === id);
            if (!elegible(user)) return [];
            for (const [key, value] of Object.entries(u.data)) {
              if (isSql(value)) {
                const q = dialect.sqlToQuery(value);
                if (key === "versionToken") {assert.match(q.sql, /COALESCE\(.*"version_token", 1\) \+ 1/s); user.versionToken = (user.versionToken ?? 1) + 1;}
                else if (key === "fechaAnonimizacion") {assert.match(q.sql, /^now\(\)$/); user.fechaAnonimizacion = NOW_STR;}
                else assert.fail("SQL inesperado en " + key);
              } else user[key] = value;
            }
            seen.writes++;
            return [{fechaAnonimizacion: user.fechaAnonimizacion}];
          },
        };
        return builder;
      },
      insert() {
        return {
          values(v) {
            return {
              then(res, rej) {
                return Promise.resolve().then(() => {
                  if (state.failAuditFor === v.registroId) throw new Error("fallo de auditoria");
                  state.audit.push({...v, fechaHora: NOW});
                }).then(res, rej);
              },
            };
          },
        };
      },
    };
  }

  const db = {
    select: shape => selectBuilder(shape, false),
    async transaction(callback) {
      seen.transactions++;
      const snapshot = structuredClone({users: state.users, audit: state.audit});
      try {
        return await callback(txApi());
      } catch (error) {
        state.users = snapshot.users; state.audit = snapshot.audit; // rollback
        throw error;
      }
    },
  };

  const fakeBcrypt = {hash: async (value, cost) => {seen.hashCalls.push({value, cost}); return "$2a$12$hashinservible" + seen.hashCalls.length;}};
  function load(name) {
    const path = resolve(name);
    if (cache.has(path)) return cache.get(path).exports;
    const loadedModule = {exports: {}}; cache.set(path, loadedModule);
    const output = ts.transpileModule(readFileSync(path, "utf8"), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true}, fileName: path}).outputText;
    const require = spec => {
      if (spec === "@/lib/db") return {db};
      if (spec === "next/server") return {NextResponse: {json: (body, init) => Response.json(body, init)}};
      if (spec === "bcryptjs" && !state.realBcrypt) return {default: fakeBcrypt, ...fakeBcrypt};
      if (spec.startsWith("@/") || spec.startsWith(".")) {
        let target = spec.startsWith("@/") ? resolve("src", spec.slice(2)) : resolve(dirname(path), spec);
        if (!/\.tsx?$/.test(target)) {try {readFileSync(target + ".ts"); target += ".ts";} catch {target += "/index.ts";}}
        return load(target);
      }
      assert.ok(!["postgres", "pg"].includes(spec), "unexpected I/O dependency " + spec);
      return realRequire(spec);
    };
    vm.runInNewContext(output, {module: loadedModule, exports: loadedModule.exports, require, URL, Response, Request, Headers, Date,
      console: {error: (...args) => seen.logs.push(args), log: (...args) => seen.logs.push(args)},
      process: {env}, TextEncoder, Buffer}, {filename: path});
    return loadedModule.exports;
  }

  async function post(body, authorization = "Bearer " + SECRET) {
    const headers = {"content-type": "application/json"};
    if (authorization !== null) headers.authorization = authorization;
    return load(ROUTE).POST(new Request("https://cmp.test/api/sistema/jobs/anonimizar-cuentas", {
      method: "POST", headers, body: typeof body === "string" ? body : JSON.stringify(body)}));
  }
  return {state, seen, post, user: id => state.users.find(u => u.id === id)};
}

const sinCambios = env => {
  assert.equal(env.seen.transactions, 0);
  assert.equal(env.seen.writes, 0);
  assert.deepEqual(env.state.users, escenario().users);
};

test("401 sin header, sin Bearer, con secreto incorrecto o de otra longitud; no toca la base", async () => {
  for (const auth of [null, "", SECRET, "Basic " + SECRET, "Bearer ", "Bearer incorrecto", "Bearer " + SECRET + "x", "Bearer " + SECRET.slice(1), "bearer " + SECRET]) {
    const env = environment();
    const response = await env.post({modo: "simular"}, auth);
    assert.equal(response.status, 401, String(auth));
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.deepEqual(await response.json(), {message: "No autorizado"});
    sinCambios(env);
    assert.equal(env.seen.conditions.length, 0);
  }
});

test("sin ARCO_ANONIMIZACION_JOB_SECRET el endpoint queda cerrado (500), aun con un Bearer vacio o cualquiera", async () => {
  for (const secret of [undefined, "", "   "]) {
    for (const auth of ["Bearer cualquiera", "Bearer ", null]) {
      const env = environment({secret});
      const response = await env.post({modo: "ejecutar"}, auth);
      assert.equal(response.status, 500);
      assert.ok(!JSON.stringify(await response.json()).includes("SECRET"));
      sinCambios(env);
    }
  }
});

test("la comparacion del secreto es en tiempo constante (timingSafeEqual sobre digests)", () => {
  const source = readFileSync(ROUTE, "utf8");
  assert.match(source, /timingSafeEqual/);
  assert.doesNotMatch(source, /===\s*secreto|secreto\s*===|authorization\s*===|=== `Bearer/);
});

for (const [name, body] of [
  ["JSON invalido", "{no es json"], ["arreglo", []], ["sin modo", {}], ["modo desconocido", {modo: "borrar"}], ["modo en mayusculas", {modo: "EJECUTAR"}], ["modo no string", {modo: true}],
]) {
  test("400 con cuerpo invalido: " + name, async () => {
    const env = environment();
    const response = await env.post(body);
    assert.equal(response.status, 400);
    sinCambios(env);
  });
}

test("simular: devuelve elegibles e IDs, sin datos personales, y no modifica nada", async () => {
  for (const habilitada of ["true", "false", undefined]) {
    const env = environment({habilitada});
    const response = await env.post({modo: "simular"});
    assert.equal(response.status, 200);
    assert.match(response.headers.get("cache-control"), /no-store/);
    const text = await response.text();
    assert.deepEqual(JSON.parse(text), {modo: "simular", ejecucionHabilitada: habilitada === "true", procesadas: 0, anonimizadas: 0, elegibles: 2, ids: ELEGIBLES});
    for (const pii of ["Maria", "Lopez", "example.com", "5551234567", "SECRETO", "tok1"]) assert.ok(!text.includes(pii), pii);
    sinCambios(env);
  }
});

for (const habilitada of [undefined, "", "false", "TRUE", "1", "yes"]) {
  test("ejecutar con ARCO_ANONIMIZACION_HABILITADA=" + JSON.stringify(habilitada) + " responde 423 sin cambios", async () => {
    const env = environment({habilitada});
    const response = await env.post({modo: "ejecutar"});
    assert.equal(response.status, 423);
    assert.equal((await response.json()).ejecucionHabilitada, false);
    sinCambios(env);
    assert.equal(env.seen.conditions.length, 0);
  });
}

test("ejecutar anonimiza solo las elegibles, con los valores indicados", async () => {
  const env = environment();
  const antes = escenario().users;
  const response = await env.post({modo: "ejecutar"});
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /no-store/);
  const text = await response.text();
  assert.deepEqual(JSON.parse(text), {modo: "ejecutar", ejecucionHabilitada: true, procesadas: 2, anonimizadas: 2});
  // el resumen de ejecutar no incluye IDs ni datos de las cuentas
  assert.ok(!/ids|elegibles|correo|nombre/.test(text));

  for (const id of ELEGIBLES) {
    assert.deepEqual(env.user(id), {
      id, nombre: "Usuario eliminado", apellidoPaterno: "-", apellidoMaterno: null, edad: 0, sexo: "-", telefono: "-",
      correo: `eliminado-${id}@anonimizado.local`, contrasena: env.user(id).contrasena, rolId: 2,
      resetToken: null, resetTokenExpiry: null, intentosFallidos: 0, bloqueadoHasta: null, versionToken: 5,
      mfaHabilitado: false, secretoMfa: null, activo: false, fechaAnonimizacion: NOW_STR,
    });
    assert.notEqual(env.user(id).contrasena, antes.find(u => u.id === id).contrasena);
  }
  // hash de un valor aleatorio distinto por cuenta, costo 12
  assert.equal(env.seen.hashCalls.length, 2);
  assert.ok(env.seen.hashCalls.every(c => c.cost === 12 && /^[0-9a-f]{64}$/.test(c.value)));
  assert.notEqual(env.seen.hashCalls[0].value, env.seen.hashCalls[1].value);
  // el UNIQUE de correo se conserva en toda la tabla
  const correos = env.state.users.map(u => u.correo);
  assert.equal(new Set(correos).size, correos.length);
  // las demas cuentas no cambian
  for (const id of [3, 4, 5, 6, 7, 8, 9]) assert.deepEqual(env.user(id), antes.find(u => u.id === id), "cuenta " + id);
});

test("cada cuenta usa su propia transaccion con pg_advisory_xact_lock(170017, id)", async () => {
  const env = environment();
  await env.post({modo: "ejecutar"});
  assert.equal(env.seen.transactions, 2);
  assert.deepEqual(env.seen.locks, [[170017, 1], [170017, 2]]);
});

test("registra auditoria ARCO_ANONIMIZACION_FINAL sin datos personales", async () => {
  const env = environment();
  await env.post({modo: "ejecutar"});
  const filas = env.state.audit.filter(a => a.accion === "ARCO_ANONIMIZACION_FINAL");
  assert.equal(filas.length, 2);
  for (const [i, fila] of filas.entries()) {
    // Via JSON: los objetos creados dentro del vm tienen otro prototipo.
    assert.deepEqual(JSON.parse(JSON.stringify(fila)), JSON.parse(JSON.stringify({
      usuario: "sistema:job-anonimizacion", accion: "ARCO_ANONIMIZACION_FINAL", tablaAfectada: "seguridad.usuarios",
      registroId: ELEGIBLES[i], aplicacionOrigen: "CMP_Site", fechaHora: NOW,
      datosAnteriores: {activo: false, anonimizado: false},
      datosNuevos: {activo: false, anonimizado: true, fechaAnonimizacion: NOW_STR},
    })));
    const json = JSON.stringify(fila);
    for (const pii of ["Maria", "example.com", "5551234567", "anonimizado.local"]) assert.ok(!json.includes(pii), pii);
  }
});

test("segunda ejecucion no vuelve a procesar nada (idempotente); versionToken sube una sola vez", async () => {
  const env = environment();
  await env.post({modo: "ejecutar"});
  const despues = structuredClone(env.state.users);
  const segunda = await env.post({modo: "ejecutar"});
  assert.deepEqual(await segunda.json(), {modo: "ejecutar", ejecucionHabilitada: true, procesadas: 0, anonimizadas: 0});
  assert.deepEqual(env.state.users, despues);
  assert.equal(env.user(1).versionToken, 5);
  assert.equal(env.state.audit.filter(a => a.accion === "ARCO_ANONIMIZACION_FINAL").length, 2);
});

test("ejecuciones encimadas: una cuenta que otra ejecucion ya anonimizo se omite al reevaluar con el lock", async () => {
  const env = environment({onLock: (id, state) => {if (id === 2) state.users.find(u => u.id === 2).fechaAnonimizacion = NOW_STR;}});
  const response = await env.post({modo: "ejecutar"});
  assert.deepEqual(await response.json(), {modo: "ejecutar", ejecucionHabilitada: true, procesadas: 2, anonimizadas: 1});
  assert.equal(env.user(2).nombre, "Maria 2");
  assert.equal(env.state.audit.filter(a => a.accion === "ARCO_ANONIMIZACION_FINAL" && a.registroId === 2).length, 0);
});

test("una cuenta reactivada antes del lock no se anonimiza", async () => {
  const env = environment({onLock: (id, state) => {if (id === 1) state.users.find(u => u.id === 1).activo = true;}});
  const response = await env.post({modo: "ejecutar"});
  assert.deepEqual(await response.json(), {modo: "ejecutar", ejecucionHabilitada: true, procesadas: 2, anonimizadas: 1});
  assert.equal(env.user(1).nombre, "Maria 1");
  assert.equal(env.user(1).activo, true);
});

test("si falla la auditoria de una cuenta se revierte esa cuenta y las demas continuan", async () => {
  const env = environment({failAuditFor: 1});
  const response = await env.post({modo: "ejecutar"});
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {modo: "ejecutar", ejecucionHabilitada: true, procesadas: 2, anonimizadas: 1});
  assert.deepEqual(env.user(1), usuario(1)); // rollback completo
  assert.equal(env.user(2).nombre, "Usuario eliminado");
  assert.ok(env.seen.logs.length > 0);
  assert.ok(!JSON.stringify(env.seen.logs.map(l => String(l[0]))).includes("Maria"));
});

test("500 generico si falla la consulta de elegibles, sin filtrar detalles", async () => {
  for (const modo of ["simular", "ejecutar"]) {
    const env = environment({failList: true});
    const response = await env.post({modo});
    assert.equal(response.status, 500);
    assert.ok(!(await response.text()).includes("private failure"));
    assert.ok(env.seen.logs.length > 0);
    assert.equal(env.seen.writes, 0);
  }
});

test("con bcryptjs real: contrasena nueva con costo 12 que no coincide con ninguna conocida", async () => {
  const env = environment({realBcrypt: true});
  await env.post({modo: "ejecutar"});
  const bcrypt = realRequire("bcryptjs");
  for (const id of ELEGIBLES) {
    assert.match(env.user(id).contrasena, /^\$2[aby]\$12\$/);
    assert.equal(await bcrypt.compare("Maria1!", env.user(id).contrasena), false);
  }
  assert.notEqual(env.user(1).contrasena, env.user(2).contrasena);
});

test("migracion 0004: solo agrega la columna nullable; snapshot y journal consistentes; rollback protegido", () => {
  const previous = JSON.parse(readFileSync("drizzle/meta/0003_snapshot.json", "utf8"));
  const current = JSON.parse(readFileSync("drizzle/meta/0004_snapshot.json", "utf8"));
  assert.equal(current.prevId, previous.id);
  assert.notEqual(current.id, previous.id);
  assert.deepEqual(current.tables["seguridad.usuarios"].columns.fecha_anonimizacion,
    {name: "fecha_anonimizacion", type: "timestamp", primaryKey: false, notNull: false});
  delete current.tables["seguridad.usuarios"].columns.fecha_anonimizacion;
  for (const field of ["id", "prevId"]) {delete current[field]; delete previous[field];}
  assert.deepEqual(current, previous);
  const journal = JSON.parse(readFileSync("drizzle/meta/_journal.json", "utf8")).entries;
  // Se busca por tag: migraciones posteriores no deben romper esta prueba.
  const entrada = journal.find(e => e.tag === "0004_fecha_anonimizacion");
  assert.ok(entrada);
  assert.equal(entrada.idx, journal.indexOf(entrada));
  const migration = readFileSync("drizzle/0004_fecha_anonimizacion.sql", "utf8");
  assert.match(migration, /ALTER TABLE "seguridad"\."usuarios" ADD COLUMN IF NOT EXISTS "fecha_anonimizacion" timestamp;/);
  assert.doesNotMatch(migration, /NOT NULL|DROP|DELETE|UPDATE/i);
  const rollback = readFileSync("drizzle/rollback/0004_fecha_anonimizacion.sql", "utf8");
  assert.match(rollback, /Rollback rechazado/);
});

test("workflow: una vez al dia, secretos desde GitHub Secrets, sin imprimir el secreto", () => {
  const yml = readFileSync(".github/workflows/anonimizar-cuentas-canceladas.yml", "utf8");
  assert.match(yml, /schedule:\s*\n\s*#.*\n\s*- cron: "0 9 \* \* \*"/);
  assert.match(yml, /workflow_dispatch:/);
  assert.match(yml, /secrets\.ARCO_ANONIMIZACION_JOB_SECRET/);
  assert.match(yml, /"https:\/\/cmp-site\.vercel\.app\/api\/sistema\/jobs\/anonimizar-cuentas"/);
  assert.match(yml, /--request POST/);
  assert.match(yml, /--data '\{"modo":"ejecutar"\}'/);
  assert.match(yml, /curl -f /);
  assert.match(yml, /Settings -> Secrets and variables -> Actions/);
  assert.match(yml, /permissions: \{\}/);
  assert.doesNotMatch(yml, /echo[^\n]*\$\{?ARCO_ANONIMIZACION_JOB_SECRET/);
  assert.doesNotMatch(yml, /set -x/);
});
