--
-- PostgreSQL database dump
--

\restrict USKvNx1CqqfIL95kTBDOu1fb3wCpaU2U5TAVofRREldtdWa2aq1MNrmMOl0LpCg

-- Dumped from database version 17.8 (a284a84)
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY seguridad.usuarios DROP CONSTRAINT IF EXISTS usuarios_rol_id_roles_id_fk;
ALTER TABLE IF EXISTS ONLY academia.publicaciones DROP CONSTRAINT IF EXISTS publicaciones_id_autor_fkey;
ALTER TABLE IF EXISTS ONLY academia.cursos DROP CONSTRAINT IF EXISTS cursos_id_instructor_fkey;
ALTER TABLE IF EXISTS ONLY academia.academia_infantil DROP CONSTRAINT IF EXISTS academia_infantil_id_autor_fkey;
DROP INDEX IF EXISTS auditoria.idx_backups_tipo;
DROP INDEX IF EXISTS auditoria.idx_backups_fecha;
ALTER TABLE IF EXISTS ONLY seguridad.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY seguridad.usuarios DROP CONSTRAINT IF EXISTS usuarios_correo_unique;
ALTER TABLE IF EXISTS ONLY seguridad.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY seguridad.roles DROP CONSTRAINT IF EXISTS roles_nombre_unique;
ALTER TABLE IF EXISTS ONLY clinica.servicios DROP CONSTRAINT IF EXISTS servicios_pkey;
ALTER TABLE IF EXISTS ONLY clinica.nosotros DROP CONSTRAINT IF EXISTS nosotros_pkey;
ALTER TABLE IF EXISTS ONLY clinica.medicos DROP CONSTRAINT IF EXISTS medicos_pkey;
ALTER TABLE IF EXISTS ONLY auditoria.intentos_recuperacion DROP CONSTRAINT IF EXISTS intentos_recuperacion_pkey;
ALTER TABLE IF EXISTS ONLY auditoria.backups DROP CONSTRAINT IF EXISTS backups_pkey;
ALTER TABLE IF EXISTS ONLY academia.publicaciones DROP CONSTRAINT IF EXISTS publicaciones_pkey;
ALTER TABLE IF EXISTS ONLY academia.cursos DROP CONSTRAINT IF EXISTS cursos_pkey;
ALTER TABLE IF EXISTS ONLY academia.academia_infantil DROP CONSTRAINT IF EXISTS academia_infantil_pkey;
ALTER TABLE IF EXISTS seguridad.usuarios ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS seguridad.roles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS clinica.servicios ALTER COLUMN id_servicio DROP DEFAULT;
ALTER TABLE IF EXISTS clinica.nosotros ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS clinica.medicos ALTER COLUMN id_medico DROP DEFAULT;
ALTER TABLE IF EXISTS auditoria.intentos_recuperacion ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS auditoria.backups ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS academia.publicaciones ALTER COLUMN id_publicacion DROP DEFAULT;
ALTER TABLE IF EXISTS academia.cursos ALTER COLUMN id_curso DROP DEFAULT;
ALTER TABLE IF EXISTS academia.academia_infantil ALTER COLUMN id_guia DROP DEFAULT;
DROP SEQUENCE IF EXISTS seguridad.usuarios_id_seq;
DROP TABLE IF EXISTS seguridad.usuarios;
DROP SEQUENCE IF EXISTS seguridad.roles_id_seq;
DROP TABLE IF EXISTS seguridad.roles;
DROP SEQUENCE IF EXISTS clinica.servicios_id_servicio_seq;
DROP TABLE IF EXISTS clinica.servicios;
DROP SEQUENCE IF EXISTS clinica.nosotros_id_seq;
DROP TABLE IF EXISTS clinica.nosotros;
DROP SEQUENCE IF EXISTS clinica.medicos_id_medico_seq;
DROP TABLE IF EXISTS clinica.medicos;
DROP SEQUENCE IF EXISTS auditoria.intentos_recuperacion_id_seq;
DROP TABLE IF EXISTS auditoria.intentos_recuperacion;
DROP SEQUENCE IF EXISTS auditoria.backups_id_seq;
DROP TABLE IF EXISTS auditoria.backups;
DROP SEQUENCE IF EXISTS academia.publicaciones_id_publicacion_seq;
DROP TABLE IF EXISTS academia.publicaciones;
DROP SEQUENCE IF EXISTS academia.cursos_id_curso_seq;
DROP TABLE IF EXISTS academia.cursos;
DROP SEQUENCE IF EXISTS academia.academia_infantil_id_guia_seq;
DROP TABLE IF EXISTS academia.academia_infantil;
DROP FUNCTION IF EXISTS public.contar_filas_en_todas_tablas();
DROP SCHEMA IF EXISTS seguridad;
DROP SCHEMA IF EXISTS clinica;
DROP SCHEMA IF EXISTS auditoria;
DROP SCHEMA IF EXISTS academia;
--
-- Name: academia; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA academia;


--
-- Name: auditoria; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auditoria;


--
-- Name: clinica; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA clinica;


--
-- Name: seguridad; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA seguridad;


--
-- Name: contar_filas_en_todas_tablas(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.contar_filas_en_todas_tablas() RETURNS TABLE(esquema text, tabla text, filas bigint)
    LANGUAGE plpgsql
    AS $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
    LOOP
        RETURN QUERY EXECUTE format(
            'SELECT %L, %L, COUNT(*) FROM %I.%I',
            r.schemaname, r.tablename, r.schemaname, r.tablename
        );
    END LOOP;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: academia_infantil; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.academia_infantil (
    id_guia integer NOT NULL,
    titulo_guia character varying(255) NOT NULL,
    descripcion_corta text,
    id_autor integer,
    fecha_publicacion date DEFAULT CURRENT_DATE,
    url_imagen text,
    etiquetas text,
    descripcion_larga text,
    activo boolean DEFAULT true
);


--
-- Name: academia_infantil_id_guia_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.academia_infantil_id_guia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: academia_infantil_id_guia_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.academia_infantil_id_guia_seq OWNED BY academia.academia_infantil.id_guia;


--
-- Name: cursos; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.cursos (
    id_curso integer NOT NULL,
    titulo_curso character varying(200) NOT NULL,
    descripcion text,
    id_instructor integer,
    categoria character varying(50),
    fecha_inicio date,
    fecha_fin date,
    horario character varying(50),
    modalidad character varying(20),
    dirigido_a character varying(50),
    cupo_maximo integer,
    ubicacion character varying(150),
    costo numeric(10,2) DEFAULT 0.00,
    url_imagen_portada text,
    activo boolean DEFAULT true,
    cupos_ocupados integer DEFAULT 0
);


--
-- Name: cursos_id_curso_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.cursos_id_curso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cursos_id_curso_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.cursos_id_curso_seq OWNED BY academia.cursos.id_curso;


--
-- Name: publicaciones; Type: TABLE; Schema: academia; Owner: -
--

CREATE TABLE academia.publicaciones (
    id_publicacion integer NOT NULL,
    titulo_noticia character varying(255) NOT NULL,
    resumen_bajada text,
    id_autor integer,
    fecha_publicacion date DEFAULT CURRENT_DATE,
    etiquetas text,
    url_imagen text,
    contenido_completo text,
    activo boolean DEFAULT true
);


--
-- Name: publicaciones_id_publicacion_seq; Type: SEQUENCE; Schema: academia; Owner: -
--

CREATE SEQUENCE academia.publicaciones_id_publicacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: publicaciones_id_publicacion_seq; Type: SEQUENCE OWNED BY; Schema: academia; Owner: -
--

ALTER SEQUENCE academia.publicaciones_id_publicacion_seq OWNED BY academia.publicaciones.id_publicacion;


--
-- Name: backups; Type: TABLE; Schema: auditoria; Owner: -
--

CREATE TABLE auditoria.backups (
    id integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tipo character varying(20) NOT NULL,
    "tamaño" character varying(20),
    archivo_url text,
    estado character varying(20) DEFAULT 'exitoso'::character varying
);


--
-- Name: backups_id_seq; Type: SEQUENCE; Schema: auditoria; Owner: -
--

CREATE SEQUENCE auditoria.backups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: backups_id_seq; Type: SEQUENCE OWNED BY; Schema: auditoria; Owner: -
--

ALTER SEQUENCE auditoria.backups_id_seq OWNED BY auditoria.backups.id;


--
-- Name: intentos_recuperacion; Type: TABLE; Schema: auditoria; Owner: -
--

CREATE TABLE auditoria.intentos_recuperacion (
    id integer NOT NULL,
    identificador text NOT NULL,
    conteo integer DEFAULT 0,
    ultimo_intento timestamp without time zone DEFAULT now(),
    bloqueado_hasta timestamp without time zone
);


--
-- Name: intentos_recuperacion_id_seq; Type: SEQUENCE; Schema: auditoria; Owner: -
--

CREATE SEQUENCE auditoria.intentos_recuperacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: intentos_recuperacion_id_seq; Type: SEQUENCE OWNED BY; Schema: auditoria; Owner: -
--

ALTER SEQUENCE auditoria.intentos_recuperacion_id_seq OWNED BY auditoria.intentos_recuperacion.id;


--
-- Name: medicos; Type: TABLE; Schema: clinica; Owner: -
--

CREATE TABLE clinica.medicos (
    id_medico integer NOT NULL,
    nombres character varying(100) NOT NULL,
    apellido_paterno character varying(100) NOT NULL,
    apellido_materno character varying(100),
    especialidad character varying(100),
    hospital_clinica character varying(150),
    direccion text,
    url_foto character varying(255),
    activo boolean DEFAULT true
);


--
-- Name: medicos_id_medico_seq; Type: SEQUENCE; Schema: clinica; Owner: -
--

CREATE SEQUENCE clinica.medicos_id_medico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medicos_id_medico_seq; Type: SEQUENCE OWNED BY; Schema: clinica; Owner: -
--

ALTER SEQUENCE clinica.medicos_id_medico_seq OWNED BY clinica.medicos.id_medico;


--
-- Name: nosotros; Type: TABLE; Schema: clinica; Owner: -
--

CREATE TABLE clinica.nosotros (
    id integer NOT NULL,
    mision text NOT NULL,
    vision text NOT NULL,
    valores text[] NOT NULL,
    nuestra_historia text NOT NULL,
    compromiso text NOT NULL,
    url_imagen text DEFAULT '/pediatric-illustration.png'::text
);


--
-- Name: nosotros_id_seq; Type: SEQUENCE; Schema: clinica; Owner: -
--

CREATE SEQUENCE clinica.nosotros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nosotros_id_seq; Type: SEQUENCE OWNED BY; Schema: clinica; Owner: -
--

ALTER SEQUENCE clinica.nosotros_id_seq OWNED BY clinica.nosotros.id;


--
-- Name: servicios; Type: TABLE; Schema: clinica; Owner: -
--

CREATE TABLE clinica.servicios (
    id_servicio integer NOT NULL,
    titulo_servicio character varying(150) NOT NULL,
    descripcion text,
    ubicacion character varying(200),
    url_image text,
    texto_alt character varying(150),
    diseno_tipo character varying(20) DEFAULT 'vertical'::character varying,
    activo boolean DEFAULT true
);


--
-- Name: servicios_id_servicio_seq; Type: SEQUENCE; Schema: clinica; Owner: -
--

CREATE SEQUENCE clinica.servicios_id_servicio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: servicios_id_servicio_seq; Type: SEQUENCE OWNED BY; Schema: clinica; Owner: -
--

ALTER SEQUENCE clinica.servicios_id_servicio_seq OWNED BY clinica.servicios.id_servicio;


--
-- Name: roles; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.roles (
    id integer NOT NULL,
    nombre text NOT NULL
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: seguridad; Owner: -
--

CREATE SEQUENCE seguridad.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: seguridad; Owner: -
--

ALTER SEQUENCE seguridad.roles_id_seq OWNED BY seguridad.roles.id;


--
-- Name: usuarios; Type: TABLE; Schema: seguridad; Owner: -
--

CREATE TABLE seguridad.usuarios (
    id integer NOT NULL,
    nombre text NOT NULL,
    "apellidoPaterno" text NOT NULL,
    "apellidoMaterno" text,
    edad integer NOT NULL,
    sexo text NOT NULL,
    telefono text NOT NULL,
    correo text NOT NULL,
    contrasena text NOT NULL,
    rol_id integer NOT NULL,
    reset_token text,
    reset_token_expiry timestamp without time zone,
    intentos_fallidos integer DEFAULT 0,
    bloqueado_hasta timestamp without time zone,
    version_token integer DEFAULT 1,
    mfa_habilitado boolean DEFAULT false,
    secreto_mfa text,
    activo boolean DEFAULT true
);


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: seguridad; Owner: -
--

CREATE SEQUENCE seguridad.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: seguridad; Owner: -
--

ALTER SEQUENCE seguridad.usuarios_id_seq OWNED BY seguridad.usuarios.id;


--
-- Name: academia_infantil id_guia; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.academia_infantil ALTER COLUMN id_guia SET DEFAULT nextval('academia.academia_infantil_id_guia_seq'::regclass);


--
-- Name: cursos id_curso; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.cursos ALTER COLUMN id_curso SET DEFAULT nextval('academia.cursos_id_curso_seq'::regclass);


--
-- Name: publicaciones id_publicacion; Type: DEFAULT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.publicaciones ALTER COLUMN id_publicacion SET DEFAULT nextval('academia.publicaciones_id_publicacion_seq'::regclass);


--
-- Name: backups id; Type: DEFAULT; Schema: auditoria; Owner: -
--

ALTER TABLE ONLY auditoria.backups ALTER COLUMN id SET DEFAULT nextval('auditoria.backups_id_seq'::regclass);


--
-- Name: intentos_recuperacion id; Type: DEFAULT; Schema: auditoria; Owner: -
--

ALTER TABLE ONLY auditoria.intentos_recuperacion ALTER COLUMN id SET DEFAULT nextval('auditoria.intentos_recuperacion_id_seq'::regclass);


--
-- Name: medicos id_medico; Type: DEFAULT; Schema: clinica; Owner: -
--

ALTER TABLE ONLY clinica.medicos ALTER COLUMN id_medico SET DEFAULT nextval('clinica.medicos_id_medico_seq'::regclass);


--
-- Name: nosotros id; Type: DEFAULT; Schema: clinica; Owner: -
--

ALTER TABLE ONLY clinica.nosotros ALTER COLUMN id SET DEFAULT nextval('clinica.nosotros_id_seq'::regclass);


--
-- Name: servicios id_servicio; Type: DEFAULT; Schema: clinica; Owner: -
--

ALTER TABLE ONLY clinica.servicios ALTER COLUMN id_servicio SET DEFAULT nextval('clinica.servicios_id_servicio_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.roles ALTER COLUMN id SET DEFAULT nextval('seguridad.roles_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuarios ALTER COLUMN id SET DEFAULT nextval('seguridad.usuarios_id_seq'::regclass);


--
-- Data for Name: academia_infantil; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.academia_infantil (id_guia, titulo_guia, descripcion_corta, id_autor, fecha_publicacion, url_imagen, etiquetas, descripcion_larga, activo) FROM stdin;
5	11	11	1	2026-03-08	1	1	11	t
\.


--
-- Data for Name: cursos; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.cursos (id_curso, titulo_curso, descripcion, id_instructor, categoria, fecha_inicio, fecha_fin, horario, modalidad, dirigido_a, cupo_maximo, ubicacion, costo, url_imagen_portada, activo, cupos_ocupados) FROM stdin;
9	5 Inteligencias	2efw	2	Salud	2018-09-12	2018-11-11	16:00 - 19:00	Presencial	Padres	30	Auditorio Principal	300.00	/logo.png	t	4
7	Las 5 Inteligencias del Cerebro Infantil XD	Curso para padres sobre desarrollo cognitivo infantil Prueba de Editar XD	1	Psicología Infantil	2025-12-05	2025-12-06	16:00 - 19:00	Presencial	Padres	3	Auditorio Principal	1234.00	/Inteligencias.jpg	t	0
\.


--
-- Data for Name: publicaciones; Type: TABLE DATA; Schema: academia; Owner: -
--

COPY academia.publicaciones (id_publicacion, titulo_noticia, resumen_bajada, id_autor, fecha_publicacion, etiquetas, url_imagen, contenido_completo, activo) FROM stdin;
10	Dermatitis Atópica: Cuidados de la Piele	Cómo hidratar y tratar la piel sensible de los niños con eccemas.	1	2026-03-05	piel,dermatologia,cuidados	/Pichardo.jpg	1	t
9	Uso de Pantallas: Recomendaciones por Edades	¿Cuánto tiempo pueden pasar los niños frente a tablets y celulares?	1	2026-02-25	tecnologia,crianza,consejos	/Pichardo.jpg	La Academia de Pediatría sugiere evitar pantallas antes de los 2 años. El exceso de luz azul afecta la melatonina y el desarrollo del lenguaje...	t
4	Introducción a la Alimentación Complementaria	¿Cuándo empezar con papillas? Descubre el método BLW y la introducción de sólidos.	3	2026-01-25	nutricion,alimentacion,bebes	/Pichardo.jpg	A los 6 meses, la leche ya no es suficiente. Es hora de introducir nuevos sabores y texturas de manera segura y divertida para el infante...	f
6	Prevención de Accidentes en el Hogar	Consejos de seguridad para gateadores y niños que empiezan a caminar.	2	2026-02-05	seguridad,prevencion,hogar	/Pichardo.jpg	El hogar puede ser un lugar peligroso si no se toman precauciones. Cubra enchufes, asegure esquinas de muebles y nunca deje productos de limpieza al alcance...	f
7	Salud Mental: Identificando la Ansiedad Infantil	Señales tempranas de estrés y ansiedad en niños en edad escolar.	3	2026-02-12	psicologia,salud mental,niños	/Pichardo.jpg	Los niños también sufren estrés. Cambios en el apetito, irritabilidad o problemas para dormir pueden ser señales de que algo no anda bien emocionalmente...	f
1	Guía de Lactancia Materna para Principiantes	Consejos esenciales para un inicio exitoso en la lactancia, desmintiendo mitos comunes.	1	2026-01-10	lactancia,nutricion,bebes	/Pichardo.jpg	La lactancia materna es el mejor comienzo para su bebé. En este artículo detallamos las posiciones correctas y cómo asegurar que el bebé esté succionando bien...	t
8	Beneficios del Deporte en la Infancia	Por qué la actividad física es clave para el desarrollo óseo y social.	2	2026-02-18	deporte,salud,desarrollo	/Pichardo.jpg	El deporte no solo fortalece los músculos, sino que enseña disciplina y trabajo en equipo. Se recomienda al menos una hora de actividad física diaria...	f
2	Importancia de las Vacunas en el Primer Año	Conozca el calendario de vacunación y por qué es vital proteger a su hijo desde temprano.	2	2026-01-15	vacunas,salud,prevencion	/Pichardo.jpg	Las vacunas salvan vidas. Durante el primer año, el sistema inmunológico del bebé es frágil y las vacunas actúan como un escudo protector contra enfermedades...	t
5	El sueño infantil: ¿Cuánto debe dormir mi hijo?	Entienda los ciclos de sueño según la edad y cómo establecer una rutina saludable.	1	2026-02-01	sueño,rutina,bienestar	/Pichardo.jpg	El descanso es fundamental para el desarrollo cerebral. Los recién nacidos duermen gran parte del día, pero a medida que crecen, necesitan rutinas claras...	t
3	¿Cómo manejar la fiebre en casa?	Una guía práctica sobre cuándo usar medicamentos y cuándo acudir a urgencias.	1	2026-01-20	fiebre,cuidados,urgencias	/Pichardo.jpg	La fiebre no es una enfermedad, sino un síntoma de que el cuerpo está luchando. Mantenga al niño hidratado y vigile signos de alarma como manchas en la piel...	t
\.


--
-- Data for Name: backups; Type: TABLE DATA; Schema: auditoria; Owner: -
--

COPY auditoria.backups (id, fecha, tipo, "tamaño", archivo_url, estado) FROM stdin;
5	2026-03-08 00:51:12.485741	completo	20.34 KB	backups/backup-1772931073378.sql	exitoso
\.


--
-- Data for Name: intentos_recuperacion; Type: TABLE DATA; Schema: auditoria; Owner: -
--

COPY auditoria.intentos_recuperacion (id, identificador, conteo, ultimo_intento, bloqueado_hasta) FROM stdin;
2	jesushfernandezh@gmail.com	1	2025-12-01 00:12:14.964	\N
3	jesushfh123@gmail.com	1	2025-12-01 00:12:46.053	\N
1	jesusf1705dck@gmail.com	3	2025-12-01 00:14:19.72	2025-12-01 03:14:19.72
\.


--
-- Data for Name: medicos; Type: TABLE DATA; Schema: clinica; Owner: -
--

COPY clinica.medicos (id_medico, nombres, apellido_paterno, apellido_materno, especialidad, hospital_clinica, direccion, url_foto, activo) FROM stdin;
4	Ricardo	Torres	Méndez	Cardiología Pediátrica	Centro Médico Pichardo	Av. Independencia 456, Poza Rica	ricardo_torres_gzmjms	t
6	Javier	Moreno	Pichardo	Pediatra en Jefe	Centro Médico Pichardo	Blvd. Adolfo Ruiz Cortines 789	/Pichardo/jpg	t
8	Jorge	Luna	Salazar	Otorrinolaringología	Centro Médico Pichardo	Av. Central 123, Poza Rica	no_imagen_uwvduy	t
9	Adriana	Meza	Villalobos	Alergología Infantil	Centro Médico Pichardo	Blvd. Adolfo Ruiz Cortines 789	no_imagen_uwvduy	t
2	Luis	Ramírez	Pérez	Pediatría	Centro Médico Pichardo	Av. Independencia 456, Poza Rica	https://res.cloudinary.com/dydfxuywl/image/upload/v1773871523/centro-medico/medicos/vusbibz0jgkzc7slujqn.jpg	t
3	Patricia	Gómez	López	Nutrición Pediátrica	Centro Médico Pichardo	Blvd. Adolfo Ruiz Cortines 789	https://res.cloudinary.com/dydfxuywl/image/upload/v1773957690/centro-medico/medicos/vbzdudvp6tz2771o4gwd.jpg	t
11	Luis Jesus	Chavez	Vargas	Ginecologo	Centro Médico Pichardo	Blvd. Adolfo Ruiz Cortines 789	https://res.cloudinary.com/dydfxuywl/image/upload/v1773957930/centro-medico/medicos/gabjcaugda4n7kkvf1lf.jpg	t
7	Sofía	Hernández	Vázquez	Endocrinología	Centro Médico Pichardo	Av. Independencia 456, Poza Rica	https://res.cloudinary.com/dydfxuywl/image/upload/v1773958057/centro-medico/medicos/kd8bu8zqu2314wciodlm.png	t
5	Lucía	Fernández	Ramos	Dermatología Pediátrica	Centro Médico Pichardo	Av. Central 123, Poza Rica	https://res.cloudinary.com/dydfxuywl/image/upload/v1773958314/centro-medico/medicos/stexjdbbmaufp6qe9pde.png	f
1	Mariana	Echeverría	Sánchez	Psicología Infantil	Centro Médico Pichardo	Av. Central 123, Poza Rica	https://res.cloudinary.com/dydfxuywl/image/upload/v1773956349/centro-medico/medicos/o9scjhh79we4vkxuijjm.png	t
10	Francisco	Javier	Solís	Cirugía Pediátrica	Centro Médico Pichardo	Av. Independencia 456, Poza Rica	https://res.cloudinary.com/dydfxuywl/image/upload/v1773984271/centro-medico/medicos/igxz8wtdunlkahun9r8m.png	t
\.


--
-- Data for Name: nosotros; Type: TABLE DATA; Schema: clinica; Owner: -
--

COPY clinica.nosotros (id, mision, vision, valores, nuestra_historia, compromiso, url_imagen) FROM stdin;
1	Proveer atención médica pediátrica de la más alta calidad, centrada en la calidez humana y la prevención.dsfsd	Ser el centro pediátrico de referencia regional, reconocido por la excelencia y el trato humano.sdfds	{Humanidad,Excelencia,Confianza,Innovación,Respeto,sdfsdf}	Fundado hace más de una década, el Centro Médico Pichardo nació de la convicción de que los niños merecen cuidado especializado...sfdsf	Nuestro equipo está unido por el mismo juramento: ofrecer lo mejor de nosotros en cada consulta para asegurar su tranquilidad.dfsfs	https://res.cloudinary.com/dydfxuywl/image/upload/v1774157260/centro-medico/quienes-somos/wyhmlhsia8oe6vpwgn2j.webp
\.


--
-- Data for Name: servicios; Type: TABLE DATA; Schema: clinica; Owner: -
--

COPY clinica.servicios (id_servicio, titulo_servicio, descripcion, ubicacion, url_image, texto_alt, diseno_tipo, activo) FROM stdin;
1	Consulta Pediátrica General	Control de niño sano, seguimiento de crecimiento, desarrollo y vacunación integral.	Consultorio 101 - Ala Norte	noimage	Pediatra examinando a un niño con un estetoscopio	card_highlight	t
2	Neonatología Especializada	Atención integral para recién nacidos prematuros o con cuidados especiales post-parto.	Unidad de Cuidados Intensivos	noimage	Bebé recién nacido en cuna térmica de hospital	card_standard	t
3	Vacunación y Serología	Aplicación de esquema nacional e internacional de vacunas en un entorno seguro.	Módulo de Preventiva	noimage	Enfermera preparando jeringa con dosis de vacuna	card_standard	t
4	Urgencias Pediátricas 24/7	Atención inmediata para accidentes, fiebre alta y complicaciones respiratorias agudas.	Planta Baja - Emergencias	noimage	Entrada de emergencias pediátricas con ambulancia	banner_urgent	t
5	Odontopediatría	Cuidado dental preventivo y correctivo adaptado para los más pequeños de casa.	Piso 2 - Odontología	noimage	Niña sonriendo sentada en una silla de dentista colorida	card_standard	t
6	Nutrición Infantil	Planes de alimentación para combatir obesidad, desnutrición o alergias alimentarias.	Consultorio 205	noimage	Nutricionista mostrando frutas y verduras a un niño	card_minimal	t
7	Psicología Infantil y Juvenil	Apoyo emocional y terapia de conducta para niños y adolescentes en etapas críticas.	Área de Terapia - Piso 3	noimage	Psicóloga jugando con un niño en sesión terapéutica	card_standard	t
8	Estimulación Temprana	Talleres diseñados para potenciar las capacidades motoras y cognitivas de los bebés.	Gimnasio Terapéutico	noimage	Bebé gateando sobre bloques de espuma de colores	card_standard	t
9	Neumología Pediátrica	Tratamiento especializado para asma, rinitis y enfermedades respiratorias crónicas.	Consultorio 108	noimage	Niño usando un espirómetro en consulta médica	card_standard	t
10	Telemedicina Pediátrica	Consultas virtuales para dudas rápidas, seguimiento y lectura de laboratorios.	Plataforma Online	noimage	Madre hablando con pediatra a través de una tablet	banner_digital	t
11	Cardiología Pediátrica	Evaluación del corazón infantil, electrocardiogramas y detección de soplos o arritmias.	Piso 2 - Especialidades	noimage	Médico realizando un ecocardiograma a un niño pequeño	card_standard	t
12	Terapia de Lenguaje	Diagnóstico y tratamiento de trastornos del habla, dicción y comunicación social.	Área de Rehabilitación	noimage	Terapeuta usando tarjetas con dibujos para enseñar a un niño	card_standard	t
14	Dermatología Infantil	Tratamiento de dermatitis atópica, alergias cutáneas, acné juvenil y lunares.	Consultorio 302	noimage	Dermatóloga revisando la piel del brazo de un bebé	card_standard	t
15	Oftalmología Pediátrica	Exámenes de la vista, detección de estrabismo y adaptación de lentes graduados.	Piso 3 - Oftalmo	noimage	Niño probándose monturas de lentes de colores	card_standard	t
16	Endocrinología y Crecimiento	Tratamiento de diabetes infantil, problemas de tiroides y trastornos del crecimiento.	Consultorio 210	noimage	Doctor midiendo la estatura de un adolescente en la pared	card_standard	t
17	Laboratorio Clínico Pediátrico	Toma de muestras de sangre y orina con técnicas diseñadas para minimizar el dolor.	Planta Baja - Lab	noimage	Niño recibiendo un sticker después de una toma de sangre	card_minimal	t
18	Gastroenterología Infantil	Manejo de reflujo, intolerancias alimentarias y dolores abdominales crónicos.	Consultorio 105	noimage	Especialista explicando un diagrama del sistema digestivo	card_standard	t
19	Neurología Infantil	Atención para trastornos del sueño, epilepsia, TDAH y desarrollo neurológico.	Piso 4 - Neurología	noimage	Neuróloga conversando con un niño y sus padres	card_highlight	t
20	Taller de Primeros Auxilios para Padres	Curso práctico sobre RCP neonatal, atragantamiento y manejo de heridas en casa.	Auditorio Principal	noimage	Padres practicando maniobras de reanimación en un maniquí	banner_wide	t
13	Cirugía Pediátrica Ambulatoria	Procedimientos quirúrgicos menores con recuperación rápida y cuidados especializados.	Pabellón Quirúrgico A	https://res.cloudinary.com/dydfxuywl/image/upload/v1773988731/centro-medico/servicios/wn8aazeb7m8pklfjcqqi.jpg	Cirugía Pediátrica Ambulatoria	card_highlight	t
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: seguridad; Owner: -
--

COPY seguridad.roles (id, nombre) FROM stdin;
1	cliente
2	admin
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: seguridad; Owner: -
--

COPY seguridad.usuarios (id, nombre, "apellidoPaterno", "apellidoMaterno", edad, sexo, telefono, correo, contrasena, rol_id, reset_token, reset_token_expiry, intentos_fallidos, bloqueado_hasta, version_token, mfa_habilitado, secreto_mfa, activo) FROM stdin;
13	Jesus	Fernandez	Fernandez	20	masculino	7713039166	jesushfh123@gmail.com	$2b$10$e4daBPIwI6SeF7BAlAKutuMKyb3cSLs6XNYrOJvdd0l3Xde0J7y.2	1	\N	\N	0	\N	1	f	\N	t
11	Jesus	Fernandez	Hernandez	20	masculino	7713039166	jesushfernandezh@gmail.com	$2b$10$IepTxpop8Z3OZOtBQJycIOU61QPBFvhodGaR9Xz6de8ecfbgKRVzS	2	\N	\N	0	\N	1	f	\N	t
16	Luis Jesus	Chavez	Vargas	20	masculino	7717205499	chavezvargasluisjesus@gmail.com	$2b$10$j4ou3VPT8OwpUdvMB90Iz.0PbcVWyIHwR79.GCrYJO6iJWfooTseC	2	\N	\N	0	\N	1	f	\N	t
1	Admin	Sistema	Principal	30	Masculino	0000000000	admin@test.com	$2b$10$Pj/8.W.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0	1	\N	\N	0	\N	1	f	\N	t
14	j	j	j	18	masculino	1234567890	j@gmail.com	$2b$10$icHzpXAZkLRh09v9IgDn/upekYA.IhUzx3m9E5wQQsejJaDsWvSaS	1	\N	\N	0	\N	1	f	\N	t
3	Jesus	Fernandez	Hernandez	20	masculino	7713039166	jesusf1705dck@gmail.com	$2b$10$Zw869fxEHny1dVA8zZiqK.S7ry4g5mtPFRQ/pWTKq1MCsoMRRH2Ry	2	2eb109f1547fe8556839dedffd4ccd113c73c0bb6cd41ce5c410030ac83a9bdf	2025-12-01 00:29:20.02	0	\N	1	f	\N	t
15	Prueba_ED	Prueba1	Prueba11	20	femenino	7594856452	20230015@uthh.edu.mx	$2b$10$ekle/mrRdPOspslN4.JywuwfEKMTAd54sG6mwABM7laIhWEM5EH2a	1	\N	\N	1	\N	1	f	\N	t
\.


--
-- Name: academia_infantil_id_guia_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.academia_infantil_id_guia_seq', 5, true);


--
-- Name: cursos_id_curso_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.cursos_id_curso_seq', 9, true);


--
-- Name: publicaciones_id_publicacion_seq; Type: SEQUENCE SET; Schema: academia; Owner: -
--

SELECT pg_catalog.setval('academia.publicaciones_id_publicacion_seq', 11, true);


--
-- Name: backups_id_seq; Type: SEQUENCE SET; Schema: auditoria; Owner: -
--

SELECT pg_catalog.setval('auditoria.backups_id_seq', 5, true);


--
-- Name: intentos_recuperacion_id_seq; Type: SEQUENCE SET; Schema: auditoria; Owner: -
--

SELECT pg_catalog.setval('auditoria.intentos_recuperacion_id_seq', 3, true);


--
-- Name: medicos_id_medico_seq; Type: SEQUENCE SET; Schema: clinica; Owner: -
--

SELECT pg_catalog.setval('clinica.medicos_id_medico_seq', 11, true);


--
-- Name: nosotros_id_seq; Type: SEQUENCE SET; Schema: clinica; Owner: -
--

SELECT pg_catalog.setval('clinica.nosotros_id_seq', 1, true);


--
-- Name: servicios_id_servicio_seq; Type: SEQUENCE SET; Schema: clinica; Owner: -
--

SELECT pg_catalog.setval('clinica.servicios_id_servicio_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: -
--

SELECT pg_catalog.setval('seguridad.roles_id_seq', 3, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: seguridad; Owner: -
--

SELECT pg_catalog.setval('seguridad.usuarios_id_seq', 17, true);


--
-- Name: academia_infantil academia_infantil_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.academia_infantil
    ADD CONSTRAINT academia_infantil_pkey PRIMARY KEY (id_guia);


--
-- Name: cursos cursos_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.cursos
    ADD CONSTRAINT cursos_pkey PRIMARY KEY (id_curso);


--
-- Name: publicaciones publicaciones_pkey; Type: CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.publicaciones
    ADD CONSTRAINT publicaciones_pkey PRIMARY KEY (id_publicacion);


--
-- Name: backups backups_pkey; Type: CONSTRAINT; Schema: auditoria; Owner: -
--

ALTER TABLE ONLY auditoria.backups
    ADD CONSTRAINT backups_pkey PRIMARY KEY (id);


--
-- Name: intentos_recuperacion intentos_recuperacion_pkey; Type: CONSTRAINT; Schema: auditoria; Owner: -
--

ALTER TABLE ONLY auditoria.intentos_recuperacion
    ADD CONSTRAINT intentos_recuperacion_pkey PRIMARY KEY (id);


--
-- Name: medicos medicos_pkey; Type: CONSTRAINT; Schema: clinica; Owner: -
--

ALTER TABLE ONLY clinica.medicos
    ADD CONSTRAINT medicos_pkey PRIMARY KEY (id_medico);


--
-- Name: nosotros nosotros_pkey; Type: CONSTRAINT; Schema: clinica; Owner: -
--

ALTER TABLE ONLY clinica.nosotros
    ADD CONSTRAINT nosotros_pkey PRIMARY KEY (id);


--
-- Name: servicios servicios_pkey; Type: CONSTRAINT; Schema: clinica; Owner: -
--

ALTER TABLE ONLY clinica.servicios
    ADD CONSTRAINT servicios_pkey PRIMARY KEY (id_servicio);


--
-- Name: roles roles_nombre_unique; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.roles
    ADD CONSTRAINT roles_nombre_unique UNIQUE (nombre);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_correo_unique; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuarios
    ADD CONSTRAINT usuarios_correo_unique UNIQUE (correo);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: idx_backups_fecha; Type: INDEX; Schema: auditoria; Owner: -
--

CREATE INDEX idx_backups_fecha ON auditoria.backups USING btree (fecha DESC);


--
-- Name: idx_backups_tipo; Type: INDEX; Schema: auditoria; Owner: -
--

CREATE INDEX idx_backups_tipo ON auditoria.backups USING btree (tipo);


--
-- Name: academia_infantil academia_infantil_id_autor_fkey; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.academia_infantil
    ADD CONSTRAINT academia_infantil_id_autor_fkey FOREIGN KEY (id_autor) REFERENCES clinica.medicos(id_medico);


--
-- Name: cursos cursos_id_instructor_fkey; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.cursos
    ADD CONSTRAINT cursos_id_instructor_fkey FOREIGN KEY (id_instructor) REFERENCES clinica.medicos(id_medico);


--
-- Name: publicaciones publicaciones_id_autor_fkey; Type: FK CONSTRAINT; Schema: academia; Owner: -
--

ALTER TABLE ONLY academia.publicaciones
    ADD CONSTRAINT publicaciones_id_autor_fkey FOREIGN KEY (id_autor) REFERENCES clinica.medicos(id_medico);


--
-- Name: usuarios usuarios_rol_id_roles_id_fk; Type: FK CONSTRAINT; Schema: seguridad; Owner: -
--

ALTER TABLE ONLY seguridad.usuarios
    ADD CONSTRAINT usuarios_rol_id_roles_id_fk FOREIGN KEY (rol_id) REFERENCES seguridad.roles(id);


--
-- PostgreSQL database dump complete
--

\unrestrict USKvNx1CqqfIL95kTBDOu1fb3wCpaU2U5TAVofRREldtdWa2aq1MNrmMOl0LpCg

