import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {resolve, dirname} from "node:path";
import {createRequire} from "node:module";
import vm from "node:vm";
import ts from "typescript";
import {PgDialect} from "drizzle-orm/pg-core";

const realRequire = createRequire(import.meta.url);
const LIST = "src/app/api/cliente/notificaciones/route.ts";
const READ = "src/app/api/cliente/notificaciones/[id]/leida/route.ts";
const BASE = "https://cmp.test/api/cliente/notificaciones";

// Inscripciones: 1 y 2 son del usuario 5; 3 es del usuario 9.
const INSCRIPCIONES = {1: 5, 2: 5, 3: 9};

function fila(id, extra = {}) {
  return {
    idNotificacion: BigInt(id), cursoId: 10, inscripcionId: 1, sesionId: null, evaluacionId: null,
    tipoNotificacion: "Aviso general", titulo: "Titulo " + id, mensaje: "Mensaje " + id, canal: "Sistema",
    estadoEnvio: "Enviada", fechaProgramada: null, fechaEnvio: "2026-10-20 10:00:00.000", fechaLectura: null,
    createdAt: "2026-10-20 10:00:" + String(id).padStart(2, "0"), ...extra,
  };
}

function environment(options = {}) {
  const state = {user: 5, fail: false, rows: [], ...options};
  const cache = new Map();
  const dialect = new PgDialect();
  const seen = {joins: 0, updates: [], logs: [], queries: 0};

  function paramFor(query, column) {
    const match = new RegExp('"' + column + '" = \\$(\\d+)').exec(query.sql);
    assert.ok(match, "condicion esperada sobre " + column + ": " + query.sql);
    return query.params[Number(match[1]) - 1];
  }
  function compile(sqlObject) {return dialect.sqlToQuery(sqlObject);}

  function select(shape) {
    const q = {shape, joined: false, limit: undefined, offset: 0, order: []};
    const builder = {
      from() {return builder;},
      innerJoin() {q.joined = true; seen.joins++; return builder;},
      where(condition) {q.condition = compile(condition); return builder;},
      orderBy(...orders) {q.order = orders.map(o => compile(o).sql); return builder;},
      limit(n) {q.limit = n; return builder;},
      offset(n) {q.offset = n; return builder;},
      then(resolveFn, rejectFn) {
        return Promise.resolve().then(() => {
          seen.queries++;
          if (state.fail) throw new Error("private failure");
          assert.ok(q.joined, "la consulta debe unir con la inscripcion");
          const usuario = Number(paramFor(q.condition, "usuario_id"));
          let rows = state.rows.filter(r => r.inscripcionId !== null && INSCRIPCIONES[r.inscripcionId] === usuario);
          if (/"id_notificacion" = \$/.test(q.condition.sql)) {
            const id = Number(paramFor(q.condition, "id_notificacion"));
            rows = rows.filter(r => Number(r.idNotificacion) === id);
          }
          if ("total" in q.shape) {
            return [{total: rows.length, noLeidas: rows.filter(r => r.estadoEnvio !== "Leída").length}];
          }
          if (q.order.length) {
            assert.match(q.order[0], /"created_at" desc/);
            rows = [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || Number(b.idNotificacion - a.idNotificacion));
          }
          if (q.limit !== undefined) rows = rows.slice(q.offset, q.offset + q.limit);
          return rows.map(r => Object.fromEntries(Object.keys(q.shape).map(k => [k, r[k]])));
        }).then(resolveFn, rejectFn);
      },
    };
    return builder;
  }

  function update() {
    const u = {};
    const builder = {
      set(data) {u.data = data; return builder;},
      where(condition) {u.condition = compile(condition); return builder;},
      then(resolveFn, rejectFn) {
        return Promise.resolve().then(() => {
          if (state.fail) throw new Error("private failure");
          seen.updates.push(u);
          const id = Number(paramFor(u.condition, "id_notificacion"));
          assert.match(u.condition.sql, /"estado_envio" <> \$/);
          const row = state.rows.find(r => Number(r.idNotificacion) === id);
          if (!row || row.estadoEnvio === "Leída") return [];
          const lectura = compile(u.data.fechaLectura);
          assert.match(lectura.sql, /GREATEST/);
          const ahora = lectura.params[0].replace("T", " ").replace("Z", "");
          const fechaLectura = ahora > row.fechaEnvio ? ahora : row.fechaEnvio;
          // chk_notificacion_enviada / chk_notificacion_leida
          assert.ok(row.fechaEnvio, "chk_notificacion_enviada");
          assert.equal(u.data.estadoEnvio, "Leída");
          row.estadoEnvio = u.data.estadoEnvio; row.fechaLectura = fechaLectura; row.updatedAt = u.data.updatedAt;
          return [];
        }).then(resolveFn, rejectFn);
      },
    };
    return builder;
  }

  const db = {select, update};
  const session = () => state.user ? {user: {id: state.user, rol: "cliente", correo: "fixture@example.com"}} : null;
  const fakeAuth = {requireApiAuth: async () => ({
    session: session(),
    error: state.user ? null : Response.json({message: "No autenticado"}, {status: 401}),
  })};

  function load(name) {
    const path = resolve(name);
    if (cache.has(path)) return cache.get(path).exports;
    const loadedModule = {exports: {}}; cache.set(path, loadedModule);
    const output = ts.transpileModule(readFileSync(path, "utf8"), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true}, fileName: path}).outputText;
    const require = spec => {
      if (spec === "@/lib/db") return {db};
      if (spec === "@/lib/auth") return fakeAuth;
      if (spec === "next/server") return {NextResponse: {json: (body, init) => Response.json(body, init)}};
      if (spec.startsWith("@/") || spec.startsWith(".")) {
        let target = spec.startsWith("@/") ? resolve("src", spec.slice(2)) : resolve(dirname(path), spec);
        if (!/\.tsx?$/.test(target)) {try {readFileSync(target + ".ts"); target += ".ts";} catch {target += "/index.ts";}}
        return load(target);
      }
      // Ningun cliente real de base de datos ni transporte puede cargarse.
      assert.ok(!["postgres", "pg", "jose", "next/headers"].includes(spec), "unexpected I/O dependency " + spec);
      return realRequire(spec);
    };
    vm.runInNewContext(output, {module: loadedModule, exports: loadedModule.exports, require, URL, Response, Request, Headers, Date,
      console: {error: (...args) => seen.logs.push(args), log: (...args) => seen.logs.push(args)}, process: {env: {}}, TextEncoder, Buffer}, {filename: path});
    return loadedModule.exports;
  }

  const list = query => load(LIST).GET(new Request(BASE + (query ?? "")));
  const read = id => load(READ).PATCH(new Request(BASE + "/" + id + "/leida", {method: "PATCH"}), {params: Promise.resolve({id: String(id)})});
  return {state, seen, list, read};
}

const propias = () => [fila(1), fila(2, {estadoEnvio: "Leída", fechaLectura: "2026-10-21 08:00:00.000"}), fila(3, {inscripcionId: 2, estadoEnvio: "Pendiente", fechaEnvio: null})];
const ajena = () => fila(4, {inscripcionId: 3});
const soloCurso = () => fila(5, {inscripcionId: null, cursoId: 10});

test("401 sin sesion en ambos endpoints, sin consultar la base", async () => {
  const env = environment({user: 0, rows: propias()});
  assert.equal((await env.list()).status, 401);
  assert.equal((await env.read(1)).status, 401);
  assert.equal(env.seen.queries, 0);
  assert.equal(env.seen.updates.length, 0);
});

test("GET lista solo las del usuario: excluye ajenas y las de solo curso, con DTO camelCase e ISO", async () => {
  const env = environment({rows: [...propias(), ajena(), soloCurso()]});
  const response = await env.list();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /no-store/);
  const body = await response.json();
  assert.deepEqual(body.notifications.map(n => n.id), [3, 2, 1]);
  assert.equal(body.total, 3);
  assert.equal(body.unreadCount, 2);
  assert.equal(body.page, 1);
  assert.equal(body.pageSize, 20);
  assert.deepEqual(body.notifications[2], {
    id: 1, courseId: 10, enrollmentId: 1, sessionId: null, evaluationId: null, type: "Aviso general",
    title: "Titulo 1", message: "Mensaje 1", channel: "Sistema", deliveryStatus: "Enviada",
    scheduledAt: null, sentAt: "2026-10-20T10:00:00.000Z", readAt: null,
  });
  assert.equal(body.notifications[1].readAt, "2026-10-21T08:00:00.000Z");
});

test("otro usuario solo ve lo suyo", async () => {
  const env = environment({user: 9, rows: [...propias(), ajena(), soloCurso()]});
  const body = await (await env.list()).json();
  assert.deepEqual(body.notifications.map(n => n.id), [4]);
  assert.equal(body.total, 1);
});

test("paginacion: pagina 2 y unreadCount sobre el total, no sobre la pagina", async () => {
  const rows = Array.from({length: 25}, (_, i) => fila(i + 1, i % 5 === 0 ? {estadoEnvio: "Leída", fechaLectura: "2026-10-21 08:00:00.000"} : {}));
  const env = environment({rows});
  const body = await (await env.list("?page=2&pageSize=10")).json();
  assert.deepEqual(body.notifications.map(n => n.id), [15, 14, 13, 12, 11, 10, 9, 8, 7, 6]);
  assert.equal(body.page, 2);
  assert.equal(body.pageSize, 10);
  assert.equal(body.total, 25);
  assert.equal(body.unreadCount, 20);
  const last = await (await env.list("?page=3&pageSize=10")).json();
  assert.equal(last.notifications.length, 5);
  const vacia = await (await env.list("?page=9&pageSize=10")).json();
  assert.deepEqual(vacia.notifications, []);
  assert.equal(vacia.total, 25);
});

test("pageSize 50 es valido", async () => {
  const response = await environment({rows: propias()}).list("?pageSize=50");
  assert.equal(response.status, 200);
  assert.equal((await response.json()).pageSize, 50);
});

for (const query of ["?pageSize=51", "?pageSize=1000", "?pageSize=0", "?pageSize=-1", "?pageSize=abc", "?pageSize=1.5", "?pageSize=",
  "?page=0", "?page=-1", "?page=abc", "?page=1.5", "?page=", "?page=99999999999999999999"]) {
  test("GET rechaza con 400 " + query, async () => {
    const env = environment({rows: propias()});
    const response = await env.list(query);
    assert.equal(response.status, 400);
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.equal(env.seen.queries, 0);
  });
}

test("PATCH marca como leida, devuelve la notificacion y baja el unreadCount", async () => {
  const env = environment({rows: [...propias(), ajena()]});
  const before = await (await env.list()).json();
  assert.equal(before.unreadCount, 2);
  const response = await env.read(1);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /no-store/);
  const body = await response.json();
  assert.equal(body.id, 1);
  assert.equal(body.deliveryStatus, "Leída");
  assert.equal(new Date(body.readAt).toISOString(), body.readAt);
  assert.ok(new Date(body.readAt) >= new Date(body.sentAt));
  assert.equal(env.seen.updates.length, 1);
  assert.equal((await (await env.list()).json()).unreadCount, 1);
  // la ajena no cambia
  assert.equal(env.state.rows.find(r => r.idNotificacion === 4n).estadoEnvio, "Enviada");
});

test("PATCH es idempotente: ya leida responde 200 sin escribir ni cambiar readAt", async () => {
  const env = environment({rows: propias()});
  const body = await (await env.read(2)).json();
  const again = await env.read(2);
  assert.equal(again.status, 200);
  assert.deepEqual(await again.json(), body);
  assert.equal(body.readAt, "2026-10-21T08:00:00.000Z");
  assert.equal(env.seen.updates.length, 0);
  const first = await (await env.read(1)).json();
  const second = await (await env.read(1)).json();
  assert.deepEqual(second, first);
  assert.equal(env.seen.updates.length, 1);
});

for (const [name, id] of [["ajena", 4], ["inexistente", 999], ["de solo curso sin inscripcion", 5]]) {
  test("PATCH 404 para notificacion " + name + ", sin escribir", async () => {
    const env = environment({rows: [...propias(), ajena(), soloCurso()]});
    const response = await env.read(id);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), {message: "Notificación no encontrada"});
    assert.equal(env.seen.updates.length, 0);
  });
}

test("PATCH 404 ajena es indistinguible de inexistente", async () => {
  const env = environment({rows: [...propias(), ajena()]});
  assert.deepEqual(await (await env.read(4)).json(), await (await env.read(999)).json());
});

for (const id of ["abc", "0", "-1", "1.5", "1e3", "9007199254740993", " 1", ""]) {
  test("PATCH 400 con id invalido " + JSON.stringify(id), async () => {
    const env = environment({rows: propias()});
    const response = await env.read(id);
    assert.equal(response.status, 400);
    assert.equal(env.seen.queries, 0);
    assert.equal(env.seen.updates.length, 0);
  });
}

test("PATCH 409 si la notificacion aun no fue enviada (no viola chk_notificacion_enviada)", async () => {
  const env = environment({rows: propias()});
  const response = await env.read(3);
  assert.equal(response.status, 409);
  assert.equal(env.seen.updates.length, 0);
  assert.equal(env.state.rows.find(r => r.idNotificacion === 3n).estadoEnvio, "Pendiente");
});

test("errores de base de datos devuelven 500 generico sin filtrar detalles", async () => {
  for (const call of ["list", "read"]) {
    const env = environment({rows: propias(), fail: true});
    const response = await (call === "list" ? env.list() : env.read(1));
    assert.equal(response.status, 500);
    assert.ok(!(await response.text()).includes("private failure"));
    assert.ok(env.seen.logs.length > 0);
  }
});
