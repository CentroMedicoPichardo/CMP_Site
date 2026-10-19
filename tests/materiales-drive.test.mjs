import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {resolve, dirname} from "node:path";
import {createRequire} from "node:module";
import vm from "node:vm";
import ts from "typescript";
import {PgDialect} from "drizzle-orm/pg-core";

const realRequire = createRequire(import.meta.url);
const LINK = "https://drive.google.com/drive/folders/fixture_folder?usp=sharing";
const ROUTE = "src/app/api/cliente/mis-cursos/[id]/materiales/route.ts";
function environment(options = {}) {
  const state = {user: 1, role: "admin", owner: 1, participant: 2, buyer: 3, enrollment: 7,
    start: "2026-10-18", end: "2026-10-20", today: "2026-10-18", status: "activo", link: LINK, fail: false, ...options};
  const cache = new Map(); const seen = {queries: [], writes: [], roles: [], logs: []};
  const dialect = new PgDialect();
  let selected;
  const row = () => ({idInscripcion: 7, idCurso: 2, estadoInscripcion: state.status,
    fechaInicio: state.start, fechaFin: state.end, urlMaterialesDrive: state.link, hoy: state.today,
    tituloCurso: "Curso de prueba", activo: true});
  const project = data => Object.fromEntries(Object.keys(selected).map(key => [key, data[key]]));
  const builder = {
    from() {return this;}, innerJoin() {return this;}, leftJoin() {return this;},
    where(condition) {this.condition = condition;return this;},
    async limit() {
      if (state.fail) throw new Error("private query " + state.link);
      const q = dialect.sqlToQuery(this.condition); seen.queries.push(q);
      if ('hoy' in selected) {
        const serverDate = dialect.sqlToQuery(selected.hoy);
        assert.ok(serverDate.sql.includes("CURRENT_TIMESTAMP AT TIME ZONE"));
        assert.deepEqual(serverDate.params, ["America/Mexico_City"]);
        assert.match(q.sql, /"inscripciones_cursos"\."id_inscripcion"/);
        assert.match(q.sql, /"participantes"\."usuario_id"/);
        assert.match(q.sql, /"comprascursosinacademia"\."idusuario"/);
        const [id, ...users] = q.params;
        assert.equal(users.length, 3); assert.ok(users.every(user => user === state.user));
        return id === state.enrollment && [state.owner,state.participant,state.buyer].includes(state.user) ? [project(row())] : [];
      }
      return [project(row())];
    },
    async orderBy() {return [project(row())];},
    values(data) {seen.writes.push(data); return this;}, set(data) {seen.writes.push(data);return this;},
    async returning() {return [{idCurso: 2, ...seen.writes.at(-1)}];},
  };
  const db = {async execute() {return [];}, select(shape) {selected=shape; return Object.create(builder);}, insert() {return Object.create(builder);}, update() {return Object.create(builder);}};
  const session = () => state.user ? {user: {id:state.user, rol:state.role, correo:"fixture@example.com"}} : null;
  const fakeAuth = {auth: async()=>session(), requireApiAuth: async()=>({session:session(),error:state.user?null:Response.json({}, {status:401})}),
    requireApiRole:async role=>{seen.roles.push(role);return {session:session(),error:!state.user?Response.json({}, {status:401}):state.role!==role?Response.json({}, {status:403}):null};}};
  function load(name) {
    const path = resolve(name);
    if (cache.has(path)) return cache.get(path).exports;
    const loadedModule={exports:{}};cache.set(path,loadedModule);
    const output=ts.transpileModule(readFileSync(path,"utf8"), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true},fileName:path}).outputText;
    const require = spec => {
      if(spec==='@/lib/db' || (spec==='./db' && path.endsWith('db-with-user.ts')))return {db};
      if(spec==='@/lib/auth')return fakeAuth;
      if(spec==='@/lib/db-with-user')return {withUserEmail:async(_email, fn)=>fn()};
      if(spec==='next/server')return {NextResponse:{json:(body,init)=>Response.json(body,init)}};
      if(spec.startsWith('@/') || spec.startsWith('.')) {
        let target=spec.startsWith('@/')?resolve('src',spec.slice(2)):resolve(dirname(path),spec);
        if(!/\.tsx?$/.test(target)) {try {readFileSync(target+'.ts');target+='.ts';} catch {target+='/index.ts';}}
        return load(target);
      }
      // No unmocked database client or outbound transport can load.
      assert.ok(!['postgres','pg','jose','next/headers'].includes(spec), 'unexpected I/O dependency '+spec);
      return realRequire(spec);
    };
    vm.runInNewContext(output,{module:loadedModule,exports:loadedModule.exports,require,URL,Response,Request,Headers,
      console:{error:(...args)=>seen.logs.push(args),log:(...args)=>seen.logs.push(args)},process:{env:{}},TextEncoder,Buffer},{filename:path});
    return loadedModule.exports;
  }
  async function materials(id='7') {return load(ROUTE).GET(new Request('https://cmp.test/api/cliente/mis-cursos/'+id+'/materiales'),{params:Promise.resolve({id})});}
  return {state,seen,load,materials};
}
for (const [today,expected] of [['2026-10-17','no_iniciado'],['2026-10-18','disponible'],['2026-10-19','disponible'],['2026-10-20','disponible'],['2026-10-21','finalizado']]) {
  test('API fecha inclusiva '+today,async()=>{const env=environment({today});const response=await env.materials();assert.equal(response.status,200);const body=await response.json();assert.equal(body.estado,expected);assert.equal(body.url,expected==='disponible'?LINK:undefined);assert.match(response.headers.get('cache-control'),/no-store/);});
}
for (const user of [1,2,3]) test('pertenencia existente autorizada '+user,async()=>assert.equal((await (await environment({user}).materials()).json()).estado,'disponible'));
for (const [options,status] of [[{user:0},401],[{user:99},404],[{status:'cancelado'},403],[{status:'pendiente'},403],[{fail:true},500]]) {
  test('denegación sin filtrar URL '+JSON.stringify(options),async()=>{const env=environment(options);const response=await env.materials();assert.equal(response.status,status);assert.ok(!(await response.text()).includes(LINK));assert.equal(env.seen.logs.length,0);if(options.user===0)assert.equal(env.seen.queries.length,0);});
}
for(const id of ['0','-1','1e2','7x','9007199254740992'])test('ID inválido '+id,async()=>{const e=environment();assert.equal((await e.materials(id)).status,400);assert.equal(e.seen.queries.length,0);});
for(const link of [null,'','https://evil.test/drive/folders/fixture','http://drive.google.com/drive/folders/fixture','https://drive.google.com.evil.test/drive/folders/fixture','https://drive.google.com/file/d/fixture','https://user@drive.google.com/drive/folders/fixture','https://drive.google.com/drive/folders/fixture?redirect=https://evil.test','https://drive.google.com/drive/folders/fixture#fragment','https://drive.google.com:444/drive/folders/fixture']) {
  test('enlace ausente o rechazado sin URL '+String(link),async()=>{const e=environment({link});const response=await e.materials();assert.deepEqual(await response.json(),{success:true,idInscripcion:7,idCurso:2,estado:'sin_materiales'});});
}
test('hora SQL explicita México; frontera UTC no determina vigencia',async()=>{const instant=new Date('2026-10-18T02:00:00Z');const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Mexico_City',year:'numeric',month:'2-digit',day:'2-digit'}).format(instant);assert.equal(today,'2026-10-17');assert.equal((await (await environment({today}).materials()).json()).estado,'no_iniciado');});
test('público nunca obtiene el campo; admin sí y con no-store',async()=>{for(const name of ['src/app/api/cursos/route.ts','src/app/api/cursos/[id]/route.ts'])for(const admin of [false,true]) {const e=environment({user:admin?1:0});const request=new Request('https://cmp.test/api/cursos'+(admin?'?admin=true':''));const response=await e.load(name).GET(request,{params:Promise.resolve({id:'2'})});assert.equal(response.status,200);const body=await response.json();const data=Array.isArray(body)?body[0]:body;assert.equal(Object.hasOwn(data,'urlMaterialesDrive'),admin);if(admin)assert.equal(data.urlMaterialesDrive,LINK);}});
const valid={tituloCurso:'Curso',descripcion:null,idInstructor:1,idCategoria:1,idModalidad:1,idUbicacion:null,fechaInicio:'2026-10-18',fechaFin:'2026-10-20',horario:null,dirigidoA:'Padres',cupoMaximo:10,costo:'10.00',urlImagenPortada:null};
test('validación de escritura permite asignar, quitar y omitir sin borrar',()=>{const {validarCrearCurso:validate}=environment().load('src/lib/validators/cursos.ts');for(const link of [LINK,null,'']){const r=validate({...valid,urlMaterialesDrive:link});assert.equal(r.success,true);assert.equal(r.data.urlMaterialesDrive,link||null);}assert.equal(Object.hasOwn(validate(valid).data,'urlMaterialesDrive'),false);assert.equal(validate({...valid,urlMaterialesDrive:'https://evil.test'}).success,false);});
test('solo admin modifica el enlace; campos persistidos y respuesta administrativa',async()=>{for(const role of ['cliente','admin'])for(const method of ['POST','PUT']){const e=environment({role});const name=method==='POST'?'src/app/api/cursos/route.ts':'src/app/api/cursos/[id]/route.ts';const response=await e.load(name)[method](new Request('https://cmp.test/api/cursos',{method,body:JSON.stringify({...valid,activo:true,urlMaterialesDrive:LINK})}),{params:Promise.resolve({id:'2'})});assert.equal(response.status,role==='admin'?(method==='POST'?201:200):403);assert.deepEqual(e.seen.roles,['admin']);if(role==='admin')assert.equal(e.seen.writes[0].urlMaterialesDrive,LINK);else assert.equal(e.seen.writes.length,0);}});

test('integración en memoria: API CMP_Site -> HTTP/servicio/repositorio CMP_Movil', {skip: !process.env.CMP_MOBILE_REPO}, async () => {
  const mobileRoot = resolve(process.env.CMP_MOBILE_REPO); const env = environment(); const modules=new Map(); let account=1;
  const storage={getSessionVersion:()=>0,getAccessToken:async()=>account?'fixture-access':null,getRefreshToken:async()=>null,clearTokens:async()=>{}};
  const fetchIsolated=async(input,options)=>{
    const url=new URL(input);assert.equal(url.origin,'https://cmp.test');
    assert.match(url.pathname,/^\/api\/cliente\/mis-cursos\/\d+\/materiales$/);
    env.state.user=new Headers(options.headers).get('Authorization')==='Bearer fixture-access'?account:0;
    return env.materials(url.pathname.split('/').at(-2));
  };
  function load(name){
    const full=resolve(mobileRoot,name);if(modules.has(full))return modules.get(full).exports;
    const loaded={exports:{}};modules.set(full,loaded);
    const output=ts.transpileModule(readFileSync(full,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
    const require=spec=>{
      const target=resolve(dirname(full),spec)+'.ts';
      if(target.endsWith('config\\apiConfig.ts')||target.endsWith('config/apiConfig.ts'))return {API_BASE_URL:'https://cmp.test/api'};
      if(target.endsWith('security\\tokenStorage.ts')||target.endsWith('security/tokenStorage.ts'))return {tokenStorage:storage};
      assert.ok(spec.startsWith('.'),'Unexpected mobile dependency '+spec);return load(target);
    };
    vm.runInNewContext(output,{module:loaded,exports:loaded.exports,require,URL,Headers,fetch:fetchIsolated,AbortController,setTimeout,clearTimeout},{filename:full});return loaded.exports;
  }
  const {CourseMaterialsRepositoryImpl}=load('src/repositories/implementations/CourseMaterialsRepositoryImpl.ts');
  const {courseMaterialsService}=load('src/services/implementations/courseMaterialsService.ts');
  const repository=new CourseMaterialsRepositoryImpl(courseMaterialsService);
  assert.equal((await repository.getMaterials(7)).url,LINK);
  env.state.today='2026-10-21';const ended=await repository.getMaterials(7);assert.equal(ended.status,'finalizado');assert.equal(ended.url,undefined);
  env.state.today='2026-10-18';account=99;await assert.rejects(()=>repository.getMaterials(7),{status:404});
  account=0;await assert.rejects(()=>repository.getMaterials(7),{status:401});
});


test('auditoría no registra parámetros de errores SQL y conserva el fallo original', async () => {
  const env=environment();
  const {withUserEmail}=env.load('src/lib/db-with-user.ts');
  const failure=new Error('private query '+LINK);
  await assert.rejects(()=>withUserEmail('fixture@example.com',async()=>{throw failure;}),error=>error===failure);
  assert.ok(env.seen.logs.length>0);
  assert.ok(!JSON.stringify(env.seen.logs).includes(LINK));
});


test('migración idempotente y snapshot conservan todo el esquema histórico', () => {
  const previous=JSON.parse(readFileSync('drizzle/meta/0001_snapshot.json','utf8'));
  const current=JSON.parse(readFileSync('drizzle/meta/0002_snapshot.json','utf8'));
  assert.equal(current.prevId,previous.id);
  assert.notEqual(current.id,previous.id);
  assert.deepEqual(current.tables['academia.cursos'].columns.url_materiales_drive,
    {name:'url_materiales_drive',type:'text',primaryKey:false,notNull:false});
  delete current.tables['academia.cursos'].columns.url_materiales_drive;
  for(const field of ['id','prevId']) {delete current[field];delete previous[field];}
  assert.deepEqual(current,previous);
  const migration=readFileSync('drizzle/0002_materiales_drive.sql','utf8');
  assert.match(migration,/ADD COLUMN IF NOT EXISTS "url_materiales_drive" text/);
  assert.doesNotMatch(migration,/DROP|DELETE|UPDATE/i);
});
