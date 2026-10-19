# Materiales de cursos: contrato y verificación técnica

## Entorno y datos

La columna `academia.cursos.url_materiales_drive TEXT NULL` ya existe en producción según la confirmación del responsable. No se ejecutó SQL ni se conectaron pruebas a esa base. Se sincroniza `src/lib/schema/schema.ts`, que es el esquema real importado por la aplicación; `drizzle.config.ts` apuntaba a un archivo inexistente y ahora señala ese esquema.

`drizzle/0002_materiales_drive.sql` añade la columna mediante `IF NOT EXISTS` para entornos aislados. Su journal/snapshot conservan las entradas anteriores. El historial existente incluye migraciones de creación de esquema: revisar su aplicación real antes de ejecutar cualquier cadena. No ejecutar `push`, `migrate`, `pull` ni todo el historial contra producción por esta entrega. No se ejecuta ninguna migración desde el arranque o las pruebas.

El rollback recomendado de la aplicación conserva la columna nullable y sus datos. El SQL de `drizzle/rollback/0002_materiales_drive.sql` es opcional, manual y solo para una base aislada; rechaza retirar la columna si contiene enlaces y no está registrado como una migración ascendente. No se ejecutó.

No se encontró una configuración global de zona de negocio. Para materiales se establece explícitamente `America/Mexico_City`, sin cambiar otras operaciones. PostgreSQL produce el día con `to_char(CURRENT_TIMESTAMP AT TIME ZONE ..., 'YYYY-MM-DD')`. Inicio y fin son inclusivos, por día calendario en esa zona. El reloj Android no decide el acceso.

## Administración y API

La creación/edición existente de cursos incluye un campo opcional de carpeta Drive. Un valor vacío/null quita el enlace; un PUT de un cliente antiguo que omita el campo conserva el valor. POST/PUT reutilizan `requireApiRole('admin')` y la auditoría existente. Se validan esquema HTTPS, host exacto `drive.google.com`, ruta `/drive/folders/ID` o `/drive/u/N/folders/ID`, sin credenciales, fragmentos ni consultas desconocidas. Solo se admiten `usp` y `resourcekey` como parámetros opcionales no repetidos. No se consulta Google para verificar existencia ni permisos.

`GET /api/cursos` público y `GET /api/cursos/[id]` no revelan el campo a visitantes/clientes. La lista `?admin=true` y el detalle de un administrador sí permiten cargarlo para editarlo. Las respuestas con datos administrativos/materiales llevan `no-store`.

`GET /api/cliente/mis-cursos/[id]/materiales` recibe ID de inscripción, no ID de curso. Reutiliza autenticación web/JWT móvil y la pertenencia del detalle existente: titular, participante vinculado o comprador. Usa los estados vigentes ya definidos: `activo`, `Activo`, `confirmada`, `Confirmada`. No añade derechos nuevos para compradores ni altera inscripciones, sesiones o asistencia.

- 200: `{success:true,idInscripcion,idCurso,estado}`. Estados: `no_iniciado`, `finalizado`, `sin_materiales`, `disponible`.
- Solo `disponible` incluye `url`; no hay enlace en los otros estados.
- 401: sin sesión válida; 403: inscripción propia no vigente; 404: inscripción inexistente o ajena, sin distinguirlas; 400: ID inválido; 500: error genérico sin datos de consulta.
- Todas las respuestas del endpoint usan `Cache-Control: private, no-store` y `Vary: Authorization, Cookie`. Los errores no registran el enlace ni objetos SQL.

## App y pruebas

La app añade servicio, repositorio, ViewModel y panel de materiales al detalle de Mis cursos. La URL no se persiste ni se incluye en estado React. Cada pulsación vuelve a consultar el servidor, valida la respuesta y abre con Linking. Cambios de inscripción, cuenta, versión de sesión, logout o desmontaje invalidan respuestas pendientes. Al volver a primer plano se actualiza disponibilidad. Se retiran las tarjetas de porcentaje de avance móvil, conservando la consulta de sesiones/asistencia y el historial del backend.

Pruebas sin base real:

```powershell
$env:CMP_MOBILE_REPO = 'C:\ruta\CMP_Movil'
node --test a17-offline.test.mjs tests/pwa-sw.test.mjs tests/materiales-drive.test.mjs
```

La prueba cruzada usa las capas reales de ambos proyectos y transporte/PostgreSQL simulados. Sin `CMP_MOBILE_REPO`, ese caso se informa como omitido. No equivale a una prueba con PostgreSQL ni a una prueba E2E nativa Samsung.

## Prueba manual segura

CMPBD (Neon) es la única base disponible y es producción. Tanto Production como Preview deben tratarse como conectados a esa base. Las pruebas automatizadas usan mocks y los builds locales se ejecutan sin archivos .env, con conexión PostgreSQL ficticia y bloqueo de red. No ejecutar migraciones, seeds ni pruebas con escrituras sobre CMPBD.

1. La prueba funcional queda pendiente de autorización posterior al despliegue. Limitar la edición al curso ficticio 2502, «Prueba de Compra», desde `/cursos-admin`. Conservar fechas 2026-10-15 a 2026-10-20, estado e inscripciones. No crear cursos, compras ni inscripciones para esta prueba.
2. Con la autorización correspondiente, abrir Editar, asignar el enlace de la carpeta de prueba al campo de materiales y guardar; volver a abrir para verificarlo. No guardar el enlace durante la preparación de la PR. El cambio conserva la auditoría habitual del panel.
3. Validar en mocks las fechas límite, estados de inscripción, URLs inválidas y acceso ajeno. En producción, usar únicamente la cuenta de prueba ya inscrita y el curso 2502; comprobar que el catálogo público omita el vínculo. No cambiar las fechas productivas para simular escenarios.
4. Después de publicar el backend, compilar CMP_Movil con `CMP_API_BASE_URL=https://cmp-site.vercel.app/api` en ambas terminales: reiniciar Metro mediante `npm.cmd start -- --reset-cache` y ejecutar `npm.cmd run android -- --no-packager` en otra terminal. El host debe estar confirmado en Domains de Vercel. El APK Release previamente generado usa un host ficticio y requiere recompilación. Esta entrega backend no modifica ni publica CMP_Movil ni fusiona su Draft PR.
5. En Samsung: Mis cursos → Ver detalle → Ver materiales del curso. El endpoint recibe ID de inscripción, no el ID de curso 2502. Comprobar apertura del PDF, retorno a la app, pérdida de red/reintento y cierre de sesión durante una consulta. Los cambios de fechas y las carreras se prueban con mocks. Desde el 21 de octubre el curso debe informar periodo finalizado.
6. Release local conserva la firma debug preexistente: no distribuir ni subir a Play. La firma de distribución corresponde a una etapa independiente de A75.

## Permisos y límites de Google Drive

El backend protege la entrega del vínculo, no los permisos de la carpeta ni enlaces ya abiertos/copias descargadas. Finalizar el curso, quitar el enlace o cerrar sesión no revoca acceso directo a Drive.

La institución debe decidir y configurar la carpeta fuera de la app. Con acceso restringido, debe conceder manualmente permisos de Lector a las cuentas/grupos Google autorizados; la sesión CMP no concede permisos Google. Con “cualquier persona con el enlace”, quien conserve/reciba el vínculo puede abrirlo fuera del periodo. No se modificó ninguna configuración de Drive ni se añadió Drive API, OAuth o permisos individuales automáticos.

Referencia oficial: https://support.google.com/drive/answer/7166529

## Publicación mediante PR y condición de merge

La rama `feature/A42-A45-materiales-drive` incorpora `origin/main` (`82a552936f58512127124ad197dcdfaaf294bfe6`) mediante fast-forward. La PR se dirige a `main`, con el título `feat(A42-A45): habilitar materiales de cursos mediante Google Drive`. El usuario autorizó commit, push y creación de PR; el merge queda condicionado a verificar los checks y los ajustes privados de Vercel. No modificar CMP_Movil ni su Draft PR.

El repositorio define `build: next build` y no tiene hooks de instalación/build, migraciones ni seeds. `vercel.json` conserva el cron existente de expiración de compras; no invocarlo como prueba. No añadir DDL a la publicación: la columna ya existe. Antes del merge, confirmar en Vercel `Environments → Production → Branch Tracking` (main), `Build and Deployment` (Build/Install Command y Overrides sin migraciones/seeds), `Git` (repositorio correcto) y `Domains` (dominio productivo). Un Preview no constituye una base aislada y no autoriza pruebas con escrituras sobre CMPBD.

## Reversión del código en Vercel

Punto de referencia anterior a esta PR: despliegue Production `FBhW6HrZ3a9syuXWUJwC14h2xV7X`, commit `82a552936f58512127124ad197dcdfaaf294bfe6`, proyecto `centromedicopichardos-projects/cmp-site`. Confirmar inmediatamente antes de publicar que siga siendo el despliegue anterior elegible y registrar el ID del nuevo despliegue si se autoriza el merge.

Si hay regresiones, detener pruebas y usar `Instant Rollback` desde el proyecto/Deployments, verificar los dominios y restaurar el despliegue previo con autorización. Conservar la columna y todos los datos; no ejecutar el SQL de rollback en CMPBD. La versión anterior carece del endpoint de materiales, por lo que la app nueva mostrará el error de materiales/reintento sin revocar enlaces ya obtenidos. La reversión de Vercel no cambia Git: cualquier corrección/reversión posterior del código se revisará en otra PR, sin reescribir historial. Después de Instant Rollback, Vercel desactiva la asignación automática de dominios; su reactivación requiere revisar la corrección y promover el despliegue elegido.

Referencia: https://vercel.com/docs/instant-rollback


## Archivos de esta entrega

CMP_Site: 10 modificados y 7 nuevos (17 archivos). Rama `feature/A42-A45-materiales-drive`; publicación mediante PR a main.

```text
drizzle.config.ts
drizzle/meta/_journal.json
drizzle/0002_materiales_drive.sql (nuevo)
drizzle/meta/0002_snapshot.json (nuevo)
drizzle/rollback/0002_materiales_drive.sql (nuevo)
src/lib/schema/schema.ts
src/types/cursos.ts
src/lib/validators/cursos.ts
src/lib/cursos/materiales.ts (nuevo)
src/lib/db-with-user.ts
src/app/api/cursos/route.ts
src/app/api/cursos/[id]/route.ts
src/app/api/cursos/verificar-inscripcion/route.ts
src/app/api/cliente/mis-cursos/[id]/materiales/route.ts (nuevo)
src/components/admin/cursos/CursoFormModal.tsx
tests/materiales-drive.test.mjs (nuevo)
docs/materiales-drive.md (nuevo)
```

CMP_Movil: 5 modificados y 10 nuevos (15 archivos de esta entrega). Se conserva `fix/A17-sesion-movil` y el Draft PR #123. README, docs/architecture/MVVM.md y los nueve archivos docs/quality ya tenían cambios anteriores; no se editaron por esta funcionalidad.

```text
babel.config.js
src/config/apiConfig.ts
src/config/dependencies.ts
src/screens/myCourses/MyCoursesScreen.tsx
src/screens/myCourses/MyCourseDetailScreen.tsx
src/models/CourseMaterials.ts (nuevo)
src/services/contracts/CourseMaterialsService.ts (nuevo)
src/services/implementations/courseMaterialsService.ts (nuevo)
src/repositories/contracts/CourseMaterialsRepository.ts (nuevo)
src/repositories/implementations/CourseMaterialsRepositoryImpl.ts (nuevo)
src/viewmodels/myCourses/useCourseMaterialsViewModel.ts (nuevo)
src/components/myCourses/CourseMaterialsPanel.tsx (nuevo)
__tests__/academic/CourseMaterials.test.tsx (nuevo)
__tests__/academic/CourseMaterialsPanel.test.tsx (nuevo)
__tests__/quality/ApiEnvironment.test.js (nuevo)
```

## Verificaciones ejecutadas el 18 de octubre de 2026

- Jest móvil completo: 322 pruebas, 27 suites, todas aprobadas (48 casos nuevos). TypeScript sin errores. ESLint: 0 errores, las 10 advertencias `no-void` previas.
- Backend: `node --test a17-offline.test.mjs tests/pwa-sw.test.mjs tests/materiales-drive.test.mjs`, con `CMP_MOBILE_REPO` definido: 53 aprobadas, 0 fallos, 0 omitidas. Incluye 35 casos nuevos, integración en memoria entre ambos repositorios, auditoría sin parámetros privados e integridad del snapshot/migración. Autenticación, reloj y transporte/base están simulados; se comprueba el SQL compilado real de Drizzle, sin ejecutar PostgreSQL.
- TypeScript backend: `tsc --noEmit --incremental false`, sin errores. ESLint completo conserva exactamente la línea base: 82 errores y 48 advertencias; ningún diagnóstico nuevo. Los errores previos son 62 `no-explicit-any`, 19 `react-hooks/set-state-in-effect` y uno `prefer-const`; quedan fuera de esta entrega.
- `npm run build` (`next build`, Turbopack): exitoso, código 0, después de integrar origin/main. Copia temporal sin archivos .env ni credenciales, URL PostgreSQL ficticia local y red restringida a Google Fonts y al IPC local del compilador. PostgreSQL/SMTP bloqueados. El import de email existente imprime avisos SMTP bloqueado; se verificaron BUILD_ID y el manifiesto del nuevo endpoint. El primer intento se detuvo para ajustar el IPC del aislamiento; la ejecución final completó todas las etapas. La validación anterior con webpack también había pasado. No demuestra funcionamiento con PostgreSQL real.
- Android: `:app:assembleDebug :app:assembleRelease --offline --no-daemon --console=plain`, exitoso. Release conserva R8/reducción de recursos y firma debug existente. Gradle emite advertencias de APIs obsoletas previas. Se compiló con `CMP_API_BASE_URL=https://materials.example.invalid/api`; se verificó el host de pruebas y el texto del botón en el bundle Release. Es un artefacto de validación, sin instalación ni prueba en Samsung, que requiere recompilar contra el entorno HTTPS aislado para una prueba funcional.
- Semgrep: reglas `p/typescript` y `p/secrets`, 110 reglas, 19 archivos de código relacionados, 0 hallazgos. No es un escaneo de todos los archivos históricos ni reemplaza la revisión manual.
- `git diff --check` sin errores. Se autoriza publicar únicamente los 17 archivos backend mediante commit y PR a main. No se ejecuta SQL ni se modifica CMP_Movil. El merge y el despliegue Production quedan condicionados a revisar la configuración privada de Vercel. Los snapshots anteriores permanecen intactos.

- Preparación de la PR: fetch y fast-forward a origin/main completados; los 17 archivos se respaldaron en TEMP antes de integrar. Backend: 53 pruebas y TypeScript aprobados; ESLint conserva 82 errores/48 advertencias previos sin diagnósticos nuevos. Semgrep: 110 reglas en 11 archivos de código, 0 hallazgos; revisión adicional de patrones sensibles en los 17 archivos sin resultados. El enlace del curso 2502 no se guarda durante esta publicación.
