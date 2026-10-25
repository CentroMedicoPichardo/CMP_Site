import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {resolve, dirname} from "node:path";
import {createRequire} from "node:module";
import vm from "node:vm";
import ts from "typescript";

const realRequire = createRequire(import.meta.url);
const SEND_OTP = "src/app/api/auth/send-otp/route.ts";
const EMAIL = "src/lib/email.ts";
const DB_WITH_USER = "src/lib/db-with-user.ts";
const CORREO = "juan.perez@gmail.com";

function environment(options = {}) {
  const state = {users: [], emailOk: true, emailThrows: false, smtpError: null, sendMailFails: false, dbFails: false, ...options};
  const cache = new Map();
  const seen = {console: [], otp: [], sent: [], executed: []};
  const record = (level) => (...args) => seen.console.push({level, text: args.map(a => a instanceof Error ? a.message + (a.stack ?? "") : typeof a === "string" ? a : JSON.stringify(a)).join(" ")});
  const consoleFake = {log: record("log"), error: record("error"), warn: record("warn"), info: record("info"), debug: record("debug")};

  const db = {
    select() {
      const builder = {from() {return builder;}, where() {return builder;},
        then(resolveFn, rejectFn) {return Promise.resolve().then(() => {if (state.dbFails) throw new Error("fallo de base de datos"); return state.users;}).then(resolveFn, rejectFn);}};
      return builder;
    },
    async execute(query) {seen.executed.push(query); if (state.dbFails) throw new Error("fallo de base de datos");},
  };
  const otpStore = {guardarOTP: (email, codigo) => {seen.otp.push({email, codigo});}};
  const nodemailerFake = {createTransport: () => ({
    verify: async () => {},
    sendMail: async (options) => {
      if (state.sendMailFails) throw new Error("SMTP caido");
      seen.sent.push(options); return {messageId: "id-1"};
    },
  })};
  const emailFake = {sendVerificationEmail: async () => {
    if (state.emailThrows) throw new Error("fallo inesperado del envio");
    return state.emailOk ? {success: true} : {success: false, error: state.smtpError ?? "SMTP caido"};
  }};

  function load(name, {realEmail = false} = {}) {
    const path = resolve(name);
    const key = path + (realEmail ? "#real" : "");
    if (cache.has(key)) return cache.get(key).exports;
    const loadedModule = {exports: {}}; cache.set(key, loadedModule);
    const output = ts.transpileModule(readFileSync(path, "utf8"), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true}, fileName: path}).outputText;
    const require = spec => {
      if (spec === "@/lib/db" || (spec === "./db" && path.endsWith("db-with-user.ts"))) return {db};
      if (spec === "@/lib/otpStore") return otpStore;
      if (spec === "@/lib/email" && !realEmail) return emailFake;
      if (spec === "nodemailer") return {default: nodemailerFake, ...nodemailerFake};
      if (spec === "next/server") return {NextResponse: {json: (body, init) => Response.json(body, init)}};
      if (spec.startsWith("@/") || spec.startsWith(".")) {
        let target = spec.startsWith("@/") ? resolve("src", spec.slice(2)) : resolve(dirname(path), spec);
        if (!/\.tsx?$/.test(target)) {try {readFileSync(target + ".ts"); target += ".ts";} catch {target += "/index.ts";}}
        return load(target);
      }
      assert.ok(!["postgres", "pg"].includes(spec), "unexpected dependency " + spec);
      return realRequire(spec);
    };
    vm.runInNewContext(output, {module: loadedModule, exports: loadedModule.exports, require, URL, Response, Request, Headers, Date, Promise,
      console: consoleFake, process: {env: {GMAIL_USER: "cuenta@example.com", GMAIL_APP_PASSWORD: "x"}}, TextEncoder, Buffer, Math}, {filename: path});
    return loadedModule.exports;
  }

  const post = body => load(SEND_OTP).POST(new Request("https://cmp.test/api/auth/send-otp", {
    method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify(body)}));
  const allLogs = () => seen.console.map(c => c.text).join("\n");
  return {state, seen, post, load, allLogs};
}

function assertSinDatosSensibles(env, {codigo, correo = CORREO} = {}) {
  const logs = env.allLogs();
  if (codigo) assert.ok(!logs.includes(codigo), "el codigo OTP aparece en los logs");
  assert.ok(!logs.includes(correo), "el correo completo aparece en los logs");
  assert.ok(!/C[ÓO]DIGO[^\n]*\d{6}/i.test(logs), "hay un codigo de 6 digitos junto a la palabra codigo");
}

test("send-otp no registra el codigo OTP ni el correo completo en ningun log", async () => {
  const env = environment();
  const response = await env.post({email: CORREO, nombre: "Juan"});
  assert.equal(response.status, 200);
  assert.equal(env.seen.otp.length, 1);
  const {codigo} = env.seen.otp[0];
  assert.match(codigo, /^\d{6}$/);
  assertSinDatosSensibles(env, {codigo});
  assert.ok(!env.allLogs().includes("Juan"), "el nombre aparece en los logs");
  // se conserva una traza util y enmascarada
  assert.match(env.allLogs(), /Código OTP generado para j\*\*\*@gmail\.com/);
});

test("send-otp no registra el codigo cuando falla el envio del correo (resultado fallido o excepcion)", async () => {
  for (const options of [{emailOk: false, smtpError: "550 mailbox unavailable"}, {emailThrows: true}]) {
    const env = environment(options);
    const response = await env.post({email: CORREO, nombre: "Juan"});
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.emailEnviado, false);
    assertSinDatosSensibles(env, {codigo: env.seen.otp[0].codigo});
  }
});

test("send-otp: el comportamiento HTTP y el OTP no cambian", async () => {
  const ok = environment();
  const response = await ok.post({email: CORREO, nombre: "Juan"});
  assert.deepEqual(await response.json(), {success: true, message: "Código de verificación enviado a tu correo", email: CORREO, emailEnviado: true});
  assert.equal(ok.seen.otp[0].email, CORREO);

  const sinEmail = environment();
  assert.equal((await sinEmail.post({nombre: "Juan"})).status, 400);
  assert.equal(sinEmail.seen.otp.length, 0);

  const existente = environment({users: [{id: 1}]});
  const conflicto = await existente.post({email: CORREO});
  assert.equal(conflicto.status, 409);
  assert.deepEqual(await conflicto.json(), {error: "El correo ya está registrado"});
  assert.equal(existente.seen.otp.length, 0);

  const falla = environment({dbFails: true});
  assert.equal((await falla.post({email: CORREO})).status, 500);
  assert.ok(!falla.allLogs().includes(CORREO));
});

test("sendVerificationEmail sigue enviando el codigo por correo, pero sin registrarlo ni loguear el destinatario completo", async () => {
  for (const sendMailFails of [false, true]) {
    const env = environment({sendMailFails});
    const {sendVerificationEmail} = env.load(EMAIL, {realEmail: true});
    const result = await sendVerificationEmail(CORREO, "Juan", "482913");
    assert.equal(result.success, !sendMailFails);
    if (!sendMailFails) {
      assert.equal(env.seen.sent.length, 1);
      assert.equal(env.seen.sent[0].to, CORREO);
      assert.ok(env.seen.sent[0].html.includes("482913"), "el correo debe seguir llevando el codigo");
    }
    assertSinDatosSensibles(env, {codigo: "482913"});
  }
});

test("sendEmail enmascara el destinatario en sus logs de exito y error", async () => {
  const ok = environment();
  await ok.load(EMAIL, {realEmail: true}).sendEmail(CORREO, "Asunto", "<p>hola</p>");
  assert.match(ok.allLogs(), /Email enviado a j\*\*\*@gmail\.com/);
  assertSinDatosSensibles(ok);
  const fallo = environment({sendMailFails: true});
  await fallo.load(EMAIL, {realEmail: true}).sendEmail(CORREO, "Asunto", "<p>hola</p>");
  assert.match(fallo.allLogs(), /Error enviando a j\*\*\*@gmail\.com/);
  assertSinDatosSensibles(fallo);
});

test("withUserEmail no registra el correo completo y conserva su comportamiento", async () => {
  const env = environment();
  const {withUserEmail} = env.load(DB_WITH_USER);
  assert.equal(await withUserEmail(CORREO, async () => "resultado"), "resultado");
  assert.equal(env.seen.executed.length, 3); // crear tabla temporal, guardar correo, limpiar
  assertSinDatosSensibles(env);

  const fallo = environment();
  const error = new Error("fallo del callback");
  await assert.rejects(() => fallo.load(DB_WITH_USER).withUserEmail(CORREO, async () => {throw error;}), e => e === error);
  assert.match(fallo.allLogs(), /Error en operación con usuario: j\*\*\*@gmail\.com/);
  assertSinDatosSensibles(fallo);

  const sistema = environment();
  await sistema.load(DB_WITH_USER).withUserEmail("sistema", async () => 1);
  assertSinDatosSensibles(sistema);
});

test("enmascararCorreo", () => {
  const {enmascararCorreo} = environment().load("src/lib/enmascararCorreo.ts");
  assert.equal(enmascararCorreo("juan.perez@gmail.com"), "j***@gmail.com");
  assert.equal(enmascararCorreo("a@x.mx"), "a***@x.mx");
  assert.equal(enmascararCorreo("sistema"), "sistema");
  assert.equal(enmascararCorreo(""), "(vacío)");
  assert.equal(enmascararCorreo(undefined), "(vacío)");
  assert.equal(enmascararCorreo(42), "(vacío)");
  assert.equal(enmascararCorreo("@dominio.com"), "***");
});

test("ningun console.* del codigo afectado interpola el codigo OTP, el correo sin enmascarar ni el nombre", () => {
  for (const file of [SEND_OTP, EMAIL, DB_WITH_USER]) {
    const source = readFileSync(file, "utf8");
    const llamadas = source.match(/console\.(log|error|warn|info|debug)\([^;]*\);/g) ?? [];
    for (const llamada of llamadas) {
      assert.doesNotMatch(llamada, /codigo|código:|\$\{email\}|\$\{to\}|\$\{userEmail\}|\bnombre\b|\{ email/i, file + ": " + llamada);
    }
  }
});
