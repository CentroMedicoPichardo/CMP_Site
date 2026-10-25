-- Revisar el entorno y el historial antes de ejecutar. Crea las tablas de documentos legales y de
-- aceptaciones, y siembra la version 1.0 del Aviso de Privacidad y de los Terminos y Condiciones.
-- Idempotente: no toca filas ni tablas existentes y no vuelve a insertar una version ya sembrada.
-- drizzle-kit generate produce el diff completo contra el snapshot (que no incluye analitica ni soporte);
-- se recorta a las tablas nuevas, igual que 0002 a 0004.
CREATE TABLE IF NOT EXISTS "seguridad"."documentos_legales" (
	"id_documento" serial PRIMARY KEY NOT NULL,
	"tipo" varchar(30) NOT NULL,
	"version" varchar(20) NOT NULL,
	"resumen" text NOT NULL,
	"contenido" text NOT NULL,
	"vigente_desde" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "uq_documento_legal_tipo_version" UNIQUE("tipo","version"),
	CONSTRAINT "chk_documento_legal_tipo" CHECK ((tipo)::text = ANY ((ARRAY['aviso_privacidad'::character varying, 'terminos_condiciones'::character varying])::text[]))
);
--> statement-breakpoint
-- Garantiza un unico documento activo por tipo a la vez.
CREATE UNIQUE INDEX IF NOT EXISTS "idx_documento_legal_activo_unico" ON "seguridad"."documentos_legales" USING btree ("tipo" text_ops) WHERE (activo = true);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seguridad"."aceptaciones_legales" (
	"id_aceptacion" bigserial PRIMARY KEY NOT NULL,
	"usuario_id" integer NOT NULL,
	"id_documento" integer NOT NULL,
	"fecha_aceptacion" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "uq_aceptacion_usuario_documento" UNIQUE("usuario_id","id_documento"),
	CONSTRAINT "fk_aceptacion_legal_usuario" FOREIGN KEY ("usuario_id") REFERENCES "seguridad"."usuarios"("id") ON DELETE cascade ON UPDATE no action,
	CONSTRAINT "fk_aceptacion_legal_documento" FOREIGN KEY ("id_documento") REFERENCES "seguridad"."documentos_legales"("id_documento") ON DELETE no action ON UPDATE no action
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_aceptaciones_legales_usuario" ON "seguridad"."aceptaciones_legales" USING btree ("usuario_id" int4_ops);
--> statement-breakpoint
-- Datos semilla: version 1.0 de cada documento, activos. Si esa version ya existe no se vuelve a insertar.
-- La seccion 5 de los Terminos (Cancelaciones y reembolsos) es provisional hasta que el negocio defina la
-- politica; entonces se publica la version 1.1.
INSERT INTO "seguridad"."documentos_legales" ("tipo", "version", "resumen", "contenido", "vigente_desde", "activo")
SELECT v.tipo, v.version, v.resumen, v.contenido, CURRENT_TIMESTAMP, true
FROM (
VALUES
(
  'aviso_privacidad',
  '1.0',
  'CMP Móvil recaba tus datos de cuenta, los de los participantes que registres en un curso, tus compras y pagos, y tu actividad académica, para prestarte el servicio y, con tu consentimiento, para comunicarte promociones y generar recomendaciones. Puedes ejercer tus derechos ARCO y oponerte a los usos secundarios desde Mi cuenta. Si solicitas eliminar tu cuenta, tus datos se dan de baja lógica por 18 meses y después se anonimizan de forma irreversible.',
  $AVISO$
# Aviso de Privacidad
## CMP Móvil — Centro Médico Pichardo

## 1. Identidad y domicilio del responsable

**Centro Médico Pichardo** (en adelante, "el Responsable" o "CMP"), con domicilio en Calle Alcatraz s/n, Colonia Los Prados, Huejutla de Reyes, Hidalgo, México, es responsable del tratamiento de los datos personales que usted proporcione a través de la aplicación móvil **CMP Móvil** (SIMG-CMP Móvil), de conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento.

Para cualquier asunto relacionado con el tratamiento de sus datos personales, puede contactarnos en:
- Correo electrónico: centromedicopichardo@gmail.com
- Teléfono: 771 140 8883
- Horario de atención: lunes a sábado de 9:30 a 20:00 h, y domingo de 10:00 a 14:00 h

## 2. Datos personales que recabamos y para qué los usamos

A través de CMP Móvil recabamos los siguientes datos personales, directamente de usted (el titular) o de las personas que usted registre como participantes de un curso:

### 2.1 Datos de identificación y contacto de su cuenta
Nombre, apellido paterno, apellido materno, edad, sexo, teléfono y correo electrónico, así como una contraseña que almacenamos únicamente como una huella criptográfica irreversible (hash), nunca en texto plano ni "desencriptable".

**Finalidad primaria** (necesaria para la relación con usted): crear y administrar su cuenta de usuario; identificarlo y autenticarlo cada vez que inicia sesión; permitirle consultar y rectificar sus propios datos (derecho de acceso y rectificación); comunicarnos con usted sobre su cuenta, sus compras y su actividad académica; y dar cumplimiento a las obligaciones que, como prestador del servicio, tenemos frente a usted.

### 2.2 Datos de los participantes que usted registre en un curso
Cuando usted compra o reserva un curso para otra persona (por ejemplo, un familiar), recabamos de esa persona: nombre, apellido paterno, apellido materno, fecha de nacimiento, sexo, teléfono y correo electrónico (estos dos últimos opcionales).

**Finalidad primaria**: identificar al participante real del curso, gestionar su cupo, asistencia y constancias, y permitir que el Centro se comunique con el participante o con usted sobre ese curso en particular. Ver también la sección 3 sobre datos de menores de edad.

### 2.3 Datos de las compras, pagos y comprobantes
Curso adquirido, precio, estado de la compra (pendiente, pago reportado, en validación, validado, cancelada/expirada) e historial de esos estados; método de pago elegido; y, cuando usted reporta un pago, el comprobante que suba (imagen), el canal por el que avisó del pago y cualquier observación que agregue.

**Finalidad primaria**: procesar su solicitud de inscripción a un curso, validar administrativamente el pago reportado y mantener un registro contable y de atención a cliente de esa transacción.

### 2.4 Datos de su actividad académica
Sus inscripciones, su progreso y asistencia en los cursos tomados, y las notificaciones académicas que le enviamos (por ejemplo, avisos de una sesión próxima o de progreso), incluyendo si las ha leído.

**Finalidad primaria**: darle acceso a su historial académico ("Mis cursos"), avisarle de eventos relevantes de los cursos en los que está inscrito, y permitirle llevar control de su propio avance.

### 2.5 Preferencias de privacidad (Opt-Out)
Si usted activa o desactiva: (a) recibir comunicaciones no esenciales, (b) que su actividad se use con fines analíticos internos, y (c) compartir su progreso académico. Guardamos únicamente esas tres preferencias y la fecha en que las actualizó por última vez.

**Finalidad primaria**: respetar y aplicar su decisión sobre el uso secundario de sus datos (ver sección 2.6 y la sección 5 sobre cómo oponerse a ellas).

### 2.6 Finalidades secundarias (requieren su consentimiento y puede oponerse a ellas)
Con su consentimiento, y solo si usted no ha activado la opción de oponerse (Opt-Out) correspondiente, podemos usar sus datos para:
- Enviarle comunicaciones no esenciales: promociones, nuevos cursos u ofertas que no sean indispensables para prestarle el servicio ya contratado.
- Fines analíticos y de segmentación de clientes: analizar patrones de uso y de compra, agruparlo en segmentos de clientes y generar, con esa información, recomendaciones de cursos. Esta actividad no implica decisiones automatizadas que produzcan efectos jurídicos sobre usted sin intervención humana; se limita a sugerencias de contenido.
- Compartir su progreso académico con fines de reconocimiento o estadística agregada del Centro.

Usted puede oponerse a cada una de estas finalidades secundarias de forma independiente, en cualquier momento, desde la sección "Mi cuenta" de la app (ver sección 5), sin que ello afecte la prestación del servicio principal que ya contrató.

## 3. Datos personales que usted proporciona de otras personas (participantes de un curso)

Si usted registra a otra persona como participante de un curso —incluyendo, en su caso, a una hija, hijo o persona bajo su tutela—, usted declara y garantiza que cuenta con la autorización o la patria potestad/tutela necesaria para proporcionarnos esos datos personales, y que ha informado a esa persona (o a quien ejerza su representación legal) del tratamiento que les daremos conforme a este Aviso.

Cuando el participante registrado sea una persona menor de edad, el Responsable trata esos datos (nombre, fecha de nacimiento, sexo y, en su caso, contacto) exclusivamente para la finalidad descrita en el punto 2.2 (gestión del curso), bajo la responsabilidad y el consentimiento de quien ejerce la patria potestad o tutela y lo registra desde su propia cuenta. El Responsable no recaba directamente datos de personas menores de edad que no cuenten con cuenta propia en la aplicación.

## 4. Fundamento legal y tipo de consentimiento

El tratamiento de sus datos personales se realiza con fundamento en los artículos 8, 9, 16 y 36 de la LFPDPPP y en el consentimiento que usted otorga:

- **Datos de identificación y contacto, de participantes, de compras/pagos y de actividad académica** (secciones 2.1 a 2.4): su tratamiento es necesario para la relación jurídica que usted solicita (crear su cuenta y adquirir/gestionar cursos), por lo que basta su consentimiento tácito: al registrarse y usar la aplicación, aceptando expresamente este Aviso mediante la casilla de aceptación del registro, usted consiente este tratamiento.
- **Finalidades secundarias** (sección 2.6): requieren que usted no se haya opuesto expresamente. El no ejercer su derecho de oposición (Opt-Out) para una finalidad secundaria específica se entiende como consentimiento tácito para esa finalidad, revocable en cualquier momento.
- **Ningún dato personal considerado "sensible"** en términos del artículo 3, fracción VI de la LFPDPPP (origen racial o étnico, estado de salud presente o futuro, información genética, creencias religiosas, filosóficas o morales, afiliación sindical, opiniones políticas, preferencia sexual) es recabado por CMP Móvil. Si en el futuro la aplicación llegara a solicitar algún dato de esta naturaleza, ese tratamiento requerirá consentimiento expreso y por escrito y este Aviso deberá actualizarse antes de implementarse.

## 5. Transferencia de datos a terceros (encargados del tratamiento)

Para poder prestarle el servicio, compartimos sus datos personales, únicamente en la medida necesaria, con los siguientes proveedores que actúan como encargados del tratamiento:

| Proveedor | Para qué lo usamos | Datos que procesa |
| --- | --- | --- |
| Vercel Inc. | Alojamiento (hosting) de la aplicación backend | Todos los datos que viajan por la aplicación, en tránsito |
| Neon, Inc. | Base de datos donde se almacena su información | Todos los datos personales descritos en la sección 2 |
| Cloudinary Ltd. | Almacenamiento de las imágenes de comprobantes de pago | Imagen del comprobante, metadatos del archivo |
| Proveedor de correo (SMTP / Resend) | Envío de correos de verificación (OTP), recuperación de contraseña y avisos | Su correo electrónico y el contenido del mensaje enviado |

No vendemos, rentamos ni compartimos sus datos personales con fines de mercadotecnia ajena a CMP.

**Transferencia internacional.** Los proveedores anteriores operan infraestructura que puede encontrarse fuera de México. Al aceptar este Aviso, usted consiente que sus datos sean tratados por esos encargados conforme a los mismos fines y con medidas de protección equivalentes a las aquí descritas, en cumplimiento del artículo 36 de la LFPDPPP.

## 6. Medidas de seguridad

Aplicamos medidas de seguridad técnicas y administrativas, entre ellas: contraseñas almacenadas como hash bcrypt de un solo sentido; comunicación cifrada HTTPS/TLS con certificate pinning; tokens de sesión guardados en el almacenamiento seguro del sistema operativo; control de acceso por sesión; bloqueo temporal tras intentos fallidos en operaciones sensibles; y revocación global de sesiones ante cambio de contraseña o eliminación de cuenta.

## 7. Derechos ARCO

Usted tiene derecho, en todo momento, a Acceso, Rectificación, Cancelación y Oposición sobre sus datos personales.

### 7.1 Acceso y Rectificación
Desde "Mi cuenta" puede consultar y corregir su nombre, apellidos, edad, sexo y teléfono.

### 7.2 Cancelación y Oposición (solicitud formal)
Use "Eliminar mi cuenta" en la app (requiere contraseña; genera un folio de seguimiento), o escriba a centromedicopichardo@gmail.com. Responderemos dentro de los 20 días hábiles siguientes, conforme al artículo 32 de la LFPDPPP.

### 7.3 Opt-Out
Desde "Mi cuenta" → "Privacidad" puede activar o desactivar, de forma independiente: comunicaciones no esenciales, uso analítico de su actividad, y compartir su progreso académico. Se guarda en nuestros servidores y se aplica de inmediato.

### 7.4 Revocación del consentimiento
Puede revocarlo en cualquier momento por los medios de la sección 7.2, sin efectos retroactivos.

## 8. Conservación de sus datos y qué ocurre cuando solicita la eliminación de su cuenta

Al solicitar la eliminación de su cuenta, ésta se marca como inactiva (baja lógica) tras aprobación administrativa. Conservamos esos datos, bajo baja lógica, durante **18 meses** a partir de la fecha de la baja lógica, por obligaciones contables, fiscales y de conciliación de pagos e inscripciones.

Transcurridos esos 18 meses sin reactivación, sus datos personales se **anonimizan de forma automática e irreversible**: nombre, apellidos, edad, sexo, teléfono y correo se sustituyen de forma permanente por valores genéricos. No se elimina el registro en sí, por integridad referencial con compras, inscripciones y participantes; pero deja de estar asociado a una persona identificable. El proceso corre diariamente de forma automatizada.

## 9. Uso de cookies y tecnologías similares

CMP Móvil no usa cookies de navegador. Usa almacenamiento técnico para su sesión (tokens seguros) y registros internos agregados de uso para analítica, sujetos al Opt-Out de la sección 7.3.

## 10. Cambios a este Aviso de Privacidad

Podemos modificar este Aviso en cualquier momento; cualquier cambio se le comunicará dentro de la aplicación y/o al correo de su cuenta antes de su entrada en vigor.

**Versión de este Aviso: 1.0**, vigente desde la fecha indicada en esta página.
$AVISO$
),
(
  'terminos_condiciones',
  '1.0',
  'Al usar CMP Móvil puedes consultar cursos, comprarlos para ti o para otra persona, reportar tu comprobante de pago para validación del Centro, y dar seguimiento a tu actividad académica. El Centro Médico Pichardo es titular del contenido de los cursos; el uso indebido de la app puede dar lugar a la suspensión de tu cuenta.',
  $TERMINOS$
# Términos y Condiciones de Uso
## CMP Móvil — Centro Médico Pichardo

## 1. Aceptación de los Términos

El uso de la aplicación móvil CMP Móvil implica su aceptación plena de estos Términos y Condiciones de Uso ("los Términos"), así como del Aviso de Privacidad que los acompaña. Estos Términos se celebran entre usted ("el Usuario") y Centro Médico Pichardo ("el Centro"), con domicilio en Calle Alcatraz s/n, Colonia Los Prados, Huejutla de Reyes, Hidalgo, México.

## 2. Descripción del servicio

CMP Móvil permite: consultar el catálogo de cursos; reservar y adquirir cursos para sí mismo o para terceros registrados como participantes; reportar comprobantes de pago para validación administrativa; consultar historial de compras, inscripciones y progreso/asistencia académica; recibir notificaciones relacionadas con sus cursos; y consultar/rectificar los datos de su perfil, administrar sus preferencias de privacidad, y solicitar la eliminación de su cuenta.

## 3. Registro de cuenta

Usted debe proporcionar información veraz, completa y actualizada, y es responsable de la confidencialidad de su contraseña. Si registra a otra persona como participante, declara contar con la autorización necesaria para proporcionar sus datos.

## 4. Proceso de compra, pago y reservas

Al solicitar un curso, el sistema genera una reserva temporal del cupo durante **48 horas** mientras usted reporta su pago. El reporte de un comprobante de pago no implica su validación automática ni garantiza la inscripción: el Centro revisa y confirma o rechaza cada pago de forma manual. Si no se reporta o valida el pago dentro del plazo, el cupo puede liberarse. Los precios se muestran en pesos mexicanos (MXN) e incluyen los impuestos aplicables, salvo que se indique lo contrario.

## 5. Cancelaciones y reembolsos

El Centro dará a conocer su política de cancelaciones y reembolsos de cursos a través de esta misma sección en cuanto esté definida.

## 6. Propiedad intelectual

Los contenidos de los cursos, materiales, guías, textos, logotipos, marcas e imágenes disponibles en la aplicación son propiedad del Centro Médico Pichardo o de sus licenciantes. Queda prohibida su reproducción, distribución o explotación comercial sin autorización previa y por escrito del Centro.

## 7. Uso aceptable

El Usuario se obliga a no: proporcionar información falsa o suplantar la identidad de un tercero; vulnerar la seguridad de la aplicación o acceder a datos que no le pertenecen; usar la aplicación con fines distintos a los previstos en la sección 2; o realizar ingeniería inversa, descompilar o modificar la aplicación. Su incumplimiento puede dar lugar a la suspensión o terminación de la cuenta.

## 8. Limitación de responsabilidad

El Centro pone a disposición del Usuario la aplicación "tal cual" (as is) y hace esfuerzos razonables para que su funcionamiento sea continuo y seguro, sin garantizar que esté libre de interrupciones o errores.

## 9. Suspensión y terminación de cuenta

El Centro podrá suspender o cancelar la cuenta de un Usuario que incumpla estos Términos. El Usuario puede solicitar en cualquier momento la terminación de su propia cuenta conforme al procedimiento del Aviso de Privacidad.

## 10. Modificaciones a estos Términos

El Centro podrá modificar estos Términos en cualquier momento; las modificaciones se notificarán dentro de la aplicación antes de su entrada en vigor.

## 11. Legislación aplicable y jurisdicción

Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Las partes se someten a la jurisdicción de los tribunales competentes del Estado de Hidalgo.

## 12. Contacto

Para cualquier duda, escriba a centromedicopichardo@gmail.com o llame al 771 140 8883.

**Versión de estos Términos: 1.0**, vigente desde la fecha indicada en esta página.
$TERMINOS$
)
) AS v(tipo, version, resumen, contenido)
WHERE NOT EXISTS (
  SELECT 1
  FROM "seguridad"."documentos_legales" d
  WHERE d.tipo = v.tipo AND d.version = v.version
);
