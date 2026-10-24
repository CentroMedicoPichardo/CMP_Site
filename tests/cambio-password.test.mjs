import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {resolve, dirname} from "node:path";
import {createRequire} from "node:module";
import vm from "node:vm";
import ts from "typescript";
import bcrypt from "bcryptjs";
import {SignJWT} from "jose";
import {PgDialect} from "drizzle-orm/pg-core";

const realRequire = createRequire(import.meta.url);
const ROUTE = "src/app/api/profile/password/route.ts";
const CONFIRM = "src/app/api/auth/password-reset/confirm/route.ts";
const SECRET = "fixture-secret-for-tests-only";
const ACTUAL = "ClaveSegura7#x";
const NUEVA = "NuevaClave9$z";
const HASH_ACTUAL = bcrypt.hashSync(ACTUAL, 4);

const signToken = (version = 1, id = 5) => new SignJWT({id, userId: id, email: "fixture@example.com", rol: "cliente", version, tokenUse: "access"})
  .setProtectedHeader({alg: "HS256"}).setIssuedAt().setExpirationTime("1h").sign(new TextEncoder().encode(SECRET));

// Ejecuta la ruta real con auth.ts real (JWT verificado con jose); solo la base de datos es simulada.
function environment(options = {}) {
  const state = {fail: false, race: null, ...options};
  state.user = {id: 5, correo: "fixture@example.com", nombre: "Fixture", apellidoPaterno: "Test", apellidoMaterno: null,
    rolId: 1, activo: true, bloqueadoHasta: null, versionToken: 1, intentosFallidos: 0, contrasena: HASH_ACTUAL, ...options.user};
  const cache = new Map();
  const dialect = new PgDialect();
  const seen = {updates: [], selects: 0, logs: []};
  let authorization = null;

  const db = {
    query: {
      usuarios: {findFirst: async () => state.user},
      roles: {findFirst: async () => ({id: 1, nombre: "cliente"})},
    },
    select() {
      const builder = {
        from() {return builder;}, where() {return builder;},
        async limit() {
          seen.selects++;
          if (state.fail) throw new Error("private failure");
          return state.user.activo ? [{id: state.user.id, contrasena: state.user.contrasena}] : [];
        },
      };
      return builder;
    },
    update() {
      const u = {};
      const builder = {
        set(data) {u.data = data; return builder;},
        where(condition) {u.condition = dialect.sqlToQuery(condition); return builder;},
        async returning() {
          seen.updates.push(u);
          if (state.race) state.race(state.user);
          const [id, oldHash] = u.condition.params;
          // WHERE id = X AND contrasena = <hash verificado>
          if (id !== state.user.id || oldHash !== state.user.contrasena) return [];
          assert.deepEqual(Object.keys(u.data).sort(), ["contrasena", "versionToken"]);
          const version = dialect.sqlToQuery(u.data.versionToken);
          assert.match(version.sql, /COALESCE\(.*"version_token", 1\) \+ 1/s);
          state.user.contrasena = u.data.contrasena;
          state.user.versionToken = (state.user.versionToken ?? 1) + 1;
          return [{id: state.user.id}];
        },
      };
      return builder;
    },
  };

  function load(name) {
    const path = resolve(name);
    if (cache.has(path)) return cache.get(path).exports;
    const loadedModule = {exports: {}}; cache.set(path, loadedModule);
    const output = ts.transpileModule(readFileSync(path, "utf8"), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true}, fileName: path}).outputText;
    const require = spec => {
      if (spec === "@/lib/db") return {db};
      if (spec === "next/server") return {NextResponse: {json: (body, init) => Response.json(body, init)}};
      if (spec === "next/headers") return {
        headers: async () => new Headers(authorization ? {authorization} : {}),
        cookies: async () => ({get: () => undefined}),
      };
      if (spec === "next/navigation") return {redirect: () => {throw new Error("redirect");}};
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
      process: {env: {JWT_SECRET: SECRET}}, TextEncoder, Buffer}, {filename: path});
    return loadedModule.exports;
  }

  async function put(body, token) {
    authorization = token === undefined ? null : "Bearer " + token;
    return load(ROUTE).PUT(new Request("https://cmp.test/api/profile/password", {
      method: "PUT", headers: {"content-type": "application/json"},
      body: typeof body === "string" ? body : JSON.stringify(body)}));
  }
  const valid = (extra = {}) => ({contrasenaActual: ACTUAL, contrasenaNueva: NUEVA, confirmarContrasenaNueva: NUEVA, ...extra});
  return {state, seen, put, load, valid};
}

function assertUnchanged(env) {
  assert.equal(env.state.user.contrasena, HASH_ACTUAL);
  assert.equal(env.state.user.versionToken, 1);
  assert.equal(env.seen.updates.length, 0);
}

test("401 sin sesion o con token invalido, sin tocar la base", async () => {
  const env = environment();
  assert.equal((await env.put(env.valid())).status, 401);
  assert.equal((await env.put(env.valid(), "no-es-un-jwt")).status, 401);
  assert.equal((await env.put(env.valid(), await signToken(7))).status, 401); // version distinta
  assert.equal(env.seen.selects, 0);
  assertUnchanged(env);
});

test("401 con contrasena actual incorrecta; no cambia nada ni bloquea la cuenta", async () => {
  const env = environment();
  const token = await signToken();
  for (let i = 0; i < 8; i++) {
    const response = await env.put(env.valid({contrasenaActual: "Incorrecta1!"}), token);
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), {message: "La contraseña actual no es correcta."});
    assert.match(response.headers.get("cache-control"), /no-store/);
  }
  assertUnchanged(env);
  assert.equal(env.state.user.intentosFallidos, 0);
  assert.equal(env.state.user.bloqueadoHasta, null);
  // sigue pudiendo cambiarla despues de muchos intentos fallidos
  assert.equal((await env.put(env.valid(), token)).status, 200);
});

test("400 si la confirmacion no coincide", async () => {
  const env = environment();
  const response = await env.put(env.valid({confirmarContrasenaNueva: NUEVA + "x"}), await signToken());
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {message: "Las contraseñas no coinciden."});
  assertUnchanged(env);
});

for (const [name, nueva] of [
  ["muy corta", "Ab1!"],
  ["sin numero", "Password!!x"],
  ["sin letra", "98765432!@"],
  ["sin simbolo", "Password98"],
  ["secuencia 123", "Clave123!xx"],
  ["secuencia abc", "Abcde98!xx"],
  ["secuencia qwe", "Qwerty9!xx"],
  ["mas de 72 bytes", "Aa1!" + "a".repeat(80)],
]) {
  test("400 si la nueva no cumple la politica: " + name, async () => {
    const env = environment();
    const response = await env.put(env.valid({contrasenaNueva: nueva, confirmarContrasenaNueva: nueva}), await signToken());
    assert.equal(response.status, 400);
    assert.ok((await response.json()).message.startsWith("La contraseña"));
    assertUnchanged(env);
  });
}

test("400 si la nueva es igual a la actual", async () => {
  const env = environment();
  const response = await env.put(env.valid({contrasenaNueva: ACTUAL, confirmarContrasenaNueva: ACTUAL}), await signToken());
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {message: "La nueva contraseña debe ser diferente de la actual."});
  assertUnchanged(env);
});

for (const [name, body] of [
  ["JSON invalido", "{no es json"],
  ["arreglo", []],
  ["falta contrasenaActual", {contrasenaNueva: NUEVA, confirmarContrasenaNueva: NUEVA}],
  ["falta confirmacion", {contrasenaActual: ACTUAL, contrasenaNueva: NUEVA}],
  ["contrasenaActual vacia", {contrasenaActual: "", contrasenaNueva: NUEVA, confirmarContrasenaNueva: NUEVA}],
  ["valores no string", {contrasenaActual: 1, contrasenaNueva: 2, confirmarContrasenaNueva: 2}],
]) {
  test("400 con cuerpo invalido: " + name, async () => {
    const env = environment();
    const response = await env.put(body, await signToken());
    assert.equal(response.status, 400);
    assertUnchanged(env);
  });
}

test("200: cambia el hash (bcrypt costo 12), sube versionToken y no devuelve datos sensibles", async () => {
  const env = environment();
  const response = await env.put(env.valid(), await signToken());
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /no-store/);
  const text = await response.text();
  assert.deepEqual(JSON.parse(text), {message: "Contraseña actualizada correctamente. Vuelve a iniciar sesión."});
  assert.ok(!text.includes(NUEVA) && !text.includes(env.state.user.contrasena));
  assert.notEqual(env.state.user.contrasena, HASH_ACTUAL);
  assert.match(env.state.user.contrasena, /^\$2[aby]\$12\$/);
  assert.equal(await bcrypt.compare(NUEVA, env.state.user.contrasena), true);
  assert.equal(await bcrypt.compare(ACTUAL, env.state.user.contrasena), false);
  assert.equal(env.state.user.versionToken, 2);
  assert.equal(env.seen.updates.length, 1);
});

test("200 con versionToken nulo: COALESCE lo trata como 1 y queda en 2", async () => {
  const env = environment({user: {versionToken: null}});
  const response = await env.put(env.valid(), await signToken(0)); // auth.ts compara Number(null ?? 1) con version del token
  assert.equal(response.status, 401); // token version 0 != 1
  const ok = await env.put(env.valid(), await signToken(1));
  assert.equal(ok.status, 200);
  assert.equal(env.state.user.versionToken, 2);
});

test("el JWT emitido antes del cambio deja de pasar requireApiAuth; uno nuevo con la version nueva si", async () => {
  const env = environment();
  const viejo = await signToken(1);
  assert.equal((await env.put(env.valid(), viejo)).status, 200);
  // el mismo token ya no autentica (ni siquiera con la contrasena nueva como actual)
  const rechazado = await env.put({contrasenaActual: NUEVA, contrasenaNueva: "OtraClave8%q", confirmarContrasenaNueva: "OtraClave8%q"}, viejo);
  assert.equal(rechazado.status, 401);
  assert.deepEqual(await rechazado.json(), {message: "No autenticado"});
  assert.equal(env.state.user.versionToken, 2);
  // un token nuevo (version 2) si pasa, y la nueva contrasena ya es la actual
  const nuevo = await signToken(2);
  const ok = await env.put({contrasenaActual: NUEVA, contrasenaNueva: "OtraClave8%q", confirmarContrasenaNueva: "OtraClave8%q"}, nuevo);
  assert.equal(ok.status, 200);
  assert.equal(env.state.user.versionToken, 3);
});

test("409 si la contrasena cambia entre la verificacion y la escritura (sin sobrescribir)", async () => {
  const env = environment({race: user => {user.contrasena = bcrypt.hashSync("OtraCosa5!x", 4);}});
  const otra = () => env.state.user.contrasena;
  const response = await env.put(env.valid(), await signToken());
  assert.equal(response.status, 409);
  assert.notEqual(otra(), HASH_ACTUAL);
  assert.equal(await bcrypt.compare(NUEVA, otra()), false);
  assert.equal(env.state.user.versionToken, 1);
});

test("500 generico sin filtrar detalles si falla la base", async () => {
  const env = environment({fail: true});
  const response = await env.put(env.valid(), await signToken());
  assert.equal(response.status, 500);
  assert.ok(!(await response.text()).includes("private failure"));
  assert.ok(env.seen.logs.length > 0);
  assert.equal(env.state.user.contrasena, HASH_ACTUAL);
});

test("la politica vive en un solo modulo compartido por ambos endpoints", async () => {
  for (const file of [ROUTE, CONFIRM]) {
    const source = readFileSync(file, "utf8");
    assert.match(source, /from "@\/lib\/validarContrasena"/, file);
    assert.doesNotMatch(source, /function validarContrasena/, file);
  }
  const {validarContrasena} = environment().load("src/lib/validarContrasena.ts");
  assert.equal(validarContrasena(NUEVA), null);
  assert.match(validarContrasena("Ab1!"), /al menos 8 caracteres/);
  assert.match(validarContrasena("Password!!x"), /letras, números y un símbolo/);
  assert.match(validarContrasena("Clave123!xx"), /secuencia insegura/);
});

test("password-reset/confirm sigue aplicando la politica compartida antes de consultar la base", async () => {
  const env = environment();
  const response = await env.load(CONFIRM).POST(new Request("https://cmp.test/api/auth/password-reset/confirm", {
    method: "POST", headers: {"content-type": "application/json"},
    body: JSON.stringify({token: "a".repeat(64), contrasena: "Clave123!xx", confirmarContrasena: "Clave123!xx"})}));
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {message: "La contraseña contiene una secuencia insegura."});
  assert.equal(env.seen.selects, 0);
});
