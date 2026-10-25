import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {resolve, dirname} from "node:path";
import {createRequire} from "node:module";
import vm from "node:vm";
import ts from "typescript";

const realRequire = createRequire(import.meta.url);
const REGISTER = "src/app/api/auth/register/route.ts";
const NAME = Symbol.for("drizzle:Name");
const MENSAJE_EDAD = "Debes ser mayor de edad (18 años cumplidos) para registrar una cuenta.";
const MENSAJE_CAMPOS = "Faltan campos obligatorios: nombre, apellidoPaterno, edad, sexo y telefono";

function environment() {
  const state = {users: []};
  const cache = new Map();
  const seen = {otpCalls: 0, logs: []};
  let nextId = 100;

  function selectBuilder() {
    let table;
    const builder = {
      from(t) {table = t[NAME]; return builder;},
      where() {return builder;},
      limit() {return builder;},
      then(resolveFn, rejectFn) {
        return Promise.resolve().then(() => {
          if (table === "documentos_legales") return [{idDocumento: 1, tipo: "aviso_privacidad"}, {idDocumento: 2, tipo: "terminos_condiciones"}];
          if (table === "usuarios") return [];
          if (table === "roles") return [{id: 1}];
          assert.fail("tabla inesperada " + table);
        }).then(resolveFn, rejectFn);
      },
    };
    return builder;
  }
  const tx = {
    insert(t) {
      const name = t[NAME];
      return {values(v) {
        const apply = () => {
          if (name === "usuarios") {const row = {id: nextId++, ...v}; state.users.push(row); return [row];}
          return [];
        };
        return {returning: async () => apply(), then(res, rej) {return Promise.resolve().then(apply).then(res, rej);}};
      }};
    },
  };
  const db = {select: () => selectBuilder(), transaction: async cb => cb(tx)};
  const fakeOtp = {otpMemoria: new Map(), verificarOTP: () => {seen.otpCalls++; return {valido: true, mensaje: "ok"};}};
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

  const body = (edad) => ({codigoVerificacion: "123456", nombre: "Ana", apellidoPaterno: "Lopez", apellidoMaterno: "Diaz",
    edad, sexo: "femenino", telefono: "7711408883", correo: "ana@example.com", contrasena: "ClaveSegura7#x"});
  const register = payload => load(REGISTER).POST(new Request("https://cmp.test/api/auth/register", {
    method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify(payload)}));
  return {state, seen, register, body, load};
}

for (const edad of [18, "18", 19, 65, 120, "120"]) {
  test("registro acepta edad " + JSON.stringify(edad), async () => {
    const env = environment();
    const response = await env.register(env.body(edad));
    assert.equal(response.status, 201);
    assert.equal(env.state.users.length, 1);
    assert.equal(env.state.users[0].edad, Number(edad));
    assert.equal(env.seen.otpCalls, 1);
  });
}

for (const edad of [17, "17", 16, 10, 1, 0, -1, -18]) {
  test("registro rechaza con 400 y mensaje claro la edad " + JSON.stringify(edad), async () => {
    const env = environment();
    const response = await env.register(env.body(edad));
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {message: MENSAJE_EDAD});
    assert.equal(env.state.users.length, 0);
    assert.equal(env.seen.otpCalls, 0, "no debe consumir el OTP");
  });
}

// Comportamiento previo que no cambia: tope superior y valores no validos.
for (const edad of [121, "121", 150, 18.5, "abc", "", "   ", null, undefined, {}, [], NaN]) {
  test("registro sigue rechazando con el mensaje generico la edad " + JSON.stringify(edad), async () => {
    const env = environment();
    const payload = env.body(edad);
    if (edad === undefined) delete payload.edad;
    const response = await env.register(payload);
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {message: MENSAJE_CAMPOS});
    assert.equal(env.state.users.length, 0);
    assert.equal(env.seen.otpCalls, 0);
  });
}

test("una edad menor de 18 no oculta otros errores previos (campos faltantes, correo invalido)", async () => {
  const env = environment();
  assert.deepEqual(await (await env.register({...env.body(17), nombre: ""})).json(), {message: MENSAJE_CAMPOS});
  assert.deepEqual(await (await env.register({...env.body(17), correo: "no-es-correo"})).json(), {message: "El correo no tiene un formato válido"});
});

test("validarEdadRegistro: reglas del helper compartido", () => {
  const {validarEdadRegistro, EDAD_MINIMA_REGISTRO, EDAD_MAXIMA_REGISTRO, MENSAJE_EDAD_MINIMA} = environment().load("src/lib/validarEdad.ts");
  assert.equal(EDAD_MINIMA_REGISTRO, 18);
  assert.equal(EDAD_MAXIMA_REGISTRO, 120);
  assert.equal(MENSAJE_EDAD_MINIMA, MENSAJE_EDAD);
  const plano = r => JSON.parse(JSON.stringify(r));
  assert.deepEqual(plano(validarEdadRegistro(17)), {valida: false, motivo: "menor_de_edad"});
  assert.deepEqual(plano(validarEdadRegistro(18)), {valida: true, edad: 18});
  assert.deepEqual(plano(validarEdadRegistro("45")), {valida: true, edad: 45});
  assert.deepEqual(plano(validarEdadRegistro(120)), {valida: true, edad: 120});
  assert.deepEqual(plano(validarEdadRegistro(121)), {valida: false, motivo: "invalida"});
  // Sin coercion de tipos: arreglos, objetos, booleanos y textos no decimales son invalidos.
  for (const v of [null, undefined, "", " ", "abc", 17.5, NaN, Infinity, [], [18], ["18"], {}, {valueOf: () => 18}, true, false, "0x12", "1e1", "18abc", "Infinity", 18n]) assert.deepEqual(plano(validarEdadRegistro(v)), {valida: false, motivo: "invalida"}, String(v));
});

test("la regla vive solo en validarEdad.ts y no se usa en los participantes de cursos", () => {
  const route = readFileSync(REGISTER, "utf8");
  assert.match(route, /from "@\/lib\/validarEdad"/);
  assert.doesNotMatch(route, /edad\s*(<|<=|>|>=)\s*\d|\b18\b|\b120\b/);
  assert.ok(!/validarEdad/.test(readFileSync("src/lib/validators/compras-cursos.ts", "utf8")));
  assert.ok(!/validarEdad/.test(readFileSync("src/lib/validators/cursos.ts", "utf8")));
});
